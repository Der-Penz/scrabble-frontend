export type RoomSetting = {
	minutes: number;
	points: number;
	objectiveType: Objective;
};

export enum Objective {
	BASE = 'BASE',
	TIME = 'TIME',
	POINTS = 'POINT',
	SEPARATED_TIME = 'SEPARATED_TIME',
}