import { useEffect, useState } from "react";
import { Post } from "./Post";
import backImage from "/back.jpg";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { calculateTimeDifferences } from "../../utils/timeUtils";
import api from "../../utils/axios";
import toast from "react-hot-toast";

export const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get Postlist
  const getPosts = async (category_id, topic_id) => {
    setLoading(true);
    try {
      const response = await api.get(`forum/${category_id}/${topic_id}`);
      const data = await response.data;
      setPosts(data.posts);
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Create post
  const createPost = async (category_id, topic_id, message) => {
    setLoading(true);
    const toast_id = toast.loading("Creating post...");
    try {
      const response = await api.post(
        `/forum/${category_id}/${topic_id}/create`,
        { message }
      );

      if (response.data.success) {
        setPosts((prevPosts) => [
          ...prevPosts,
          { ...response.data.post, username: localStorage.getItem("username") },
        ]);
        toast.success("Post created successfully", { id: toast_id });
      } else {
        toast.error(new Error(response.data.message), { id: toast_id });
      }
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong", { id: toast_id });
    } finally {
      setLoading(false);
    }
  };

  // Delete post
  const deletePost = async (post_id) => {
    setLoading(true);
    try {
      const response = await api.delete(
        `http://localhost:3333/forum/p/${post_id}`
      );

      if (response.data.success) {
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post.post_id !== post_id)
        );
      } else {
        toast.error(new Error(response.data.message));
      }
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();
  const location = useLocation();
  const [newPost, setNewPost] = useState("");
  const { category_id, topic_id } = useParams();
  const subjectTopic = location.state;
  const [timeStrings, setTimeStrings] = useState([]);

  useEffect(() => {
    getPosts(category_id, topic_id);
  }, [category_id, topic_id]);

  useEffect(() => {
    const formattedTimes = calculateTimeDifferences(posts, "created_at");
    setTimeStrings(formattedTimes);
  }, [posts]);

  const handleAddPost = () => {
    if (newPost.trim()) {
      createPost(category_id, topic_id, newPost);
      setNewPost("");
    }
  };

  return (
    <div className="w-[60%] mx-auto px-4 bg-white rounded-lg shadow-md">
      <div className="flex flex-row items-center justify-start gap-7 py-10 mx-5 border-b-2 sticky Roboto text-[#4D4D4D]">
        <img
          src={backImage}
          alt="forum"
          className="h-8 hover:cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <p className="text-3xl">{subjectTopic}</p>
      </div>

      {loading && <p>Loading...</p>}

      {posts.map((post, index) => (
        <Post
          key={post.post_id}
          post={{
            id: post.post_id,
            username: post.username,
            text: post.content,
            created_at: timeStrings[index],
            index: index + 1,
          }}
          onDelete={() => deletePost(post.post_id)}
        />
      ))}

<div className="mt-6 p-4">
        <textarea
          className="w-full h-[200px] p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
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
