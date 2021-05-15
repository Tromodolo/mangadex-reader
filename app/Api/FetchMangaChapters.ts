import fetch from "node-fetch";
import { ApiRoot, ChapterList } from "./";

async function FetchMangaChapters(id: string): Promise<ChapterList> {
    const res = await fetch(`${ApiRoot}/manga/${id}/feed`);
    return await res.json();
}


export default FetchMangaChapters;
