import React, { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import api from "../../utils/axios";
import backImage from "/back.jpg";
import { calculateTimeDifferences } from "../../utils/timeUtils";

export const TopicList = () => {
  const location = useLocation();
  const { category_id } = useParams();
  const category_name = location.state;
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
      const fetchTopics = async () => {
          try {
              setLoading(true);
              const response = await api.get(`http://localhost:3333/forum/${category_id}`);
              const data = await response.data;
              console.log(data)
              setTopics(data.topics);
          } catch (err) {
              setError(err.message);
          } finally {
              setLoading(false);
          }
      };

      if (category_id) {
          fetchTopics();
      }
  }, [category_id]);

  const [timeStrings, setTimeStrings] = useState([]);

  useEffect(() => {
    const formattedTimes = calculateTimeDifferences(topics, 'last_post_time');
    setTimeStrings(formattedTimes);
  }, [topics]);
    
  return (
    <div className="flex flex-col items-center">
      <div className="border rounded-md bg-white w-7/8 m-4 shadow-md">
        <div className="flex flex-row justify-between items-center m-7 py-4 min-h-[80px]">
          <div className="flex flex-row items-center gap-4">
            <img
              src={backImage}
              alt="forum"
              className="h-8"
              onClick={() => navigate(`/forum`)}
            />
            <p className="text-3xl font-sans text-[#4D4D4D]">{category_name}</p>
          </div>
          <button>
            <Link
              to={`/forum/${category_id}/create-topic`}
              state={{ category_name }}
            >
              <p className="text-green-500 font-bold">CREATE A NEW TOPIC</p>
            </Link>
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-[#EDEBE9] border-b border-gray-300 font-sans">
              <td></td>
              <td>
                <p className="text-gray-500 text-lg">Replies</p>
              </td>
              <td>
                <p className="text-gray-500 text-lg">Last Post</p>
              </td>
            </tr>
          </thead>
          <tbody>
            {topics.map((topic, index) => (
              <tr
                key={topic.topic_id}
                className={
                  "hover:bg-gray-100 transition-colors" +
                  (index % 2 !== 0 ? " bg-[#EDEBE9]" : "")
                }
              >
                <Link
                  to={`/forum/${category_id}/${topic.topic_id}`}
                  state={topic.subject}
                >
                  <td className="py-4">
                  <p className="mx-10 text-lg text-blue-500">{topic.subject}</p>
                </td>
                </Link>
                <td className="py-4">
                  <p className="mr-5">{topic.replies}</p>
                </td>
                <td className="flex flex-col items-start gap-1 justify-center py-4">
                  <p className="text-blue-500">{timeStrings[index]}</p>
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