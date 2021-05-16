import fetch from 'node-fetch';
import { ApiRoot, Group } from './';
import RemoveToken from './RateLimit';

async function FetchGroup(id: string): Promise<Group> {
	await RemoveToken(1);
	const res = await fetch(`${ApiRoot}/group/${id}`);
	return await res.json();
}

export default FetchGroup;
