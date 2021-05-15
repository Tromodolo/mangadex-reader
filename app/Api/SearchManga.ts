import fetch from "node-fetch";
import { ApiRoot, MangaList } from "./";

async function SearchManga(name: string): Promise<MangaList> {
    const res = await fetch(`${ApiRoot}/manga?title=${name}`);
    return await res.json();
}


export default SearchManga;
