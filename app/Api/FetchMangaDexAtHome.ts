import fetch from 'node-fetch';
import { ApiRoot } from '.';
import RemoveToken from './RateLimit';

async function FetchMangaDexAtHome(chapterId: string): Promise<{ baseUrl: string }> {
	await RemoveToken(1);
	const res = await fetch(`${ApiRoot}/at-home/server/${chapterId}`);
	if (res.status === 429) {
		await RemoveToken(1);
		return await FetchMangaDexAtHome(chapterId);
	}
	return await res.json();
}

export default FetchMangaDexAtHome;
