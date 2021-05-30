import { RateLimiter } from 'limiter';

const limiter = new RateLimiter(5, 1000);

function RemoveToken(total: number) {
	return new Promise((resolve) => {
		limiter.removeTokens(total, () => {
			return resolve(true);
		});
	});
}

export default RemoveToken;
