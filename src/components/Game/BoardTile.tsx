import React from 'react';
import classNames from 'clean-react-classnames';
import { BoardPosition, Tile } from '../../types/GameTypes';
import { useDrop } from 'react-dnd';
import DraggableLetterTile from './DraggableLetterTile';

type BoardTileProps = {
	pos: BoardPosition;
	onDrop: (tile: Tile, position: BoardPosition) => void;
	draggable?: boolean;
};

export default function BoardTile({
	pos,
	onDrop,
	draggable = false,
}: BoardTileProps) {
	const [{ isOver }, drop] = useDrop(
		() => ({
			accept: 'tile',
			drop: (item) => {
				onDrop(item as Tile, pos);
			},
			collect: (monitor) => ({
				isOver: !!monitor.isOver(),
			}),
		}),
		[pos]
	);

	return (
		<div
			ref={drop}
			className={classNames(
				{ 'scale-110': isOver },
				'flex-1 aspect-square select-none grid place-items-center border-base-content border border-opacity-10 rounded-lg w-[2.6rem] transition-transform',
				{
					'bg-blue-600':
						pos.type === 'LETTER' && pos.factor === 2,
					'bg-blue-700': pos.type === 'LETTER' && pos.factor === 3,
					'bg-red-600':
						pos.type === 'WORD' && pos.factor === 2,
					'bg-red-700': pos.type === 'WORD' && pos.factor === 3,
					'bg-base-100': !pos.type,
				}
			)}
		>
			{pos.placedTile && (
				<DraggableLetterTile
					draggable={draggable}
					displayPoints={true}
					tile={pos.placedTile}
					tooltip={false}
					size="kbd-md"
					displayJokerValue
					coords={{ x: pos.x, y: pos.y }}
				/>
			)}
			{!pos.placedTile && pos.type && (
				<span className={classNames('text-xs opacity-80 font-bold')}>
					{pos.factor === 2 ? '2' : '3'}
					{pos.type === 'LETTER' ? 'L' : 'W'}
				</span>
			)}
		</div>
	);
}
