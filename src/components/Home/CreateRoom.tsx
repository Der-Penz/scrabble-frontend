import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { toSearchParamString } from '../../util/Helpers';

type CreateRoom = {
	roomID: string;
	message?: string;
	roomJoinUrl?: string;
};

export default function CreateRoom() {
	const navigate = useNavigate();
	const customIDRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	const nameRef = useRef() as React.MutableRefObject<HTMLInputElement>;

	const { error, response, loading, makeRequest } = useFetch<CreateRoom>(
		'',
		'POST'
	);

	const createRoom = async () => {
		const customID = customIDRef.current.value;

		let url = '/room/create';

		const params = toSearchParamString({
			id: customID,
		});

		makeRequest(url + params);
	};

	useEffect(() => {
		if (response?.message) {
			let name = nameRef.current.value.trim();

			const params = toSearchParamString({
				id: response.roomID,
				name,
			});

			navigate(`/room` + params);
		}
	}, [response]);

	return (
		<div>
			<div>{loading && <p>Loading</p>}</div>
			<div>{error && <p>{error.errorMessage.toString()}</p>}</div>
			<div>{response && <p>{response.message}</p>}</div>
			<div className="flex gap-2">
				<input
					className="input input-primary"
					type="text"
					placeholder="custom id"
					ref={customIDRef}
				/>
				<input
					className="input input-primary"
					type="text"
					placeholder="name"
					ref={nameRef}
				/>
				<button className="btn" onClick={createRoom}>
					Create
				</button>
			</div>
		</div>
	);
}
