import React, { useEffect, useState } from "react";
import backImage from "./../assets/images/back.png";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import useGetTopics from "../hooks/useGetTopics";

export const TopicList = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const topicId = searchParams.get("id")
  const category_name = location.state
  const navigate = useNavigate();
  const { topics, loading, err } = useGetTopics(topicId);
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
          formattedTime = `${days} days ago`;
        } else {
          // >1 month
          const day = apiDate.getUTCDate();
          const month = apiDate.getUTCMonth() + 1;
          const year = apiDate.getUTCFullYear();
          formattedTime = `${year}/${month}/${day}`; // yyyy/mm/dd
        }

        return formattedTime;
      });

      setTimeStrings(formattedTimes);
    };

    calculateTimeDifferences();
  }, [topics]);
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white p-4 w-3/4 ">
        <div className="flex flex-row justify-between items-center m-7">
          <div className="flex flex-row items-center gap-4">
            <img
              src={backImage}
              alt="forum"
              className="h-8"
              onClick={() => navigate(-1)}
            />
            <p className="text-3xl">{category_name}</p>
          </div>
          <button>
            <Link to={"/forum/category/create-topic"} state={{ category_name, topicId }}>
            <p className="text-green-500 font-bold">CREATE A NEW TOPIC</p>
            </Link>
          </button>
        </div>
        <table className="w-full">
          <tr className="bg-gray-300">
            <td></td>
            <td>
              <p>Replies</p>
            </td>
            <td>
              <p>Last Post</p>
            </td>
          </tr>
          <tbody>
            {topics.map((topic, index) => (
              <tr
                key={topic.topic_id}
                className={index % 2 !== 0 ? "bg-gray-300" : "bg-white"}
              >
                <td className="my-5">
                  <p className=" mx-10 text-xl text-blue-500">
                    {topic.subject}
                  </p>
                </td>
                <td>
                  <p className="mr-5">{topic.replies}</p>
                </td>
                <td className="flex flex-col items-start gap-1 justify-center my-5">
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
