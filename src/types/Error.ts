export type Error =
	| 'ClientError'
	| 'Server Error'
	| 'Unauthorized'
	| 'Invalid Code'
	| 'IllegalPlacement'
	| 'InvalidWord'
	| 'NotConnected'
	| 'GapInWord'
	| 'OutOfBoard'
	| 'BoardPlaceTaken'
	| 'TileNotOnHand'
	| 'NotCentered'
	| 'FetchError';
