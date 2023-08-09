import { error, json, text } from "@sveltejs/kit";
import prisma from "$lib/server/Prisma";
import { z } from "zod";
import { v4 as uuid } from "uuid";

const newUserRequest = z.object({
    displayName: z.string().nonempty(),
    accountId: z.string().nonempty(),
    provider: z.union([
        z.literal("TWITCH"),
        z.literal("GOOGLE")
    ]),
    authCode: z.string().nonempty(),
    refreshToken: z.string().nonempty()
});

export const POST = async ({ request }) => {
    const body = await request.json();

    const validated = newUserRequest.safeParse(body);

    if (validated.success) {
        const userCreateRes = await prisma.user.create({
            data: {
                displayName: validated.data.displayName,
                oauthConnections: {
                    create: {
                        accountId: validated.data.accountId,
                        authCode: validated.data.authCode,
                        provider: validated.data.provider,
                        refreshToken: validated.data.refreshToken,
                    }
                },
                tokens: {
                    create: {
                        token: uuid(),
                        expires: new Date().toISOString()
                    }
                }
            },
            select: {
                displayName: true,
                id: true,
                oauthConnections: true,
                tokens: true
            }
        });

        return json(userCreateRes);
    } else {
        return text("Couldnt validate body", { status: 400 })
    }
}