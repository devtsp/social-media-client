import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { Button, Icon, Confirm } from 'semantic-ui-react';

import { FETCH_POSTS_QUERY } from '../utils/graphql';
import ButtonPopup from '../utils/ButtonPopup';

const DeleteButton = ({ postId, callback, commentId }) => {
	const [confirmOpen, setConfirmOpen] = React.useState(false);

	const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

	const [deletePostOrComment] = useMutation(mutation, {
		update(proxy, result) {
			setConfirmOpen(false);
			if (!commentId) {
				// If not coment must be be a post
				const data = proxy.readQuery({ query: FETCH_POSTS_QUERY });
				const newData = JSON.parse(JSON.stringify(data));
				newData.getPosts = newData.getPosts.filter(p => p.id !== postId);
				proxy.writeQuery({ query: FETCH_POSTS_QUERY, data: newData });
			}
			if (callback) callback(); // In PostCard callback is not provided
		},
		variables: { postId, commentId },
	});

	return (
		<>
			<ButtonPopup content={commentId ? 'Delete comment' : 'Delete Post'}>
				<Button
					as="div"
					color="red"
					floated="right"
					onClick={() => setConfirmOpen(true)}
				>
					<Icon name="trash" style={{ margin: 0 }}></Icon>
				</Button>
			</ButtonPopup>

			<Confirm
				open={confirmOpen}
				onCancel={() => setConfirmOpen(false)}
				onConfirm={() => deletePostOrComment()}
			/>
		</>
	);
};

const DELETE_POST_MUTATION = gql`
	mutation deletePost($postId: ID!) {
		deletePost(postId: $postId)
	}
`;

const DELETE_COMMENT_MUTATION = gql`
	mutation deleteComment($postId: ID!, $commentId: ID!) {
		deleteComment(postId: $postId, commentId: $commentId) {
			id
			comments {
				id
				username
				createdAt
				body
			}
		}
	}
`;

export default DeleteButton;
