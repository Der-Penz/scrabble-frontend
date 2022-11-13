import { Board } from '../../types/GameTypes';
// @ts-ignore
import classNames from 'clean-react-classnames';

type BoardProps = {
	board: Board;
};

export default function BoardDisplay({ board }: BoardProps) {
	return (
		<div className="flex flex-row gap-1 bg-base-300 rounded-md p-2 border-neutral border-4">
			{board.map((row, i) => (
				<div key={i} className="grid gap-1 flex-1">
					{row.map((pos, j) => (
						<div
							key={j}
							className={classNames(
								'kbd flex-1 aspect-square select-none grid place-items-center border',
								{
									'bg-secondary bg-opacity-70':
										pos.type === 'LETTER' &&
										pos.factor === 2,
									'bg-secondary':
										pos.type === 'LETTER' &&
										pos.factor === 3,
									'bg-primary bg-opacity-70':
										pos.type === 'WORD' && pos.factor === 2,
									'bg-primary ':
										pos.type === 'WORD' && pos.factor === 3,
									'bg-base-100': !pos.type,
								}
							)}
						>
							{pos.placedTile && (
								<span className="font-bold">
									{pos.placedTile?.char}
								</span>
							)}
							{!pos.placedTile && pos.type && (
								<span className={classNames('text-xs')}>
									{pos.factor === 2 ? 'D' : 'T'}
									{pos.type === 'LETTER' ? 'L' : 'W'}
								</span>
							)}
						</div>
					))}
				</div>
			))}
		</div>
	);
}
