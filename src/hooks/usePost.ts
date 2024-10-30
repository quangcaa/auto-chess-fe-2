import { useState } from "react";
import api from "../lib/axios";

type Post = {
    post_id: number;
    username: string;
    content: string;
    created_at: string;
};

const usePost = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Get Postlist
  const getPosts = async (category_id: string, topic_id: string) => {
    setLoading(true);
    try {
      const response = await api.get(`http://localhost:3333/forum/${category_id}/${topic_id}`);
      setPosts(response.data.posts);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  // Create post
  const createPost = async (category_id: string, topic_id: string, message: string) => {
    setLoading(true);
    try {
      const response = await api.post(
        `http://localhost:3333/forum/${category_id}/${topic_id}/create`,
        { message }
      );

      if (response.data.success) {
        setPosts((prevPosts) => [...prevPosts, {...response.data.post, username: localStorage.getItem('username') as string}]);
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
      const response = await api.delete(`http://localhost:3333/forum/p/${post_id}`);

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
