import fetch from 'node-fetch';
import { ApiRoot, ChapterList } from './';
import RemoveToken from './RateLimit';

// If something exists in the cache, count on it being the newest data
// Since the API is in read-only
const cache: {
	[id: string]: ChapterList;
} = {};

async function FetchMangaChapters(id: string): Promise<ChapterList> {
	if (cache[id] !== undefined) {
		return cache[id];
	}

	await RemoveToken(1);
	const res = await fetch(
		`${ApiRoot}/manga/${id}/feed?limit=500&translatedLanguage[]=en&order[chapter]=asc`
	);
	if (res.status === 429) {
		await RemoveToken(1);
		return await FetchMangaChapters(id);
	}
	const data = await res.json();
	cache[id] = data;
	return data;
}

export default FetchMangaChapters;
