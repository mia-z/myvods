import { trpc } from "$trpc/client";
import { error, type Actions, fail } from "@sveltejs/kit";
import type { PageServerLoad, PageServerLoadEvent } from "./$types";
import { z } from "zod";
import { message, setError, superValidate } from "sveltekit-superforms/server";
import { Duration } from "luxon";
import { TRPCClientError } from "@trpc/client";

const newAnnotationSchema = z.object({
    communityVodId: z.number(),
    note: z.string().default(""),
    subject: z.string().default(""),
    game: z.string().default(""),
    hour: z.number().nonnegative("Hours cannot be negative").min(0).max(23).default(0),
    minute: z.number().nonnegative("Minutes cannot be negative").min(0).max(59).default(0),
    second: z.number().nonnegative("Seconds cannot be negative").min(0).max(59).default(0)
});

const editAnnotationSchema = z.object({
    annotationId: z.number(),
    note: z.string().default(""),
    subject: z.string().default(""),
    game: z.string().default(""),
    hour: z.number().nonnegative("Hours cannot be negative").min(0).max(23).default(0),
    minute: z.number().nonnegative("Minutes cannot be negative").min(0).max(59).default(0),
    second: z.number().nonnegative("Seconds cannot be negative").min(0).max(59).default(0)
});

export const load: PageServerLoad = async (event: PageServerLoadEvent) => {
    const communityVodWithAnnotations = await trpc(event).community.getCommunityVodBySlugWithAnnotations.query(event.params.communityVodSlug);
    
    if (communityVodWithAnnotations) {
        if (event.locals.communityContributorNick) {
            const newAnnotationForm = await superValidate(newAnnotationSchema);
            const editAnnotationForm = await superValidate(editAnnotationSchema);

            return {
                editAnnotationForm,
                newAnnotationForm,
                communityContributorNick: event.locals.communityContributorNick,
                communityContributorId: event.locals.communityContributorId,
                communityVodWithAnnotations
            }
        } else {
            return {
                communityContributorNick: event.locals.communityContributorNick,
                communityContributorId: event.locals.communityContributorId,
                communityVodWithAnnotations
            }
        }
    } else {
        throw error(404, "Community Creator Vod Not found")
    }
}

export const actions = {
    newannotation: async (event) => {
        const editAnnotationForm = await superValidate(editAnnotationSchema);
        const newAnnotationForm = await superValidate(event.request, newAnnotationSchema);

        console.log(newAnnotationForm.data)

        if (!newAnnotationForm.valid) {
            return fail(400, { newAnnotationForm, editAnnotationForm });
        }

        const durationMillis = Duration.fromObject({ hours: newAnnotationForm.data.hour, minutes: newAnnotationForm.data.minute, second: newAnnotationForm.data.second }).toMillis();

        try {
            await trpc(event).contributor.createCommunityVodAnnotation.mutate({
                communityVodId: newAnnotationForm.data.communityVodId,
                timestamp: durationMillis,
                game: newAnnotationForm.data.game,
                subject: newAnnotationForm.data.subject,
                note: newAnnotationForm.data.note
            });

            return message(newAnnotationForm, "Annotation created!");
        } catch (e) {
            if (e instanceof TRPCClientError) {
                return setError(newAnnotationForm, "", `Service communication error: ${e.message}`);
            } else {
                return setError(newAnnotationForm, "", "Server Error!");
            }
        }
    },
    editannotation: async (event) => {
        const newAnnotationForm = await superValidate(newAnnotationSchema);
        const editAnnotationForm = await superValidate(event.request, editAnnotationSchema);

        if (!editAnnotationForm.valid) {
            return fail(400, { newAnnotationForm, editAnnotationForm });
        }

        const durationMillis = Duration.fromObject({ hours: editAnnotationForm.data.hour, minutes: editAnnotationForm.data.minute, second: editAnnotationForm.data.second }).toMillis();

        console.log(editAnnotationForm.data);

        try {
            await trpc(event).contributor.updateCommunityVodAnnotation.mutate({
                communityVodAnnotationId: editAnnotationForm.data.annotationId,
                timestamp: durationMillis,
                game: editAnnotationForm.data.game,
                subject: editAnnotationForm.data.subject,
                note: editAnnotationForm.data.note
            });

            return message(editAnnotationForm, "Annotation updated!");
        } catch (e) {
            if (e instanceof TRPCClientError) {
                return setError(editAnnotationForm, "", `Service communication error: ${e.message}`);
            } else {
                return setError(editAnnotationForm, "", "Server Error!");
            }
        }
    }
} satisfies Actions;