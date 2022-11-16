export type Tile = {
	char: string;
	points: number;
	as?: string;
};

export type BoardPosition = {
	x: number;
	y: number;
	placedTile: Tile | null;
	factor?: number;
	type?: 'WORD' | 'LETTER';
	used?: boolean;
};

export type Board = BoardPosition[][];

export type GameInfo = {
	currentPlayer: string;
	players: { [name: string]: { points: number; timeLeft: number } };
	timeToPlay: number;
};

export type Bag = {
	tiles: Tile[];
};

export type Bench = {
	tilesOnHand: Tile[];
	points: number;
	owner: string;
	maxTiles: number;
};
