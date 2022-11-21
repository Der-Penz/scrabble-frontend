import React from 'react';
import { useDrag } from 'react-dnd';
import LetterTile, { LetterTileProps } from './LetterTile';

type DraggableLetterTileProps = LetterTileProps & {
	draggable: boolean;
	coords?: { x: number; y: number };
};

export default function DraggableLetterTile(props: DraggableLetterTileProps) {
	const [{ opacity }, dragRef] = useDrag(
		() => ({
			type: 'tile',
			item: props.coords
				? { ...props.tile, x: props.coords.x, y: props.coords.y }
				: props.tile,
			canDrag: props.draggable,
			collect: (monitor) => ({
				opacity: monitor.isDragging() ? 'opacity-10' : 'opacity-100',
			}),
		}),
		[props]
	);

	return (
		<div className={opacity} ref={dragRef}>
			<LetterTile {...props}></LetterTile>
		</div>
	);
}
