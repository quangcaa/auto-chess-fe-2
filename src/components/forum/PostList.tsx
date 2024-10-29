// src/components/PostList.tsx
import React, { useEffect, useState } from 'react';
import { Post } from './Post';
// import backImage from "."
import usePost from '../../hooks/usePost';

export const PostList: React.FC = () => {
  const [newPost, setNewPost] = useState('');
  const category_id = 1; // Gán giá trị cụ thể
  const topic_id = 1; // Gán giá trị cụ thể

  const { posts, error, loading, getPosts, createPost, deletePost } = usePost();

  useEffect(() => {
    getPosts(category_id, topic_id);
  }, [category_id, topic_id, getPosts]);

  const handleAddPost = () => {
    if (newPost.trim()) {
      createPost(category_id, topic_id, newPost);
      setNewPost('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <div className="flex flex-row items-center gap-4">
        <img src={`/previous.png`} alt="forum" className="h-8" />
        <p className="text-3xl">Lichess to FIDE Rating and other questions</p>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error.message}</p>}

      {posts.map((post) => (
        <Post
          key={post.post_id}
          post={{ id: post.post_id, username: 'User', text: post.content, timestamp: new Date().toLocaleString() }}
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
