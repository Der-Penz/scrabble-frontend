export type OpenRoom = {
	playerCount: number;
	gameState: string;
	host: string;
	roomID: string;
	roomJoinUrl: string;
};

export type ExitsRoom = {
	idToCheck: boolean;
	exists: boolean;
	gameState: 'playing' | 'waiting' | 'ended';
	paused: boolean;
};
