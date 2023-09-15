import { Link } from 'react-router-dom';

const Posts = ({ posts, auth })=> {
  
  return (
    
    <ul>
    {posts.map(post => {
      const price = typeof post.price === 'string' ? post.price : parseFloat(post.price)
      return (
            <li key={ post._id } className={ post.author._id === auth._id ? 'mine': ''}>
              <Link to={`/posts/${post._id}`}>{ post.title }</Link>, Posted by: {post.author.username}, Location: {post.location}, Costs: ${ price }
            </li>
          );
        })
      }
    </ul>

  );
};

export default Posts;

