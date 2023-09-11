import { z } from "zod";
import prisma from "$lib/server/Prisma";
import { router, publicProcedure } from "../t";
import { v4 as uuid } from "uuid";
import { DateTime } from "luxon";
import { TRPCError } from "@trpc/server";

export const vod = router({
    
});