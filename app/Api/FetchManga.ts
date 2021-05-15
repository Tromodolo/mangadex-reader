import fetch from "node-fetch";
import { ApiRoot, MangaResponse } from "./";

async function FetchManga(id: string): Promise<MangaResponse> {
    const res = await fetch(`${ApiRoot}/manga/${id}`);
    return await res.json();
}


export default FetchManga;
