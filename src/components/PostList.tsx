import React, { useState } from 'react';
import { Post }  from './Post';
import backImage from "./../assets/images/back.png";

interface PostData {
  id: number;
  username: string;
  text: string;
  timestamp: string;
}

export const PostList: React.FC = () => {
  const [Posts, setPosts] = useState<PostData[]>([
    { id: 1, username: 'User1', text: 'This is a Post', timestamp: '2024-10-16' },
  ]);
  const [newPost, setNewPost] = useState('');

  const addPost = () => {
    const newId = Posts.length + 1;
    setPosts([
      ...Posts,
      { id: newId, username: 'New User', text: newPost, timestamp: new Date().toLocaleString() },
    ]);
    setNewPost('');
  };

  const deletePost = (id: number) => {
    setPosts(Posts.filter(Post => Post.id !== id));
  };

  const editPost = (id: number, text: string) => {
    setPosts(Posts.map(Post =>
      Post.id === id ? { ...Post, text } : Post
    ));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-md">
  <div className="flex flex-row items-center gap-4">
    <img src={backImage} alt="forum" className="h-8" />
    <p className="text-3xl">Lichess to FIDE Rating and other questions</p>
  </div>

  {Posts.map((PostItem) => (
    <Post
      key={PostItem.id}
      PostData={PostItem}
      onDelete={deletePost}
      onEdit={editPost}
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
      onClick={addPost}
    >
      Add Post
    </button>
  </div>
</div>

  );
};


