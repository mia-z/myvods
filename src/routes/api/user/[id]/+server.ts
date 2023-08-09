import { error, json, text } from "@sveltejs/kit";
import prisma from "$lib/server/Prisma";

export const GET = async ({ params }) => {
    const id = params.id;
    const user = await prisma.user.findUnique({
        where: {
            id: parseInt(id)
        },
        select: {
            displayName: true,
            id: true
        }
    });

    if (!user) {
        return text("Not found", { status: 404 });
    }

    return json(user);
}