import { withApiCache } from '../api-caching.service.js';
import { httpDelete, httpGet, httpPost } from '../http-client.js';

export const getList = ({ title, status, commune, createdBy, sortBy, sortOrder, page, limit }) => {
	const query = {};

	if (title) query.title = title;
	if (status) query.status = status;
	if (commune) query.commune = commune;
	if (createdBy) query.createdBy = createdBy;
	if (sortBy) {
		query.sortBy = sortBy;
		if (sortOrder) query.sortOrder = sortOrder;
	}
	if (page) query.page = page;
	if (limit) query.limit = limit;

	const key = `active_list_${JSON.stringify(query)}`;
	const queryString = Object.keys(query).length ? '?' + new URLSearchParams(query).toString() : '';
	return withApiCache(key, httpGet, `/active${queryString}`);
};

export const getDetail = (id) => {
	const key = `active_detail_${id}`;
	return withApiCache(key, httpGet, `/active/${id}`);
};

export const joinActive = (id) => {
	return httpPost(`/active/${id}/participants`);
};

export const leaveActive = (id) => {
	return httpDelete(`/active/${id}/participants`);
};
