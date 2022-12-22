import { useEffect, useState } from 'react';
import { Error } from '../types/Error';
import { JSONResponse } from '../types/JSONResponse';

export const useFetch = <T extends unknown>(
	defaultUrl: string,
	options?: RequestInit
) => {
	const [url, setUrl] = useState(defaultUrl);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<
		{ error: Error; errorMessage: string } | undefined
	>(undefined);
	const [response, setResponse] = useState<T | undefined>(undefined);
	const [counter, setCounter] = useState(0);

	useEffect(() => {
		if (url === '') return;
		const controller = new AbortController();
		setLoading(true);
		setResponse(undefined);
		setError(undefined);

		fetch(url, {
			...options,
			signal: controller.signal,
		})
			.then((res) => {
				return res.json();
			})
			.then((json: Awaited<Promise<PromiseLike<JSONResponse>>>) => {
				setLoading(false);
				if (json.error) {
					setError({
						error: json.error as Error,
						errorMessage: json.errorMessage as string,
					});
					setResponse(undefined);
				} else {
					setResponse((json as unknown as JSONResponse).content as T);
				}
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
				setResponse(undefined);
				setError({
					error: 'FetchError',
					errorMessage: err,
				});
			});

		return () => {
			controller.abort();
			setResponse(undefined);
			setError(undefined);
			setLoading(false);
		};
	}, [counter]);

	const makeRequest = (url?: string) => {
		if (url) {
			setUrl(url);
		}
		setCounter((prev) => (prev + 1) % 1000);
	};

	return { loading, error, response, makeRequest };
};
