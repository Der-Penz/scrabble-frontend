import Action from './Actions';

export class WSRequest<T> {
	private action: Action;
	private message: T;

	constructor(action: Action, message: T) {
		this.action = action;
		this.message = message;
	}

	getAction() {
		return this.action;
	}

	getMessage() {
		return this.message;
	}

	toJSON() {
		return {
			action: this.action,
			message: this.message,
		};
	}
}
