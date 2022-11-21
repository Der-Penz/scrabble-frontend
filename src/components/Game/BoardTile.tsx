import React from 'react';
// @ts-ignore
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
				'kbd flex-1 aspect-square select-none grid place-items-center border',
				{
					'bg-secondary bg-opacity-70':
						pos.type === 'LETTER' && pos.factor === 2,
					'bg-secondary': pos.type === 'LETTER' && pos.factor === 3,
					'bg-primary bg-opacity-70':
						pos.type === 'WORD' && pos.factor === 2,
					'bg-primary ': pos.type === 'WORD' && pos.factor === 3,
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
				<span className={classNames('text-xs')}>
					{pos.factor === 2 ? 'D' : 'T'}
					{pos.type === 'LETTER' ? 'L' : 'W'}
				</span>
			)}
		</div>
	);
}
