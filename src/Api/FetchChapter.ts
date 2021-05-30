import { ApiRoot, ChapterResponse } from './';
import RemoveToken from './RateLimit';

async function FetchChapter(id: string): Promise<ChapterResponse> {
	await RemoveToken(1);
	const res = await fetch(`${ApiRoot}/chapter/${id}`);
	if (res.status === 429) {
		await RemoveToken(1);
		return await FetchChapter(id);
	}
	return await res.json();
}

export default FetchChapter;
