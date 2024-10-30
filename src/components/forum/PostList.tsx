// src/components/PostList.tsx
import React, { useEffect, useState } from 'react';
import { Post } from './Post';
// import backImage from "."
import usePost from '../../hooks/usePost';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { create } from 'domain';

export const PostList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [newPost, setNewPost] = useState('');
  const category_id = searchParams.get('categoryId') || "" // Gán giá trị cụ thể
  const topic_id = searchParams.get('topicId') || ""; // Gán giá trị cụ thể
  const subjectTopic = location.state;

  const { posts, error, loading, getPosts, createPost, deletePost } = usePost();
  const [timeStrings, setTimeStrings] = useState<string[]>([]);

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
        <img src={`/previous.png`} alt="forum" className="h-8" onClick={() => navigate(-1)} />
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
