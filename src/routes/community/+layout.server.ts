import prisma from "$lib/server/Prisma";
import type { LayoutServerLoad } from "./$types";
import { SECRET_JWT_SECRET } from "$env/static/private";
import JWT from "jsonwebtoken";

export const load: LayoutServerLoad = async ({ cookies, locals }) => {
    const cookie = cookies.get("_c");
    if (cookie) {
        try {
            const token = JWT.verify(cookie, SECRET_JWT_SECRET);
            const verifiedUser = await prisma.communityContributor
                .findFirst({
                    where: {
                        tokens: {
                            some: {
                                token: token as string //TS cant coerce this one, but _I_ know its a string
                            }
                        }
                    }
                });
            if (verifiedUser) {
                locals.communityContributorId = verifiedUser.id;
                locals.communityContributorNick = verifiedUser.nick;
                return {
                    communityContributorId: verifiedUser.id,
                    communityContributorNick: verifiedUser.nick
                }
            }
        } catch (e) {
            if (e instanceof JWT.JsonWebTokenError) {
                cookies.delete("_c");
            } else {
                return {

                }
            }
        }
    }  
    return {
        //
    }
};