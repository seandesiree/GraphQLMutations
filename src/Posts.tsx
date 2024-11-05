import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';


const GET_POSTS = gql`
  query {
    posts {
      id
      title
      body
    }
  }
`;

const CREATE_POST = gql`
  mutation CreatePost($title: String!, $body: String!) {
    createPost(input: { title: $title, body: $body }) {
      post {
        id
        title
        body
      }
    }
  }
`;

const UPDATE_POST = gql`
  mutation UpdatePost($id: ID!, $title: String!, $body: String!) {
    updatePost(id: $id, input: { title: $title, body: $body }) {
      post {
        id
        title
        body
      }
    }
  }
`;

const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id) {
      post {
        id
      }
    }
  }
`;

const Posts: React.FC = () => {
  const { loading, error, data } = useQuery(GET_POSTS);
  const [createPost] = useMutation(CREATE_POST);
  const [updatePost] = useMutation(UPDATE_POST);
  const [deletePost] = useMutation(DELETE_POST);

  const [newPost, setNewPost] = useState({ title: '', body: '' });
  const [editPostId, setEditPostId] = useState<string | null>(null);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleCreatePost = async () => {
    await createPost({ variables: { title: newPost.title, body: newPost.body } });
    setNewPost({ title: '', body: '' });
  };

  const handleUpdatePost = async (id: string) => {
    await updatePost({ variables: { id, title: newPost.title, body: newPost.body } });
    setEditPostId(null);
    setNewPost({ title: '', body: '' });
  };

  const handleDeletePost = async (id: string) => {
    await deletePost({ variables: { id } });
  };

  return (
    <div>
      <h2>Posts</h2>
      <div>
        <h3>Create a New Post</h3>
        <input
          type="text"
          placeholder="Title"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
        />
        <textarea
          placeholder="Body"
          value={newPost.body}
          onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
        />
        <button onClick={handleCreatePost}>Create Post</button>
      </div>

      <div>
        {data.posts.map((post: { id: string; title: string; body: string }) => (
          <div key={post.id}>
            <h4>{post.title}</h4>
            <p>{post.body}</p>
            <button onClick={() => { setEditPostId(post.id); setNewPost({ title: post.title, body: post.body }); }}>Edit</button>
            <button onClick={() => handleDeletePost(post.id)}>Delete</button>
          </div>
        ))}
      </div>

      {editPostId && (
        <div>
          <h3>Editing Post</h3>
          <input
            type="text"
            placeholder="Title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <textarea
            placeholder="Body"
            value={newPost.body}
            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
          />
          <button onClick={() => handleUpdatePost(editPostId!)}>Update Post</button>
        </div>
      )}
    </div>
  );
};

export default Posts;
