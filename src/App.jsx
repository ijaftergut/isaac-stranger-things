import { useState, useEffect } from 'react'
import api from './api';
import AuthForm from './AuthForm';
import CreatePost from './CreatePost';
import Posts from './Posts';
import Post from './Post';
import AboutUs from './AboutUs';
import ContactUs from './ContactUs';

import { useNavigate, useParams, Link, Routes, Route } from 'react-router-dom';
const HighestCost = ({ posts }) => {
  const postsWithPrices = posts.map((post) => ({
    post,
    price: parseFloat(post.price)
  }));

  const validPosts = postsWithPrices.filter((post) => !isNaN(post.price));

  validPosts.sort((a, b) => b.price - a.price);

  const highestPricePost = validPosts[0]; 
  if (highestPricePost) {
    const { post } = highestPricePost; 
    return (
      <div>
        <h1>{post.title}</h1>
        <h4>Posted by: {post.author.username}</h4>
        <p>{post.description}</p>
      </div>
    );
  } else {
    return <div>No posts</div>;
  }
};


function App() {
  const [auth, setAuth] = useState({});
  const [posts, setPosts] = useState([]);

  const navigate = useNavigate();

  useEffect(()=> {
    const fetchPosts = async()=> {
      const posts = await api.fetchPosts();
      setPosts(posts);
    };
    fetchPosts();
  }, []);

  useEffect(()=> {
    const attemptLogin = async()=> {
      try {
        const _auth = await api.loginWithToken();
        setAuth(_auth);
      }
      catch(ex){
        console.log(ex);
      }
    };
    attemptLogin();
  }, []);

  const register = async(credentials)=> {
    const _auth = await api.register(credentials);
    setAuth(_auth);
  };

  const login = async(credentials)=> {
    const _auth = await api.login(credentials);
    setAuth(_auth);
  };

  const logout = ()=> {
    api.logout();
    setAuth({});
  };

  const createPost = async(post)=> {
    post = await api.createPost(post);
    setPosts([...posts, post]);
    navigate(`/posts/${post._id}`);
  };

  const usersPosts = posts.filter((post)=> post.author._id === auth._id)

  return (
    <>
      <h1><Link to='/'>Strangers Things ({ posts.length })</Link></h1>
      {
        auth.username ? (
          <div>
            <h1>
              Welcome { auth.username } {usersPosts.length}
              <button onClick={ logout }>Logout</button>
            </h1>
            <Link to='/posts/create'>Create A Post</Link>
            <Link to='/about_us'>About Us</Link>
            <Link to='/contact_us'>Contact Us</Link>
            <Link to='/highest_cost'>Highest Priced Product</Link>
            <Routes>
              <Route path='/posts/create' element={ <CreatePost createPost={ createPost } />} />
            </Routes>
          </div>
        ): (
          <>
            <AuthForm submit={ register } txt='Register'/>
            <AuthForm submit={ login } txt='Login'/>
            <Link to='/about_us'>About Us</Link>
            <Link to='/contact_us'>Contact Us</Link>
            <Link to='/highest_cost'>Highest Priced Product</Link>
          </>
        )
      }
      <Posts posts={ posts } auth={ auth }/>
      <Routes>
        <Route path='/posts/:id' element={ <Post posts={ posts } auth={ auth } setPosts={setPosts}/>} />
        <Route path='/about_us' element={ <AboutUs />} />
        <Route path='/contact_us' element={ <ContactUs />} />
        <Route path='/highest_cost' element={<HighestCost posts={ posts }/>}/>
      </Routes>
    </>
  )
}

export default App
