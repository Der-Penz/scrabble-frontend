import React from 'react';
import { useDrag } from 'react-dnd';
import LetterTile, { LetterTileProps } from './LetterTile';

type DraggableLetterTileProps =  LetterTileProps & {draggable: boolean};

export default function DraggableLetterTile(props: DraggableLetterTileProps) {
	const [{ opacity }, dragRef] = useDrag(
		() => ({
			type: 'tile',
			item: props.tile,
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
