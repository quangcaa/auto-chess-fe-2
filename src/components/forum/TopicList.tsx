import React, { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import useGetTopics from "../../hooks/useGetTopics";


export const TopicList = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const category_name = location.state;
  const navigate = useNavigate();
  const { topics, loading, err } = useGetTopics(categoryId);
  const [timeStrings, setTimeStrings] = useState<string[]>([]);

  useEffect(() => {
    const calculateTimeDifferences = () => {
      const currentTime = new Date();
      const formattedTimes = topics.map(({ last_post_time }) => {
        const apiDate = new Date(last_post_time);
        const timeDifference = currentTime.getTime() - apiDate.getTime();
        const seconds = Math.floor(timeDifference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);

        let formattedTime;

        if (timeDifference < 3600000) {
          // < 1 hours
          formattedTime = `${minutes} minutes ago`;
        } else if (timeDifference < 86400000) {
          // < 1 day
          formattedTime = `${hours} hours ago`;
        } else if (timeDifference < 2592000000) {
          // < 1 month
          formattedTime =` ${days} days ago`;
        } else {
          // >1 month
          const day = apiDate.getUTCDate();
          const month = apiDate.getUTCMonth() + 1;
          const year = apiDate.getUTCFullYear();
          formattedTime =` ${year}/${month}/${day}`; // yyyy/mm/dd
        }

        return formattedTime;
      });

      setTimeStrings(formattedTimes);
    };

    calculateTimeDifferences();
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
              onClick={() => navigate(-1)}
            />
            <p className="text-3xl font-sans text-[#4D4D4D]">{category_name}</p>
          </div>
          <button>
            <Link
              to={`/forum/category/create-topic?categoryId=${categoryId}`}
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
                <td className="py-4">
                  <p className="mx-10 text-lg text-blue-500">{topic.subject}</p>
                </td>
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
