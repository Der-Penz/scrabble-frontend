import React from 'react';
// @ts-ignore
import classNames from 'clean-react-classnames';

type PlayerInfoProps = {
	name: string;
	points: number;
	timeLeft: number;
	onTurn: boolean;
};

export default function PlayerInfo({
	name,
	points,
	timeLeft,
	onTurn,
}: PlayerInfoProps) {
	return (
		<div className='stat flex-1'>
			{timeLeft > 0 && (
				<div
					className={classNames(
						{ 'text-primary': onTurn },
						'font-bold text-xl stat-figure'
					)}
				>
					{timeLeft}
				</div>
			)}
			<span className="stat-title overflow-ellipsis whitespace-nowrap overflow-hidden w-[15ch]">{name}:</span>
			<div className="divider"></div>
			<span className="stat-value">{points}</span>
		</div>
	);
}
