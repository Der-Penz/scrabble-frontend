import { Reducer, useEffect, useReducer, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
// @ts-ignore
import classnames from 'clean-react-classnames';
import Scrabble from '../components/Game/Scrabble';
import useAction from '../hooks/useAction';
import { Player } from '../types/Player';
import { Objective, RoomSetting } from '../types/RoomSetting';
import { WSRequest } from '../types/WSRequest';
import RoomSettings from '../components/Room/RoomSettings';
import RoomHeader from '../components/Room/RoomHeader';
import {
	RiUserLine,
	RiUserSettingsLine,
	RiUserSearchLine,
} from 'react-icons/ri';
import { FaRegHourglass } from 'react-icons/fa';

export enum PlayerAction {
	JOINED = 'ADD',
	LEFT = 'REMOVE',
}

type PlayerPayload = {
	action: PlayerAction;
	payload: Player;
};

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

const defaultSettings: RoomSetting = {
	minutes: 3,
	points: 50,
	objectiveType: Objective.BASE,
};

const emptyPlayers: Player[] = new Array(4).fill({ name: '', host: false });

export default function Room() {
	const [searchParams, setSearchParams] = useSearchParams();

	const [self, setSelf] = useState<Player>();
	const [started, setStarted] = useState(false);
	const [formData, setFormData] = useState<RoomSetting>(defaultSettings);

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

	useAction<{}>('game:started', () => {
		setStarted(true);
	});

	const startGame = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		sendMessage(new WSRequest('game:start', formData));
	};

	return (
		<section className="flex-1">
			<RoomHeader id={searchParams.get('id') || ''} name={self?.name || ''} />
			{started ? (
				<Scrabble />
			) : (
				<div className="grid place-items-center gap-2">
					<h4 className="font-bold text-lg text-center border-b-4 rounded">
						Players
					</h4>
					<ul>
						{[...players, ...emptyPlayers]
							.slice(0, 4)
							.map((player, i) => (
								<li
									key={i}
									className="flex items-center gap-2 m-1 w-80"
								>
									{player.name === '' ? (
										<RiUserSearchLine size={'10%'} />
									) : player.host ? (
										<RiUserSettingsLine size={'10%'} />
									) : (
										<RiUserLine size={'10%'} />
									)}
									<div
										className={classnames(
											{
												'text-base-300 animate-pulse':
													player.name === '',
											},
											'text-lg bg-base-300 w-full rounded p-1'
										)}
									>
										<span className="">
											{player.name || '----------'}
										</span>
									</div>
								</li>
							))}
					</ul>
					<div className="mt-24">
						{self?.host ? (
							<RoomSettings
								formData={formData}
								setFormData={setFormData}
								startGame={startGame}
							></RoomSettings>
						) : (
							<div className="flex items-center gap-2">
								<FaRegHourglass className="animate-spin" />
								<span className="font-extrabold text-sm">
									waiting for Host to start the game...
								</span>
							</div>
						)}
					</div>
				</div>
			)}
		</section>
	);
}
