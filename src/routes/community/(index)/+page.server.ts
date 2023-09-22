import { trpc } from "$trpc/client";
import { message, superValidate } from "sveltekit-superforms/server";
import { z } from  "zod";
import l from "$lib/server/Logger";
import type { PageServerLoad, PageServerLoadEvent } from "./$types";
import { fail, type Actions } from "@sveltejs/kit";
import prisma from "$lib/server/Prisma";
import { TRPCError } from "@trpc/server";

const newCreatorSchema = z.object({
    name: z.string().nonempty("Must provide a name").min(3, "Name must be longer than 3").max(30, "Name must be shorter than 30").trim().refine(async (input) => {
        const nameCount = await prisma.communityCreator
            .count({
                where: {
                    name: {
                        equals: input,
                        mode: "insensitive",
                    }
                }
            });
        return nameCount === 0;
    }, "Name already exists"),
    description: z.string().default(""),
    imageLink: z.string().default("/default-placeholder-image.png")
});

const editCreatorSchema = z.object({
    id: z.number(),
    name: z.string().nonempty("Must provide a name").min(3, "Name must be longer than 3").max(30, "Name must be shorter than 30").trim(),
    description: z.string().default(""),
    imageLink: z.string().default("/default-placeholder-image.png")
}).refine(async (values) => {
    const sameNames = await prisma.communityCreator
        .findMany({
            where: {
                name: {
                    equals: values.name,
                    mode: "insensitive",
                }
            }
        });
    return sameNames.length === 0 || (sameNames.some(x => x.id === values.id) && sameNames.length === 1);
}, "Name already exists");

export const load: PageServerLoad = async (event: PageServerLoadEvent) => {
    const newCreatorForm = await superValidate(newCreatorSchema);
    const editCreatorForm = await superValidate(editCreatorSchema);

    const communityCreators = await trpc(event).community.getCommunityCreators.query();
    return {
        communityCreators,
        newCreatorForm,
        editCreatorForm
    }
}

export const actions = {
    newcreator: async (event) => {
        const newCreatorForm = await superValidate(event.request, newCreatorSchema);
        const editCreatorForm = await superValidate(editCreatorSchema);

        if (!newCreatorForm.valid) {
            return fail(400, { newCreatorForm, editCreatorForm });
        }
        
        try {
            await trpc(event).contributor.createCommunityCreator.mutate({
                name: newCreatorForm.data.name,
                description: newCreatorForm.data.description,
                imageLink: newCreatorForm.data.imageLink
            });

            return message(newCreatorForm, "Creator saved!");
        } catch (e) {
            if (e instanceof TRPCError) {
                l.error(`Got TRPC Error: ${e.message}`);
            } else {
                l.error(`Got Exception when trying to make new CommunityCreator`);
            }
            return fail(400, { newCreatorForm, editCreatorForm });
        }
    },
    editcreator: async (event) => {
        const newCreatorForm = await superValidate(newCreatorSchema);
        const editCreatorForm = await superValidate(event.request, editCreatorSchema);

        if (!editCreatorForm.valid) {
            return fail(400, { newCreatorForm, editCreatorForm });
        }
        try {
            await trpc(event).contributor.updateCommunityCreator.mutate({
                communityCreatorId: editCreatorForm.data.id,
                name: editCreatorForm.data.name,
                description: editCreatorForm.data.description,
                imageLink: editCreatorForm.data.imageLink
            });

            return message(editCreatorForm, "Creator updated!");
        } catch (e) {
            return fail(400, { newCreatorForm, editCreatorForm });
        }
    }
} satisfies Actions;