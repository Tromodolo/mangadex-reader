import fetch from 'node-fetch';
import { ApiRoot, MangaList } from './';
import RemoveToken from './RateLimit';

// This, like FetchMangaDexAtHome should not be cached because it just doesn't work
async function SearchManga(name: string, offset: number = 0): Promise<MangaList> {
	await RemoveToken(1);
	const res = await fetch(`${ApiRoot}/manga?title=${name}&offset=${offset}&limit=20`);
	if (res.status === 429) {
		await RemoveToken(1);
		return await SearchManga(name, offset);
	}
	return await res.json();
}

export default SearchManga;
