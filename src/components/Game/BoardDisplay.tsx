import { Board, BoardPosition, Tile } from '../../types/GameTypes';
// @ts-ignore
import classNames from 'clean-react-classnames';
import BoardTile from './BoardTile';

type BoardProps = {
	board: Board;
	onDrop: (tile: Tile, position: BoardPosition) => void;
};

export default function BoardDisplay({ board, onDrop }: BoardProps) {
	return (
		<div className="flex flex-row gap-1 bg-base-300 rounded-md p-2 border-neutral border-4">
			{board.map((row, i) => (
				<div key={i} className="grid gap-1 flex-1">
					{row.map((pos, j) => (
						<BoardTile key={`${i}${j}`} pos={pos} onDrop={onDrop} />
					))}
				</div>
			))}
		</div>
	);
}
