import React, { useEffect } from 'react';
import { TbLetterCase } from 'react-icons/tb';
import { themeChange } from 'theme-change';

export default function Navbar() {
	useEffect(() => {
		themeChange(false);
	}, []);

	

	return (
		<nav className="flex flex-row gap-2 justify-start p-2 bg-base-300 items-center">
			<TbLetterCase size={'2.4rem'} className='hover:animate-ping border rounded-lg border-primary text-primary p-1'/>
			<a href='/' className='font-bold text-2xl underline decoration-wavy hover:animate-pulse'>Scrabble</a>
			<select defaultValue={localStorage.getItem('theme') || 'Pick a theme'} className='select ml-auto' data-choose-theme>
				<option disabled >Pick a theme</option>
				<option value="dark">Dark</option>
				<option value="light">Light</option>
				<option value="cupcake">Cupcake</option>
				<option value="dracula">Dracula</option>
				<option value="halloween">Halloween</option>
				<option value="lofi">Lofi</option>
				<option value="luxury">Luxury</option>
				<option value="fantasy">Fantasy</option>
				<option value="night">Night</option>
				<option value="coffee">Coffee</option>
				<option value="autumn">Autumn</option>
				<option value="synthwave">Synthwave</option>
			</select>
		</nav>
	);
}
