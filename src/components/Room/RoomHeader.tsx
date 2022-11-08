import { MdOutlineContentCopy } from 'react-icons/md';

type RoomHeaderProps = {
	id: string;
	name: string;
};

export default function RoomHeader({ id, name }: RoomHeaderProps) {
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
			<span className="ml-auto font-semibold badge badge-info">
				{name}
			</span>
		</header>
	);
}
