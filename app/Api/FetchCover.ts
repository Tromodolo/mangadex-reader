import fetch from 'node-fetch';
import { ApiRoot, CoverResponse } from './';
import RemoveToken from './RateLimit';

async function FetchCover(id: string): Promise<CoverResponse> {
	await RemoveToken(1);
	const res = await fetch(`${ApiRoot}/cover/${id}`);
	if (res.status === 429) {
		await RemoveToken(1);
		return await FetchCover(id);
	}
	return await res.json();
}

export default FetchCover;
