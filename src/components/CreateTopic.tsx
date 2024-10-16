import React, { useEffect, useState } from "react";
import backImage from "./../assets/images/back.png";
import { useLocation, useNavigate } from "react-router-dom";
import useCreateTopic from "../hooks/useCreateTopic";

export const CreateTopic = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const category_name = location.state.category_name
  const topicId = location.state.topicId

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  
  const { createTopic, loading, error, success } = useCreateTopic();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createTopic(topicId, subject, message);
  };
  useEffect(() => {
    if (success) {
      const randomQuery = new Date().getTime();
      navigate(`/forum/category?id=${topicId}&refresh=${randomQuery}`, { state: category_name });
    }
  }, [success, navigate, topicId, category_name]);

  return (
    <div className="flex flex-col items-center h-screen">
      <div className="bg-white p-4 w-1/2 ">
        <div className="flex flex-row items-center gap-4 m-5">
          <img src={backImage} alt="forum" className="h-8" />
          <p className="text-3xl">{category_name}</p>
        </div>
        <form className="m-5 space-y-4" onSubmit={handleSubmit}>
          <p className="font-bold text-sm">Subject</p>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="bg-gray-200 border-none rounded-md h-8 p-2 w-full"
          />
          <p className="font-bold text-sm">Message</p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="bg-gray-200 border-none rounded-md h-32 p-2 w-full"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white text-sm font-bold rounded-md py-2 px-4"
              disabled={loading}
            >
              {loading ? "Creating..." : "CREATE THE TOPIC"}
            </button>
          </div>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>
    </div>
  );
};
