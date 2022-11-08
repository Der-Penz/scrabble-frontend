import React from 'react';
import { Objective, RoomSetting } from '../../types/RoomSetting';

type RoomSettingProps = {
	startGame: (e: React.FormEvent<HTMLFormElement>) => void;
	setFormData: React.Dispatch<React.SetStateAction<RoomSetting>>;
	formData: RoomSetting;
};

export default function RoomSettings({
	startGame,
	setFormData,
	formData,
}: RoomSettingProps) {
	return (
		<form onSubmit={startGame} className="flex flex-col gap-2 max-w-xs">
			<select
				onChange={(e) =>
					setFormData((prev) => ({
						...prev,
						objectiveType: e.target.value as Objective,
					}))
				}
				className="select select-bordered w-full max-w-xs"
				defaultValue={'Select objective'}
			>
				<option disabled>Select objective</option>
				<option>{Objective.BASE}</option>
				<option>{Objective.TIME}</option>
				<option>{Objective.POINTS}</option>
				<option>{Objective.SEPARATED_TIME}</option>
			</select>
			<input
				type="number"
				disabled={formData.objectiveType !== Objective.POINTS}
				placeholder="Points to reach"
				min="10"
				max="1000"
				className="input input-bordered"
				onChange={(e) =>
					setFormData((prev) => ({
						...prev,
						points: parseInt(e.target.value),
					}))
				}
			/>

			<input
				type="number"
				disabled={
					formData.objectiveType !== Objective.SEPARATED_TIME &&
					formData.objectiveType !== Objective.TIME
				}
				placeholder="Time to play in minutes"
				min="1"
				max="1000"
				className="input input-bordered"
				onChange={(e) =>
					setFormData((prev) => ({
						...prev,
						minutes: parseInt(e.target.value),
					}))
				}
			/>
			<button type="submit" className="btn btn-primary">
				start
			</button>
		</form>
	);
}
