import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';

type ExistsRoom = {
	exists: boolean;
	idToCheck: string;
};

export default function JoinRoom() {
	const navigate = useNavigate();

	const roomIDRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	const nameRef = useRef() as React.MutableRefObject<HTMLInputElement>;

	const { error, response, loading, makeRequest } = useFetch<ExistsRoom>('');

	const joinRoom = async () => {
		const id = roomIDRef.current.value;
		if (id === '') {
			return;
		}
		makeRequest(`http://localhost:8808/api/v1/room/exists?id=${id}`);
	};

	useEffect(() => {
		if (response?.exists) {
			let name = nameRef.current.value.trim();

			navigate(
				`/room?id=${response.idToCheck}${name ? `&name=${name}` : ''}`
			);
		}
	}, [response]);

	return (
		<div>
			<div>{loading && <p>Loading</p>}</div>
			<div>{error && <p>{error.errorMessage.toString()}</p>}</div>
			<div>
				{response && (
					<p>
						{response.exists
							? 'Room exists'
							: 'Room id does not exists try a different one'}
					</p>
				)}
			</div>
			<div className="flex gap-2">
				<input
					className="input input-primary"
					type="text"
					placeholder="room id"
					defaultValue={'debugging'}
					ref={roomIDRef}
				/>
				<input
					className="input input-primary"
					type="text"
					placeholder="name"
					ref={nameRef}
				/>
				<button className="btn" onClick={joinRoom}>
					Join
				</button>
			</div>
		</div>
	);
}
