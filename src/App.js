import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css';
import './App.css';

import { AuthProvider } from './context/auth';
import AuthRoute from './utils/AuthRoute';

import MenuBar from './components/MenuBar.js';
import Home from './pages/Home.js';
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import SinglePost from './pages/SinglePost';

function App() {
	return (
		<AuthProvider>
			<Router>
				<Container>
					<MenuBar />
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/login" element={<AuthRoute element={Login} />} />
						<Route
							path="/register"
							element={<AuthRoute element={Register} />}
						/>
						<Route path="/posts/:postId" element={<SinglePost />} />
					</Routes>
				</Container>
			</Router>
		</AuthProvider>
	);
}

export default App;
