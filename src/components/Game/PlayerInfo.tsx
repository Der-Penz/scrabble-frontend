import React from 'react';
import classNames from 'clean-react-classnames';
import { formatMillis } from '../../util/Helpers';

type PlayerInfoProps = {
	name: string;
	points: number;
	timeLeft?: ReturnType<typeof formatMillis>;
	onTurn: boolean;
};

export default function PlayerInfo({
	name,
	points,
	timeLeft,
	onTurn,
}: PlayerInfoProps) {
	return (
		<div className="stat flex-1">
			{timeLeft && (
				<span
					className={classNames(
						{ 'text-primary': onTurn },
						'font-bold text-xl stat-figure'
					)}
				>
					<span
						className={classNames(
							{
								'text-error': !timeLeft?.positive,
							},
							'countdown font-mono text-2xl'
						)}
					>
						{!timeLeft?.positive && '-'}
						<span
							style={
								{
									'--value': timeLeft?.hours,
								} as React.CSSProperties
							}
						></span>
						:
						<span
							style={
								{
									'--value': timeLeft?.minutes,
								} as React.CSSProperties
							}
						></span>
						:
						<span
							style={
								{
									'--value': timeLeft?.seconds,
								} as React.CSSProperties
							}
						></span>
					</span>
				</span>
			)}
			<span className="stat-title overflow-ellipsis whitespace-nowrap overflow-hidden w-[15ch]">
				{name}:
			</span>
			<div className="divider"></div>
			<span className="stat-value">{points}</span>
		</div>
	);
}
