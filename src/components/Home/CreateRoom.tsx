import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';

type CreateRoom = {
	roomID: string;
	message?: string;
	roomJoinUrl?: string;
};

export default function CreateRoom() {
	const navigate = useNavigate();
	const customIDRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    const nameRef = useRef() as React.MutableRefObject<HTMLInputElement>;

	const { error, response, loading, makeRequest } = useFetch<CreateRoom>('', {
		method: 'POST',
	});

	const createRoom = async () => {
		const customID = customIDRef.current.value;

		let url = 'http://localhost:8808/api/v1/room/create';

		if (customID) {
			url += `?id=${customID}`;
		}

		makeRequest(url);
	};

	useEffect(() => {
		if (response?.message) {
            let name = nameRef.current.value.trim();

			navigate(`/room?id=${response.roomID}${name ? `&name=${name}` : ''}`);
		}
	});

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
