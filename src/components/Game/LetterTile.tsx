import React from 'react';
import { Tile } from '../../types/GameTypes';
// @ts-ignore
import classNames from 'clean-react-classnames';

type LetterTileProps = {
	tile: Tile;
	tooltip: boolean;
	displayPoints: boolean;
	className?: string;
	onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

export default function LetterTile({
	tile,
	tooltip,
	displayPoints,
	className,
	onClick,
}: LetterTileProps) {
	const Letter = (
		<div
			onClick={onClick}
			className={classNames(
				'kbd kbd-lg select-none transition-[border] hover:border-primary relative',
				className
			)}
		>
			{tile.char === '0' ? '?' : tile.char}
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
