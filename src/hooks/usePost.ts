import { useState } from "react";
import axios from "axios";

type Post = {
    post_id: number;
    username: string;
    content: string;
    timestamp: string;
};

const usePost = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Get Postlist
  const getPosts = async (category_id: number, topic_id: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3333/forum/${category_id}/${topic_id}`);
      setPosts(response.data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  // Create post
  const createPost = async (category_id: number, topic_id: number, message: string) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:3333/forum/${category_id}/${topic_id}/create`,
        { message }
      );

      if (response.data.success) {
        setPosts((prevPosts) => [...prevPosts, response.data.post]);
      } else {
        setError(new Error(response.data.message));
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  // Delete post
  const deletePost = async (post_id: number) => {
    setLoading(true);
    try {
      const response = await axios.delete(`http://localhost:3333/forum/p/${post_id}`);

      if (response.data.success) {
        setPosts((prevPosts) => prevPosts.filter((post) => post.post_id !== post_id));
      } else {
        setError(new Error(response.data.message));
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return {
    posts,
    error,
    loading,
    getPosts,
    createPost,
    deletePost,
  };
};

export default usePost;
