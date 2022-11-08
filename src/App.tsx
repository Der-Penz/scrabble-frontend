import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import UrlProvider from './contexts/UrlContext';
import Home from './routes/Home';
import Room from './routes/Room';

function App() {
	return (
		<div className='h-[100vh] flex flex-col'>
			<Navbar></Navbar>
			<BrowserRouter>
				<Routes>
					<Route
						path="/room"
						element={
							<UrlProvider>
								<Room />
							</UrlProvider>
						}
					/>
					<Route path="*" element={<Home />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
