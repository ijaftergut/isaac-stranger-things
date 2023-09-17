import React, { useState, useEffect } from 'react';
import api from "./api";
import { useParams, Link, useNavigate, Route, Routes } from 'react-router-dom';
import CreatePost from './CreatePost';



const UpdatePost = async ({ updatePost }, {post}) => {
    
    post = await post
    console.log(post)

    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [_id, setId] = useState('')
    const [error, setError] = useState('');
    setId(post.author._id)
    const submit = async (ev) => {
      ev.preventDefault();
      try {
        updatePost = api.updatePost
        const post = { price, title, description, location, _id };
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
  export default UpdatePost