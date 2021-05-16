import fetch from 'node-fetch';
import { ApiRoot, ChapterResponse } from './';
import RemoveToken from './RateLimit';

async function FetchChapter(id: string): Promise<ChapterResponse> {
	await RemoveToken();
	const res = await fetch(`${ApiRoot}/chapter/${id}`);
	return await res.json();
}

export default FetchChapter;
