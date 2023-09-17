import React, { useState, useEffect } from 'react';
import api from "./api";
import { useParams, Link, useNavigate } from 'react-router-dom';

const UpdatePost = ({ updatePost, post }) => {
  console.log(post._id)
  const [price, setPrice] = useState(post.price);
  const [description, setDescription] = useState(post.description);
  const [title, setTitle] = useState(post.title);
  const [location, setLocation] = useState(post.location);
  const [error, setError] = useState('');
  const id = post._id
  const submit = async (ev) => {
    ev.preventDefault();
    try {
      const post = { price, title, description, location, id };
      await updatePost(post);
    } catch (ex) {
      if (ex.response) {
        setError(ex.response.data);
      } else {
        setError(ex.response);
      }
    }
  };

  return (
    <div>
      <form onSubmit={submit}>
        {error ? JSON.stringify(error, null, 2) : null}
        <input placeholder='title' onChange={ev => setTitle(ev.target.value)} />
        <input placeholder='description' onChange={ev => setDescription(ev.target.value)} />
        <input placeholder='price' onChange={ev => setPrice(ev.target.value)} />
        <input placeholder='location' onChange={ev => setLocation(ev.target.value)} />
        <button>Update</button>
      </form>

    </div>
  );
};

const Post = ({ posts, auth, setPosts }) => {
  const updatePost = async(post)=> {
    post = await api.updatePost(post);
    const updated = posts.map(item => item._id === post._id ? post : item)
    console.log(updated)
    setPosts([...updated])
  };

  const { id } = useParams();
  const navigate = useNavigate();
  const post = posts.find(post => post._id === id);

  if (!post) {
    return null;
  }

  const handleDeletePost = async () => {
    try {
      await api.deletePost(post._id);
      await setPosts(posts.filter(_post => _post._id !== post._id));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
    navigate("/");
  };

  return (
    <div>
      <h1>{post.title}</h1>
      <h4>Posted by: {post.author.username}</h4>
      <p>{post.description}</p>
      {auth._id === post.author._id ? (
        <button onClick={handleDeletePost}>Delete</button>
      ) : (
        ''
      )}

      {auth._id === post.author._id && (
        <UpdatePost updatePost={updatePost} post={post}/>
      )}    
      <Link to='/'>Cancel</Link>
    </div>
  );
};

export default Post;