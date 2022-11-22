import React from 'react';
import { Tile } from '../../types/GameTypes';
import classNames from 'clean-react-classnames';

export type LetterTileProps = {
	tile: Tile;
	tooltip: boolean;
	displayPoints: boolean;
	className?: string;
	onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
	size?: 'kbd-lg' | 'kbd-xs' | 'kbd-md' | 'kbd-sm';
	displayJokerValue?: boolean;
};

export default function LetterTile({
	tile,
	tooltip,
	displayPoints,
	className,
	onClick,
	size,
	displayJokerValue = false,
}: LetterTileProps) {
	const Letter = (
		<div
			onClick={onClick}
			className={classNames(
				size || 'kbd-lg',
				'kbd select-none transition-[border] hover:border-primary relative',
				className
			)}
		>
			{displayJokerValue && tile.as
				? tile.as
				: tile.char === '0'
				? '?'
				: tile.char}
			{displayPoints && (
				<div className="absolute bottom-1 right-1 font-bold text-xs">
					{tile.points}
				</div>
			)}
		</div>
	);

	return tooltip ? (
		<div className="tooltip" data-tip={`${tile.points} points`}>
			{Letter}
		</div>
	) : (
		<>{Letter}</>
	);
}
