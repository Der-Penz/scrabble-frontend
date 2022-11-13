import { useState } from 'react';
import useMessage from '../../hooks/useMessage';
import { Bench } from '../../types/GameTypes';
import { WSRequest } from '../../types/WSRequest';
import LetterTile from './LetterTile';
import { FaAngleDoubleDown } from 'react-icons/fa';
import useModal from '../../hooks/useModal';
// @ts-ignore
import classNames from 'clean-react-classnames';

type InputDisplayProps = {
	bench: Bench;
	onTurn: boolean;
};

export default function InputDisplay({ bench, onTurn }: InputDisplayProps) {
	const message = useMessage();
	const showModal = useModal();
	const [selected, setSelected] = useState<number>();

	const TradeElement = (
		<div className="flex flex-col gap-2 items-center">
			<span className="block">select the tiles you wanna trade</span>
			<div className="flex gap-2">
				{/* {bench.tilesOnHand.map((tile, i) => (
					<div className="flex flex-col gap-2 items-center">
						<LetterTile
							key={i}
							tile={tile}
							displayPoints={true}
							tooltip={false}
							className={'hover:border-info kbd-xs'}
						/>
						<input
							type="checkbox"
							defaultChecked={false}
							className="checkbox"
							onChange={(
								e: React.ChangeEvent<HTMLInputElement>
							) => {
								console.log(selected);
								
								setSelected((prev) => [
									...new Set([...prev, i]),
								]);
								if (e.target.checked) {
								}else{
									setSelected(prev => prev.filter((number) => number !== i));
								}
							}}
						/>
					</div>
				))} */}
			</div>
		</div>
	);

	const trade = () => {
		showModal({
			title: 'Trading',
			content: TradeElement,
			acceptButton: {
				content: 'trade',
				onAccept: () => {
					// message(new WSRequest('game:move:trade', {}));
				},
			},
			deniedButton: {
				content: 'discard',
				onDenied: () => {},
			},
		});
	};

	const skip = () => {
		showModal({
			title: 'Skip turn?',
			content:
				'you wont get any new tile or points after skipping your turn',
			acceptButton: {
				content: 'skip',
				onAccept: () => {
					message(new WSRequest('game:move:skip', {}));
				},
			},
			deniedButton: {
				content: 'discard',
				onDenied: () => {},
			},
		});
	};

	const place = () => {
		message(new WSRequest('game:move:place', {}));
	};

	const forfeit = () => {
		showModal({
			title: 'You really want to forfeit?',
			content:
				'you will lose the game immediately even if you are currently winning',
			acceptButton: {
				content: 'forfeit',
				onAccept: () => {
					message(new WSRequest('game:move:forfeit', {}));
				},
			},
			deniedButton: {
				content: 'discard',
				onDenied: () => {},
			},
		});
	};

	const takeTilesBack = () => {};

	const selectTile = (index: number) => {
		setSelected(selected === index ? -1 : index);
	};

	return (
		<div>
			<section className="bg-base-300 rounded-lg my-2 flex flex-row justify-center gap-2 p-2">
				<button onClick={takeTilesBack} className="btn btn-info">
					<FaAngleDoubleDown size={'1.3rem'} />
				</button>
				{bench.tilesOnHand.map((tile, i) => (
					<LetterTile
						key={i}
						tile={tile}
						displayPoints={true}
						tooltip={false}
						className={classNames(
							{ 'border-info scale-110': selected === i },
						)}
						onClick={() => selectTile(i)}
					/>
				))}
			</section>
			<section className="btn-group flex gap-2">
				<button
					onClick={forfeit}
					className={classNames('btn btn-outline btn-error flex-1')}
				>
					Forfeit
				</button>
				<button
					onClick={skip}
					className={classNames('btn btn-outline btn-info flex-1', {
						'btn-disabled opacity-50': !onTurn,
					})}
				>
					Skip
				</button>
				<button
					onClick={trade}
					className={classNames('btn btn-outline btn-info flex-1', {
						'btn-disabled opacity-50': !onTurn,
					})}
				>
					Trade
				</button>
				<button
					onClick={place}
					className={classNames(
						'btn btn-outline btn-success flex-1',
						{
							'btn-disabled opacity-50': !onTurn,
						}
					)}
				>
					Place
				</button>
			</section>
		</div>
	);
}
