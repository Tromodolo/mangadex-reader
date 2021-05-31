import fetch from 'node-fetch';
import { ApiRoot, Group } from './';
import RemoveToken from './RateLimit';

// If something exists in the cache, count on it being the newest data
// Since the API is in read-only
const cache: {
	[id: string]: Group;
} = {};

async function FetchGroup(id: string): Promise<Group> {
	if (cache[id] !== undefined) {
		return cache[id];
	}

	await RemoveToken(1);
	const res = await fetch(`${ApiRoot}/group/${id}`);
	if (res.status === 429) {
		await RemoveToken(1);
		return await FetchGroup(id);
	}
	const data = await res.json();
	cache[id] = data;
	return data;
}

export default FetchGroup;
