import { Board, BoardPosition, Tile } from '../../types/GameTypes';
import BoardTile from './BoardTile';

type BoardProps = {
	board: Board;
	placedTiles: BoardPosition[];
	onDrop: (tile: Tile, position: BoardPosition) => void;
};

export default function BoardDisplay({
	board,
	onDrop,
	placedTiles,
}: BoardProps) {
	return (
		<div className="flex flex-row gap-1 bg-base-300 rounded-md p-2 border-neutral border-4 aspect-square max-w-[44rem] mx-auto">
			{board.map((row, i) => (
				<div key={i} className="grid gap-1 flex-1">
					{row.map((pos, j) => {
						const placedTile = placedTiles.find(
							(position) =>
								position.x === pos.x && position.y === pos.y
						);
						if (placedTile) {
							return (
								<BoardTile
									key={`${i}${j}`}
									pos={placedTile}
									onDrop={onDrop}
									draggable={true}
								/>
							);
						} else {
							return (
								<BoardTile
									key={`${i}${j}`}
									pos={pos}
									onDrop={onDrop}
								/>
							);
						}
					})}
				</div>
			))}
		</div>
	);
}
