import { MdOutlineContentCopy, MdSave } from 'react-icons/md';
import useMessage from '../../hooks/useMessage';
import { WSRequest } from '../../types/WSRequest';

type RoomHeaderProps = {
	id: string;
	name: string;
	host: boolean;
};

export default function RoomHeader({ id, name, host }: RoomHeaderProps) {
	const sendMessage = useMessage();

	const save = () => {
		sendMessage(new WSRequest<undefined>('game:save', undefined));
	};

	return (
		<header className="p-2 mb-2 border-b-2 border-primary flex gap-2 items-center">
			<h3 className="font-bold">Room: {id}</h3>
			<div
				onClick={() =>
					navigator.clipboard.writeText(window.location.href)
				}
				className="relative grid items-center cursor-pointer"
			>
				<MdOutlineContentCopy className="absolute hover:animate-ping" />
				<MdOutlineContentCopy />
			</div>
			<span className="ml-auto font-semibold badge badge-info">{name}</span>
			{host && (
				<MdSave
					onClick={save}
					className=" font-semibold badge badge-warning"
				/>
			)}
		</header>
	);
}
