import { createContextInner } from "$trpc/context";
import { router } from "$trpc/t";
import axios from "axios";
import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("axios");

describe("TRPC", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    describe("Contributor", async () => {
        const context = await createContextInner({ userCookie: undefined });
        const caller = router.createCaller(context);
        test("'createCommunityVod' ", async () => {
            console.log("test");
        })
    });
});