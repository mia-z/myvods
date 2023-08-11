import { error, json } from "@sveltejs/kit";
import prisma from "$lib/server/Prisma";


export const GET = async ({ params }) => {
    const token = params.token;

    if (!token) {
        throw error(400, "Must provide a token")
    }
    

    const userFromUuid = await prisma.loginToken.findFirst({
        include: {
            user: {
                include: {
                    oauthConnections: true
                }
            }
        },
        where: {
            token: token,
        }
    });
    
    if (!userFromUuid) {
        throw error(404, "Couldnt find user with that token");
    } else {
        return json(userFromUuid.user);
    }
}