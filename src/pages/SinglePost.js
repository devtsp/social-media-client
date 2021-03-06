import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gql, useQuery, useMutation } from '@apollo/client';
import { Card, Image, Button, Icon, Label, Form } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';
import { timePassed } from '../utils/time-passed';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';
import ButtonPopup from '../utils/ButtonPopup';

const SinglePost = () => {
	const navigate = useNavigate();
	const { postId } = useParams();
	const { user } = React.useContext(AuthContext);
	const [comment, setComment] = React.useState('');
	const commentInputRef = React.useRef(null);

	const { loading, data } = useQuery(FETCH_POST_QUERY, {
		variables: {
			postId,
		},
	});

	const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
		update(proxy, result) {
			setComment('');
			commentInputRef.current.blur();
		},
		variables: {
			postId,
			body: comment,
		},
	});

	function deletePostCallback() {
		navigate('/');
	}

	let postMarkup;

	if (loading) {
		postMarkup = <p>Loading Post..</p>;
	} else {
		const { id, body, createdAt, username, comments, likes } = data.getPost;

		postMarkup = (
			<section className="SinglePost">
				<article className="post">
					{' '}
					<img
						src="https://react.semantic-ui.com/images/avatar/large/molly.png"
						alt="user-pic"
					/>
					<Card fluid>
						<Card.Content>
							<Card.Header>{username}</Card.Header>
							<Card.Meta>{timePassed(createdAt)}</Card.Meta>
							<Card.Description>{body}</Card.Description>
						</Card.Content>
						<hr />
						<Card.Content extra>
							<ButtonPopup content="Like post">
								<LikeButton user={user} post={{ id, likes }} />
							</ButtonPopup>
							<Button as="div" labelPosition="right">
								<Button basic color="blue">
									<Icon name="comments"> </Icon>
								</Button>
								<Label basic color="blue" pointing="left">
									{comments.length}
								</Label>
							</Button>
							{user && user.username === username && (
								<DeleteButton postId={id} callback={deletePostCallback} />
							)}
						</Card.Content>
					</Card>
				</article>
				<section className="comment-section">
					{user && (
						<Card fluid>
							<Card.Content>
								<p>Post a comment</p>
								<Form>
									<div className="ui action input fluid">
										<input
											type="text"
											placeholder="Comment.."
											name="comment"
											value={comment}
											onChange={e => setComment(e.target.value)}
											ref={commentInputRef}
										/>
										<button
											type="submit"
											className="ui button teal"
											disabled={comment.trim() === ''}
											onClick={submitComment}
										>
											Submit
										</button>
									</div>
								</Form>
							</Card.Content>
						</Card>
					)}
					{comments.map(comment => (
						<Card fluid key={comment.id}>
							<Card.Content>
								{user && user.username === comment.username && (
									<DeleteButton postId={id} commentId={comment.id} />
								)}
								<Card.Header>{comment.username}</Card.Header>
								<Card.Meta>{timePassed(comment.createdAt)}</Card.Meta>
								<Card.Description>{comment.body}</Card.Description>
							</Card.Content>
						</Card>
					))}
				</section>
			</section>
		);
	}

	return postMarkup;
};

const SUBMIT_COMMENT_MUTATION = gql`
	mutation ($postId: ID!, $body: String!) {
		createComment(postId: $postId, body: $body) {
			id
			comments {
				id
				body
				createdAt
				username
			}
		}
	}
`;

const FETCH_POST_QUERY = gql`
	query ($postId: ID!) {
		getPost(postId: $postId) {
			id
			body
			createdAt
			username
			likes {
				username
			}
			comments {
				id
				username
				createdAt
				body
			}
		}
	}
`;

export default SinglePost;
