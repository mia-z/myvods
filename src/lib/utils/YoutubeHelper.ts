import { PUBLIC_GOOGLE_API_KEY } from "$env/static/public";
import axios from "axios";

export const ensureValidThumbnail = (images: Youtube.ThumbnailCollection): string => {
    if (images.medium && images.medium.url) return images.medium.url;
    if (images.standard && images.standard.url) return images.standard.url;
    if (images.high && images.high.url) return images.high.url;
    if (images.maxres && images.maxres.url) return images.maxres.url;
    if (images.default && images.default.url) return images.default.url;
    return "nourl";
}

export const getVideoDataFromIdOrUrl = async (input: string) => {
    let videoId: string | null = input;

    if (input.match(/^(http(s)?:\/\/|www\.)/)) {
        const urlToExtract = new URL(input);
        videoId = urlToExtract.searchParams.get("v");
        if (!videoId) {
            throw new Error("Couldnt retrieve v parameter from given youtube URL");
        }
    }

    const youtubeUrl = new URL("https://youtube.googleapis.com/youtube/v3/videos");
    youtubeUrl.searchParams.append("part", Array.from(["snippet", "contentDetails", "statistics"]).join(","));
    youtubeUrl.searchParams.append("id", input);
    youtubeUrl.searchParams.append("key", PUBLIC_GOOGLE_API_KEY);
    const youtubeRes = await axios.get<Youtube.VideoListResponse>(youtubeUrl.href, {
        validateStatus: () => true
    });

    if (youtubeRes.data.items.length !== 1) {
        throw new Error("Youtube items.length wasn't exactly one(1)")
    } else {
        return youtubeRes.data.items[0];
    }
}