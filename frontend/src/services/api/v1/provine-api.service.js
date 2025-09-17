import { withApiCache } from '../api-caching.service.js';
import { httpGet } from '../http-client.js';

export const getProvinces = (params = {}) => {
	const queryParams = new URLSearchParams();
	if (params.page) queryParams.append('page', params.page);
	if (params.limit) queryParams.append('limit', params.limit);
	if (params.name) queryParams.append('name', params.name);
	if (params.code) queryParams.append('code', params.code);

	const queryString = queryParams.toString();
	const endpoint = `/province${queryString ? `?${queryString}` : ''}`;
	const cacheKey = `provinces_${JSON.stringify(params)}`;

	return withApiCache(cacheKey, httpGet, endpoint);
};

export const getProvinceById = (id) => {
	const cacheKey = `province_${id}`;
	return withApiCache(cacheKey, httpGet, `/province/${id}`);
};
