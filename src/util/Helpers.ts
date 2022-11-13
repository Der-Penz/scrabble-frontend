function padTo2Digits(num: number) {
	return num.toString().padStart(2, '0');
}

export function formatMillis(millis: number) {
	let seconds = Math.abs(Math.floor(millis / 1000));
	let minutes = Math.abs(Math.floor(seconds / 60));
	let hours = Math.abs(Math.floor(minutes / 60));

	seconds = seconds % 60;
	minutes = minutes % 60;

	return {
		hours,
		minutes,
		seconds,
		positive: millis >= 0,
		string: `${millis < 0 && '-'}${hours}:${minutes}:${seconds}`,
	};
}
