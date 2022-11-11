import React, { useMemo } from 'react';
import useMessage from '../../hooks/useMessage';
import { Bench } from '../../types/GameTypes';
import { WSRequest } from '../../types/WSRequest';
import LetterTile from './LetterTile';
import { ImShuffle } from 'react-icons/im';
import { FaAngleDoubleDown } from 'react-icons/fa';

type InputDisplayProps = {
	bench: Bench;
};

export default function InputDisplay({ bench }: InputDisplayProps) {
	const message = useMessage();

	const tiles = bench.tilesOnHand;

	const trade = () => {
		message(new WSRequest('game:move:trade', {}));
	};

	const skip = () => {
		message(new WSRequest('game:move:skip', {}));
	};

	const place = () => {
		message(new WSRequest('game:move:place', {}));
	};

	const forfeit = () => {
		message(new WSRequest('game:move:forfeit', {}));
	};

	const takeTilesBack = () => {};

	return (
		<div>
			<section className="bg-base-300 rounded-lg my-2 flex flex-row justify-center gap-2 p-2">
				<button onClick={takeTilesBack} className="btn btn-info">
					<FaAngleDoubleDown size={'1.3rem'} />
				</button>
				{tiles.map((tile, i) => (
					<LetterTile
						key={i}
						tile={tile}
						displayPoints={true}
						tooltip={false}
						className={'hover:border-info'}
					/>
				))}
			</section>
			<section className="btn-group flex gap-2">
				<button
					onClick={forfeit}
					className="btn btn-outline btn-error flex-1"
				>
					Forfeit
				</button>
				<button
					onClick={skip}
					className="btn btn-outline btn-info flex-1"
				>
					Skip
				</button>
				<button
					onClick={trade}
					className="btn btn-outline btn-info flex-1"
				>
					Trade
				</button>
				<button
					onClick={place}
					className="btn btn-outline btn-success flex-1"
				>
					Place
				</button>
			</section>
		</div>
	);
}
