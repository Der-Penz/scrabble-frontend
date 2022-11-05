import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './routes/Home';
import Room from './routes/Room';

function App() {

	return (
		<div>
			<Navbar></Navbar>
			<BrowserRouter>
				<Routes>
					<Route path="/room" element={<Room />} />
					<Route path="*" element={<Home />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
