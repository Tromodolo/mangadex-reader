import { ApiRoot, MangaResponse } from './';
import RemoveToken from './RateLimit';

async function FetchManga(id: string): Promise<MangaResponse> {
	await RemoveToken(1);
	const res = await fetch(`${ApiRoot}/manga/${id}`);
	if (res.status === 429) {
		await RemoveToken(1);
		return await FetchManga(id);
	}
	return await res.json();
}

export default FetchManga;
