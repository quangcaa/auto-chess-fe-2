import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";
import api from "../../utils/axios";
import toast from "react-hot-toast";

export const CreateTopic = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const category_name = location.state.category_name;
  const { category_id } = useParams();

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const createTopic = async (category_id, subject, message) => {
    setLoading(true);
    setSuccess(false);

    try {
      const response = await api.post(`/forum/${category_id}/create`, {
        subject,
        message,
      });
      const data = await response.data;
      setSuccess(true);
      return data;
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createTopic(category_id, subject, message);
  };
  useEffect(() => {
    if (success) {
      navigate(`/forum/${category_id}`, { state: category_name });
    }
  }, [success, navigate, category_id, category_name]);

  return (
    <div className="flex flex-col items-center h-screen">
      <div className="bg-white p-4 w-1/2 ">
        <div className="flex flex-row items-center gap-4 m-5">
          <IoArrowBackOutline
            className="size-20 text-gray-700 ml-1"
            onClick={() => navigate(-1)}
          />
          <p className="text-4xl font-sans font-base text-[#4D4D4D] mb-2">{category_name}</p>
        </div>
        <form className="m-5 space-y-4" onSubmit={handleSubmit}>
          <p className="font-bold text-sm">Subject</p>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="bg-gray-100 border-none rounded-md h-8 p-2 w-full"
          />
          <p className="font-bold text-sm">Message</p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="bg-gray-100 border-none rounded-md h-32 p-2 w-full"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white text-sm font-bold rounded-md py-2 px-4"
              disabled={loading}
            >
              {loading ? "CREATING..." : "CREATE THE TOPIC"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
