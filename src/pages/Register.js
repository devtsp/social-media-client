import React from 'react';
import { Button, Form, Message } from 'semantic-ui-react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/auth';
import { useForm } from '../utils/hooks';

const Register = () => {
	const context = React.useContext(AuthContext);
	const navigate = useNavigate();
	const [errors, setErrors] = React.useState({});

	const { onChange, onSubmit, values } = useForm(registerUser, {
		username: '',
		email: '',
		password: '',
		confirmPassword: '',
	});

	const [addUser, { loading }] = useMutation(REGISTER_USER, {
		update(proxy, result) {
			context.login(result.data.register);
			navigate('/');
		},
		onError(err) {
			console.log(err);
			setErrors(err.graphQLErrors[0].extensions.errors);
		},
		variables: values,
	});

	function registerUser() {
		addUser();
	}

	return (
		<div className="form-container">
			<Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
				<h1>Register</h1>
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
					type="email"
					label="Email"
					placeholder="Email.."
					name="email"
					value={values.email}
					error={errors.email ? true : false}
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
				<Form.Input
					type="password"
					label="Confirm Password"
					placeholder="Confirm Password.."
					name="confirmPassword"
					value={values.confirmPassword}
					error={errors.confirmPassword ? true : false}
					onChange={onChange}
				/>
				<Button type="submit" primary>
					Register
				</Button>
				{Object.keys(errors).length > 0 && (
					<Message negative list={Object.values(errors)} />
				)}
			</Form>
		</div>
	);
};

const REGISTER_USER = gql`
	mutation register(
		$username: String!
		$email: String!
		$password: String!
		$confirmPassword: String!
	) {
		register(
			registerInput: {
				username: $username
				email: $email
				password: $password
				confirmPassword: $confirmPassword
			}
		) {
			id
			email
			username
			createdAt
			token
		}
	}
`;

export default Register;
