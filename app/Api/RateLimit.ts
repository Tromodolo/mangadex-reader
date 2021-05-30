import { RateLimiter } from 'limiter';

const limiter = new RateLimiter({tokensPerInterval: 5, interval: "second"});

async function RemoveToken(total: number) {
	await limiter.removeTokens(total);
}

export default RemoveToken;
