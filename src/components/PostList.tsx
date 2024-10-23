import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Post from './Post'; // Import component Post

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:3333/api/posts');
        setPosts(response.data);
      } catch (error) {
        setError('Failed to fetch posts.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Posts</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.post_id}>
            <Post post={post} /> {/* Sử dụng component Post */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostList;
