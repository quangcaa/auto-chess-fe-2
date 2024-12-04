import { useSearchParams } from "react-router-dom";
import { FaCircle } from "react-icons/fa";
import { SelectReport } from "@/components/report/SelectReport";
import api from "@/utils/axios";
import { useState } from "react";

export const Report = () => {
  const [searchParams] = useSearchParams();
  const username = searchParams.get("username");

  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleReport = async () => {
    setLoading(true);
    try {
      const response = await api.post(`/@/${username}/report`, { reason, description });
      if (response.data.success) {
        alert("Report submitted successfully!");
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center items-center pt-2">
      <div className="flex flex-col w-[70%] bg-white mx-auto overflow-hidden rounded-lg border border-gray-300 shadow-lg mb-8 px-12 py-8 space-y-10">
        <h1 className="text-3xl">Report a user</h1>
        <div className="flex items-center space-x-2">
          <b>User</b>
          <a href={`/@/${username}`} className="flex items-center space-x-2">
            <FaCircle className="text-lime-600 size-3 text-sm" />
            <p>{username}</p>
          </a>
        </div>
        <div className="space-y-2">
          <b>Reason</b>
          <SelectReport onChange={(value) => setReason(value)} />
        </div>
        <div>
          <b>Description</b>
          <textarea
            className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-lime-300"
            rows={6}
            placeholder="Provide additional details about your report..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <p className="text-slate-800 text-xs">
            Paste a link to the game(s) and explain what is wrong with this user's behavior. Don't just say "they cheat," but
            tell us how you came to this conclusion. Your report will be processed faster if written in English. Maximum
            3000 characters.
          </p>
        </div>
        <hr className="border-t border-gray-300 my-6" />
        <div className="flex items-center">
          <a href="" className="text-blue-600">
            Cancel
          </a>
          <button
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition ml-auto"
            onClick={handleReport}
            disabled={loading}
          >
            {loading ? "Submitting..." : "SEND"}
          </button>
        </div>
      </div>
    </div>
  );
};
