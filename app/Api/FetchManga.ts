import fetch from 'node-fetch';
import { ApiRoot, MangaResponse } from './';
import RemoveToken from './RateLimit';

async function FetchManga(id: string): Promise<MangaResponse> {
	await RemoveToken(1);
	const res = await fetch(`${ApiRoot}/manga/${id}`);
	return await res.json();
}

export default FetchManga;
