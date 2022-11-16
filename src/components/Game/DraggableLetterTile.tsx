import React from 'react';
import { useDrag } from 'react-dnd';
import { Tile } from '../../types/GameTypes';
import LetterTile from './LetterTile';

type LetterTileProps = {
	tile: Tile;
	tooltip: boolean;
	displayPoints: boolean;
	className?: string;
	onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

export default function DraggableLetterTile(props: LetterTileProps) {

	const [{ opacity }, dragRef] = useDrag(
		() => ({
		  type: 'tile',
		  item: props.tile,
		  collect: (monitor) => ({
			opacity: monitor.isDragging() ? 'opacity-10' : 'opacity-100'
		  })
		}),
		[]
	  )
    
	return (
		<div className={opacity} ref={dragRef}>
			<LetterTile {...props}></LetterTile>
		</div>
	);
}
