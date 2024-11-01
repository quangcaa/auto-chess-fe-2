// src/components/PostList.tsx
import React, { useEffect, useState } from 'react';
import { Post } from './Post';
import backImage from "/back.jpg";
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import api from "../../utils/axios";


export const PostList = () => {

  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Get Postlist
  const getPosts = async (category_id, topic_id) => {
    setLoading(true);
    try {
      const response = await api.get(`http://localhost:3333/forum/${category_id}/${topic_id}`);
      setPosts(response.data.posts);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Create post
  const createPost = async (category_id, topic_id, message) => {
    setLoading(true);
    try {
      const response = await api.post(
        `http://localhost:3333/forum/${category_id}/${topic_id}/create`,
        { message }
      );

      if (response.data.success) {
        setPosts((prevPosts) => [...prevPosts, {...response.data.post, username: localStorage.getItem('username')}]);
      } else {
        setError(new Error(response.data.message));
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete post
  const deletePost = async (post_id) => {
    setLoading(true);
    try {
      const response = await api.delete(`http://localhost:3333/forum/p/${post_id}`);

      if (response.data.success) {
        setPosts((prevPosts) => prevPosts.filter((post) => post.post_id !== post_id));
      } else {
        setError(new Error(response.data.message));
      }
    } catch (err) {
      setError(err );
    } finally {
      setLoading(false);
    }
  };
  
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [newPost, setNewPost] = useState('');
  const category_id = searchParams.get('categoryId') || "" // Gán giá trị cụ thể
  const topic_id = searchParams.get('topicId') || ""; // Gán giá trị cụ thể
  const subjectTopic = location.state;
  const [timeStrings, setTimeStrings] = useState([]);

  useEffect(() => {
    getPosts(category_id, topic_id);
  }, [category_id, topic_id]);

  useEffect(() => {
    const calculateTimeDifferences = () => {
      const currentTime = new Date();
      const formattedTimes = posts.map(({ created_at }) => {
        const apiDate = new Date(created_at);
        const timeDifference = currentTime.getTime() - apiDate.getTime();
        const seconds = Math.floor(timeDifference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);

        let formattedTime;

        if (timeDifference < 60000) {
          formattedTime = `now`;
        } else if (timeDifference < 3600000) {
          // < 1 hours
          formattedTime = `${minutes} minutes ago`;
        } else if (timeDifference < 86400000) {
          // < 1 day
          formattedTime = `${hours} hours ago`;
        } else if (timeDifference < 2592000000) {
          // < 1 month
          formattedTime = ` ${days} days ago`;
        } else {
          // >1 month
          const day = apiDate.getUTCDate();
          const month = apiDate.getUTCMonth() + 1;
          const year = apiDate.getUTCFullYear();
          formattedTime = ` ${year}/${month}/${day}`; // yyyy/mm/dd
        }

        return formattedTime;
      });

      setTimeStrings(formattedTimes);
    };

    calculateTimeDifferences();
  }, [posts]);

  const handleAddPost = () => {
    if (newPost.trim()) {
      createPost(category_id, topic_id, newPost);
      setNewPost('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <div className="flex flex-row items-center gap-4">
        <img src= {backImage} alt="forum" className="h-8" onClick={() => navigate(-1)} />
        <p className="text-3xl">{subjectTopic}</p>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error.message}</p>}

      {posts.map((post, index) => (
        <Post
          key={post.post_id}
          post={{ id: post.post_id, username: post.username, text: post.content, created_at: timeStrings[index] }}
          onDelete={() => deletePost(post.post_id)}
        />
      ))}

      <div className="mt-4">
        <textarea
          className="w-full p-2 border rounded mb-2"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Add a new Post"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleAddPost}
        >
          Add Post
        </button>
      </div>
    </div>
  );
};
