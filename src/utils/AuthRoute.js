import React from 'react';
import { Navigate } from 'react-router-dom';

import { AuthContext } from '../context/auth';

function AuthRoute({ element: Component, ...rest }) {
	const { user } = React.useContext(AuthContext);

	return user ? <Navigate to="/" /> : <Component {...rest} />;
}

export default AuthRoute;
