import fetch from 'node-fetch';
import { ApiRoot, ChapterList } from './';
import RemoveToken from './RateLimit';

async function FetchMangaChapters(id: string): Promise<ChapterList> {
	await RemoveToken(1);
	const res = await fetch(
		`${ApiRoot}/manga/${id}/feed?limit=500&translatedLanguage[]=en&order[chapter]=asc`
	);
	if (res.status === 429) {
		await RemoveToken(1);
		return await FetchMangaChapters(id);
	}
	return await res.json();
}

export default FetchMangaChapters;
