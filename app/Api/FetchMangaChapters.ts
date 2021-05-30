import fetch from 'node-fetch';
import { ApiRoot, ChapterList } from './';
import RemoveToken from './RateLimit';

async function FetchMangaChapters(id: string): Promise<ChapterList> {
	await RemoveToken(1);
	const res = await fetch(`${ApiRoot}/manga/${id}/feed?limit=500&locales[]=en&order[chapter]=asc`);
	return await res.json();
}

export default FetchMangaChapters;
