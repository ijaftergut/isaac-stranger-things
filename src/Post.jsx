import { useState, useEffect } from 'react'
import api from "./api"
import { useParams, Link , useNavigate} from 'react-router-dom';

const Post = ({ posts, auth })=> {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = posts.find(post => post._id === id);
  if(!post){
    return null;
  }
  const handleDeletePost = async () => {
    if(post){
    try {
      await api.deletePost(post._id);
      setPosts(posts.filter(_post=> _post.id !== post._id));
    } catch (error) {

      console.error('Error deleting post:', error);
    }
  }
 
  navigate("/posts")
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
    </div>
  );
};

export default Post;
