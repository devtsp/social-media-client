import { render } from 'react-dom';
import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	createHttpLink,
} from '@apollo/client';

import App from './App';
import { setContext } from 'apollo-link-context';

const httpLink = createHttpLink({
	uri: 'https://social-media-app-back-devtsp.herokuapp.com/',
});

const authLink = setContext(() => {
	const token = localStorage.getItem('jwtToken');
	return {
		headers: {
			Authorization: token ? `Bearer ${token}` : '',
		},
	};
});

const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
});

render(
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>,
	document.getElementById('root')
);
