import React from 'react';
import { Button, Form, Message } from 'semantic-ui-react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/auth';
import { useForm } from '../utils/hooks';

const Login = () => {
	const context = React.useContext(AuthContext);
	const navigate = useNavigate();
	const [errors, setErrors] = React.useState({});

	const { onChange, onSubmit, values } = useForm(loginUserCallback, {
		username: '',
		password: '',
	});

	const [loginUser, { loading }] = useMutation(LOGIN_USER, {
		update(proxy, result) {
			context.login(result.data.login);
			navigate('/');
		},
		onError(err) {
			setErrors(err.graphQLErrors[0].extensions.errors);
		},
		variables: values,
	});

	function loginUserCallback() {
		loginUser();
	}

	return (
		<div className="form-container">
			<Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
				<h1>Login</h1>
				<Form.Input
					type="text"
					label="Username"
					placeholder="Username.."
					name="username"
					value={values.username}
					error={errors.username ? true : false}
					onChange={onChange}
				/>
				<Form.Input
					type="password"
					label="Password"
					placeholder="Password.."
					name="password"
					value={values.password}
					error={errors.password ? true : false}
					onChange={onChange}
				/>
				<Button type="submit" primary>
					Login
				</Button>
				{Object.keys(errors).length > 0 && (
					<Message negative list={Object.values(errors)} />
				)}
			</Form>
		</div>
	);
};

const LOGIN_USER = gql`
	mutation login($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			id
			email
			username
			createdAt
			token
		}
	}
`;

export default Login;
