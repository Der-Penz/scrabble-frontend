import React from 'react';
import { Bag } from '../../types/GameTypes';
import LetterTile from './LetterTile';
import { IoBag } from 'react-icons/io5';

type BagDisplayProps = {
	bag: Bag;
};

export default function BagDisplay({ bag }: BagDisplayProps) {
	const tiles = bag.tiles.sort((a, b) => a.char.localeCompare(b.char));

	const vocals = tiles.filter((tile) => tile.char.match(/[aeiou]/gi)).length;

	return (
		<div className="m-3 bg-base-300 rounded-lg p-2">
			<h1 className="mb-2 p-1 border-b-4 border-base-100 flex items-center gap-2">
				<IoBag />
				<span className="text-xl">Bag:</span>
				<span className="font-bold text-xl">{tiles.length}</span>
				<span className="badge ml-auto">vocals {vocals}</span>
				<span className="badge">
					consonants {tiles.length - vocals}
				</span>
			</h1>
			<ul className="flex flex-wrap gap-2">
				{tiles.map((tile, i, array) => (
					<React.Fragment key={i}>
						{i > 0 && array[i - 1].char !== tile.char && (
							<div className="mx-1"></div>
						)}
						<LetterTile
							tile={tile}
							tooltip={true}
							displayPoints={false}
							size="kbd-md"
						/>
					</React.Fragment>
				))}
			</ul>
		</div>
	);
}
