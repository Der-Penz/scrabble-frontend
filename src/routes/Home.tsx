import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateRoom from '../components/CreateRoom';
import JoinRoom from '../components/JoinRoom';
import { useFetch } from '../hooks/useFetch';


export default function Home() {

	return (
		<div>
			<h1>Number 1 letter game in the world</h1>
			
			<section className="h-[80vh] flex flex-col gap-2 justify-center items-center">
				<JoinRoom />
				<CreateRoom />
			</section>
		</div>
	);
}
