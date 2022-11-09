import React from 'react';

type LetterTileProps = {
	points: number;
	char: string;
	tooltip: boolean;
	displayPoints: boolean;
};

export default function LetterTile({
	points,
	char,
	tooltip,
	displayPoints,
}: LetterTileProps) {
	const Letter = (
		<div className="kbd kbd-lg select-none transition-[border] hover:border-primary relative">
			{char === '0' ? '?' : char}
            {displayPoints && <div className='absolute bottom-1 right-1 font-bold text-xs'>{points}</div>}
		</div>
	);

	return tooltip ? (
		<div className="tooltip" data-tip={`${points} points`}>
			{Letter}
		</div>
	) : (
		<>{Letter}</>
	);
}
