import { error, json, text } from "@sveltejs/kit";
import prisma from "$lib/server/Prisma";
import { z } from "zod";

const providersSchema = z.union([
    z.literal("TWITCH"),
    z.literal("GOOGLE")
])

export const GET = async ({ params }) => {
    const id = params.providerId;
    const provider = params.provider.toUpperCase();

    const validatedProvider = providersSchema.safeParse(provider);

    if (validatedProvider.success) {
        const user = await prisma.oAuthConnection.findFirst({
            where: {
                accountId: id,
                AND: {
                    provider: validatedProvider.data
                }
            },
            select: {
                user: {
                    include: {
                        oauthConnections: true,
                    }
                }
            }
        });
        
        if (user) {
            return json(user.user);
        } else {
            return text("no provider found for this oauth", { status: 404 });
        }
    } else {
        throw error(400, "Unexpected provider: " + provider);
    }
}