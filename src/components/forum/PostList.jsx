import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "@/utils/axios";
import { calculateTimeDifferences } from "@/utils/timeUtils";
import { Post } from "./Post";
import { IoArrowBackOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

export const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

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
      toast.error(error.response.data.message || "Something went wrong", {
        id: toast_id,
      });
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (post_id) => {
    setLoading(true);
    try {
      const response = await api.delete(`/forum/p/${post_id}`);

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
    <div className="flex flex-col items-center overflow-auto py-2">
      <Card className="border border-gray-300 rounded-lg bg-white w-full max-w-screen-xl lg:w-[70%] h-full mb-4 shadow-lg">
        {/* HEADER */}
        <CardHeader className="flex flex-row items-center gap-4 m-7 ml-10 py-4 px-0">
          <IoArrowBackOutline
            className="size-20 text-gray-700 cursor-pointer hover:text-emerald-600"
            onClick={() => navigate(-1)}
          />
          <CardTitle className="text-5xl text-gray-700">
            {subjectTopic}
          </CardTitle>
        </CardHeader>

        <CardContent className="w-full pb-0">
          {posts.map((post, index) => (
            <Post
              key={post.post_id}
              post={{
                id: post.post_id,
                user_id: post.user_id,
                username: post.username,
                text: post.content,
                created_at: timeStrings[index],
                index: index + 1,
              }}
              onDelete={() => deletePost(post.post_id)}
            />
          ))}
        </CardContent>

        <CardFooter className="w-full p-3 pt-0 flex flex-col">
          <div className="mx-8 mb-8">
            <Separator />
            <p className="text-gray-700 text-3xl font-semibold mt-6 mb-3">
              Reply to this topic
            </p>
            <Textarea
              className="h-[200px] bg-gray-100 border-gray-300"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            <div className="flex justify-end mt-3">
              <Button
                variant="default"
                size="lg"
                className="bg-emerald-600 text-white text-[15px] hover:bg-emerald-800 shadow-lg"
                onClick={handleAddPost}
              >
                REPLY
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
