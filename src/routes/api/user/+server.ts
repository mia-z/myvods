import { json, text } from "@sveltejs/kit";
import prisma from "$lib/server/Prisma";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import { DateTime } from "luxon";


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
                        expires: DateTime.now().plus({ days: 7 }).toString(),
                    }
                }
            },
            select: {
                displayName: true,
                id: true,
                oauthConnections: true,
                tokens: {
                    orderBy: {
                        id: "desc"
                    },
                    take: 1
                }
            }
        });
        return json(userCreateRes);
    } else {
        return text("Couldnt validate body", { status: 400 });
    }
}