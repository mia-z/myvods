import { text } from "@sveltejs/kit";
import prisma from "$lib/server/Prisma";
import { v4 as uuid } from "uuid";
import { DateTime } from "luxon";

export const GET = async ({ params }) => {
    const id = params.id;
    const exists = await prisma.user.findUnique({
        where: {
            id: parseInt(id)
        }
    });

    if (exists) {
        const newTokenRes = await prisma.user.update({
            where: {
                id: parseInt(id)
            },
            data: {
                tokens: {
                    create: {
                        expires: DateTime.now().plus({ days: 7 }).toString(),
                        token: uuid(),
                    }
                }
            },
            select: {
                tokens: {
                    orderBy: {
                        id: "desc"
                    },
                    take: 1
                }
            }
        });
        return text(newTokenRes.tokens[0].token, { status: 201 });
    } else {
        return text("Not found", { status: 404 });
    }
}