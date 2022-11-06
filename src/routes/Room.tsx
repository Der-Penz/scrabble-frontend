import { Reducer, useEffect, useReducer, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import useAction from '../hooks/useAction';
import { Player } from '../types/Player';
import { WSRequest } from '../types/WSRequest';

export enum PlayerAction {
	JOINED = 'ADD',
	LEFT = 'REMOVE',
}

type PlayerPayload = {
	action: PlayerAction;
	payload: Player;
};

enum Objective {
	BASE = 'Base',
	TIME = 'Time',
	POINTS = 'Points',
	SEPARATED_TIME = 'Separated Time',
}

function playerReducer(state: Player[], type: PlayerPayload) {
	const { action, payload } = type;

	switch (action) {
		case PlayerAction.JOINED: {
			return [...state, payload];
		}
		case PlayerAction.LEFT: {
			return state.filter((player) => player.name !== payload.name);
		}
		default: {
			return state;
		}
	}
}

export default function Room() {
	const [searchParams, setSearchParams] = useSearchParams();

	const [self, setSelf] = useState<Player>();
	const [started, setStarted] = useState(false);
	const [objective, setObjective] = useState<Objective>(Objective.BASE);

	const [players, dispatchPlayer] = useReducer<
		Reducer<Player[], PlayerPayload>
	>(playerReducer, []);

	const sendMessage = useAction<Player>(
		['player:joined', 'player:left', 'player:self'],
		(message, _, incomingAction) => {
			dispatchPlayer({
				action:
					incomingAction === 'player:left'
						? PlayerAction.LEFT
						: PlayerAction.JOINED,
				payload: message.message,
			});
			if (incomingAction === 'player:self') {
				setSelf(message.message);
			}
		}
	);

	const startGame = (e : React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		sendMessage(new WSRequest('game:start', {objective: 'Base', minutes: 20}))
		
	};

	return (
		<section>
			<h3>Room: {searchParams.get('id')}</h3>
			<h4>Self: {self?.name}</h4>
			<br />
			<ul>
				Players
				{players.map((player, i) => (
					<li key={i}>
						{player.name}
						{player.host && ' | HOST'}
					</li>
				))}
			</ul>
			{self?.host && (
				<form
					onSubmit={startGame}
					className="flex flex-col gap-2 max-w-xs"
				>
					<select
						onChange={(e) =>
							setObjective(e.target.value as Objective)
						}
						className="select select-bordered w-full max-w-xs"
					>
						<option disabled selected>
							Select objective
						</option>
						<option>{Objective.BASE}</option>
						<option>{Objective.TIME}</option>
						<option>{Objective.POINTS}</option>
						<option>{Objective.SEPARATED_TIME}</option>
					</select>
					<input
						type="number"
						disabled={objective !== Objective.POINTS}
						placeholder="Points to reach"
						min="10"
						max="1000"
						className="input input-bordered"
					/>

					<input
						type="number"
						disabled={objective !== Objective.SEPARATED_TIME && objective !== Objective.TIME}
						placeholder="Time to play in minutes"
						min="1"
						max="1000"
						className="input input-bordered"
					/>
					<button type="submit" className="btn btn-primary">
						start
					</button>
				</form>
			)}
		</section>
	);
}
