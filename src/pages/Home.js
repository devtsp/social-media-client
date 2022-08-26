import React from 'react';
import { useQuery } from '@apollo/client';
import { Transition } from 'semantic-ui-react';

import { AuthContext } from '../context/auth.js';
import PostCard from '../components/PostCard.js';
import PostForm from '../components/PostForm';
import { FETCH_POSTS_QUERY } from '../utils/graphql.js';

const Home = () => {
	const { user } = React.useContext(AuthContext);
	const { loading, data } = useQuery(FETCH_POSTS_QUERY);

	return (
		<section className="Home">
			{user && <PostForm />}
			{loading ? (
				<h1>Loading Posts..</h1>
			) : (
				<Transition.Group>
					{data?.getPosts &&
						data.getPosts.map(post => <PostCard post={post} key={post.id} />)}
				</Transition.Group>
			)}
		</section>
	);
};

export default Home;
