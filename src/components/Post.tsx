import React from 'react';

const Post = ({ post }) => {
  return (
    <div className="post">
      <h3>Post ID: {post.post_id}</h3>
      <p>User ID: {post.user_id}</p>
      <p>Topic ID: {post.topic_id}</p>
      <p>Content: {post.content}</p>
      <p>Created At: {new Date(post.created_at).toLocaleString()}</p>
    </div>
  );
};

export default Post;
