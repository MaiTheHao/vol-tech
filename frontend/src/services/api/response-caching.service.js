const responseCache = new Map();

export const setResponseCache = (key, value, exp) => {
	responseCache.set(key, { exp, value });
};

export const hasValidResponseCache = (key) => {
	const cached = responseCache.get(key);
	if (!cached) return false;
	const now = Date.now() / 1000;
	return cached.exp > now;
};

export const getValidResponseCache = (key) => (hasValidResponseCache(key) ? responseCache.get(key).value : null);

export const removeResponseCache = (key) => {
	key ? responseCache.delete(key) : responseCache.clear();
};

export const withResponseCache = async (key, promiseFn, ttl, ...args) => {
	if (hasValidResponseCache(key)) {
		return getValidResponseCache(key);
	}
	const exp = Date.now() / 1000 + ttl;
	const result = await promiseFn(...args);
	setResponseCache(key, result, exp);
	return result;
};
