import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "@/utils/axios";
import { calculateTimeDifferences } from "@/utils/timeUtils";
import { IoArrowBackOutline } from "react-icons/io5";
import { FaPen, FaTrash } from "react-icons/fa";

export const TopicList = () => {
  const user_id = localStorage.getItem("user_id");
  const location = useLocation();
  const { category_id } = useParams();
  const category_name = location.state;
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await api.get(`/forum/${category_id}`);
        const data = await response.data;
        setTopics(data.topics);
      } catch (error) {
        toast.error(error.response.data.message || "Something went wrong");
      }
    };

    if (category_id) {
      fetchTopics();
    }
  }, [category_id]);

  const [timeStrings, setTimeStrings] = useState([]);

  useEffect(() => {
    const formattedTimes = calculateTimeDifferences(topics, "last_post_time");
    setTimeStrings(formattedTimes);
  }, [topics]);

  const deleteTopic = async (topic_id) => {
    try {
      const response = await api.delete(`/forum/t/${topic_id}`);

      if (response.data.success) {
        setTopics((prev) => prev.filter((item) => item.topic_id !== topic_id));
      } else {
        toast.error(new Error(response.data.message));
      }
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    }
  };

  return (
    <div className="flex flex-col items-center overflow-auto py-2">
      <div className="border border-gray-300 rounded-lg bg-white w-full max-w-screen-xl lg:w-[70%] h-full mb-4 shadow-lg">
        {/* HEADER */}
        <div className="flex flex-row justify-between m-7 ml-10 py-4">
          <div className="flex flex-row items-center gap-4">
            <IoArrowBackOutline
              className="size-20 text-gray-700 cursor-pointer hover:text-emerald-600"
              onClick={() => navigate("/forum")}
            />
            <p className="text-5xl font-base text-gray-700">{category_name}</p>
          </div>
          <button>
            <Link
              to={`/forum/${category_id}/create-topic`}
              state={{ category_name }}
            >
              <div className="flex items-center gap-2 text-emerald-600 hover:text-emerald-800">
                <FaPen className="" />
                <p className=" font-bold mr-4">CREATE A NEW TOPIC</p>
              </div>
            </Link>
          </button>
        </div>

        {/* CONTENT */}
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-[#E9E9E9] border-y border-gray-300">
              <td></td>
              <td>
                <p className="text-gray-700 text-lg text-right mr-8">Replies</p>
              </td>
              <td>
                <p className="text-gray-700 text-lg">Last Post</p>
              </td>
            </tr>
          </thead>
          <tbody>
            {topics.map((topic, index) => (
              <tr
                key={topic.topic_id}
                className="hover:bg-gray-200 transition-colors border-y border-gray-300"
              >
                <td className="py-4">
                  <div className=" group flex flex-row items-center justify-between">
                    <Link
                      to={`/forum/${category_id}/${topic.topic_id}`}
                      state={topic.subject}
                    >
                      <p className="mx-10 text-lg text-emerald-600">
                        {topic.subject}
                      </p>
                    </Link>
                    {user_id === String(topic.creator) && (
                      <FaTrash
                        className="mx-2 size-5 text-red-600 hover:cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        onClick={() => deleteTopic(topic.topic_id)}
                      />
                    )}
                  </div>
                </td>
                <td className="py-4">
                  <p className="text-right mr-8">{topic.replies}</p>
                </td>
                <td className="flex flex-col items-start gap-1 justify-center py-3">
                  <p className="text-emerald-600">{timeStrings[index]}</p>
                  <p>by {topic.last_post_user}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
