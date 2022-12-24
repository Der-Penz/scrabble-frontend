import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ModalProvider from './contexts/ModalContext';
import WebsocketProvider from './contexts/WebsocketContext';
import Home from './routes/Home';
import Room from './routes/Room';

function App() {
	return (
		<div className="h-[100vh] flex flex-col">
			<ModalProvider>
				<Navbar></Navbar>

				<BrowserRouter>
					<Routes>
						<Route
							path="/room"
							element={
								<WebsocketProvider>
									<Room />
								</WebsocketProvider>
							}
						/>
						<Route path="*" element={<Home />} />
					</Routes>
				</BrowserRouter>
			</ModalProvider>
		</div>
	);
}

export default App;
