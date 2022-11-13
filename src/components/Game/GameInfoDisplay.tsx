import React, { useEffect, useState } from 'react';
import { GameInfo } from '../../types/GameTypes';
import { Objective, RoomSetting } from '../../types/RoomSetting';
import { formatMillis } from '../../util/helpers';
import PlayerInfo from './PlayerInfo';
// @ts-ignore
import classNames from 'clean-react-classnames';

type GameInfoProps = {
	gameInfo?: GameInfo;
	settings?: RoomSetting;
};

export default function GameInfoDisplay({ gameInfo, settings }: GameInfoProps) {
	if (!gameInfo) return <div></div>;

	const [timePast, setTimePast] = useState(0);
	const [time, setTime] = useState({} as ReturnType<typeof formatMillis>);

	useEffect(() => {
		setTimePast(0);
	}, [gameInfo]);

	useEffect(() => {
		const interval = setInterval(() => {
			const toSubtract = timePast + 1;

			setTime(
				formatMillis(
					gameInfo.players[gameInfo.currentPlayer].timeLeft -
						toSubtract * 1000
				)
			);
			setTimePast(toSubtract);
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	}, [timePast]);

	return (
		<div className="bg-base-300 rounded-lg mx-3 p-3 max-w-max self-center">
			<h1 className="flex gap-2 items-center justify-center text-xl font-bold">
				{settings?.objectiveType && (
					<span>{settings?.objectiveType} •</span>
				)}

				{settings?.objectiveType === Objective.TIME && (
					<span
						className={classNames(
							{
								'text-error': !time.positive,
							},
							'countdown font-mono text-2xl'
						)}
					>
						{!time.positive && '-'}
						<span
							style={
								{
									'--value': time.hours,
								} as React.CSSProperties
							}
						></span>
						:
						<span
							style={
								{
									'--value': time.minutes,
								} as React.CSSProperties
							}
						></span>
						:
						<span
							style={
								{
									'--value': time.seconds,
								} as React.CSSProperties
							}
						></span>
					</span>
				)}
			</h1>
			<div className="stats mx-auto flex flex-row flex-wrap max-w-max">
				{Object.keys(gameInfo.players).map((name, i) => (
					<PlayerInfo
						key={i}
						name={name}
						points={gameInfo.players[name].points}
						onTurn={gameInfo.currentPlayer === name}
						timeLeft={
							settings?.objectiveType === Objective.SEPARATED_TIME
								? gameInfo.currentPlayer === name
									? time
									: formatMillis(
											gameInfo.players[name].timeLeft
									  )
								: undefined
						}
					/>
				))}
			</div>
		</div>
	);
}
