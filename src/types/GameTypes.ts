export type Tile = {
    char: string,
    points: number,
}

export type BoardPosition = {
    x: number,
    y: number,
    placedTile: Tile | null,
    factor?: number,
    type?: 'WORD' | 'LETTER',
    used?: boolean,   
}

export type Board = BoardPosition[][]

export type GameInfo = {
	currentPlayer: string;
	players: {
		[name: string]: number;
	};
	timeToPlay?: number;
};

export type Bag = {
	tiles: Tile[];
};

