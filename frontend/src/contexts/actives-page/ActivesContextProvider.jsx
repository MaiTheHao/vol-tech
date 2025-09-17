import React, { useState, useEffect } from 'react';
import { getList } from '../../services/api/v1/active-api.service';
import { ActivesContext } from './ActivesContext';

export default function ActivesContextProvider({ children }) {
	const [query, setQuery] = useState({
		title: '',
		status: '',
		commune: '',
		sortBy: '',
		sortOrder: '',
		page: 1,
		limit: 6,
	});
	const [activities, setActivities] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [totalPages, setTotalPages] = useState(1);

	useEffect(() => {
		setLoading(true);
		getList(query).then(async (res) => {
			const { items, paginate } = await res.json();
			if (res.ok) {
				const arr = Array.isArray(items) ? items : [];
				setActivities(arr);
				setTotalPages(paginate.totalPages || 1);
				setError('');
			} else {
				setError(error || 'Có lỗi xảy ra');
				setActivities([]);
			}
			setLoading(false);
		});
	}, [query]);

	const updateQuery = (patch) => {
		setQuery((prev) => ({ ...prev, ...patch, page: 1 }));
	};

	const setPage = (page) => {
		setQuery((prev) => ({ ...prev, page }));
	};

	return (
		<ActivesContext.Provider
			value={{
				query,
				activities,
				loading,
				error,
				totalPages,
				updateQuery,
				setPage,
			}}
		>
			{children}
		</ActivesContext.Provider>
	);
}
