export type RoomSetting = {
	minutes: number;
	points: number;
	objectiveType: Objective;
};

export enum Objective {
	BASE = 'Base',
	TIME = 'Time',
	POINTS = 'Points',
	SEPARATED_TIME = 'Separated Time',
}