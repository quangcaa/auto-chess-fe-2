import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { SelectReport } from "@/components/report/SelectReport";
import api from "@/utils/axios";
import toast from "react-hot-toast";

import { Textarea } from "@/components/ui/textarea";

export const Report = () => {
  const [searchParams] = useSearchParams();
  const username = searchParams.get("username");

  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleReport = async () => {
    setLoading(true);
    try {
      const response = await api.post(`/@/${username}/report`, {
        reason,
        description,
      });

      if (response.data.success) {
        toast.success("Report submitted successfully !");
        navigate(`/@/${username}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full py-2 flex justify-center items-center">
      <div className="flex flex-col w-[70%] bg-white mx-auto overflow-hidden rounded-lg border border-gray-300 shadow-lg mb-8 px-12 py-8 space-y-8">
        <h1 className="text-5xl font-base text-gray-700 mt-2">Report a user</h1>
        <div className="flex items-center space-x-1">
          <p className="font-bold text-lg text-gray-700">User: </p>
          <a href={`/@/${username}`} className="flex items-center">
            <p className="font-medium text-lg text-emerald-600 hover:text-emerald-800">{username}</p>
          </a>
        </div>
        <div>
          <p className="font-bold text-lg text-gray-700">Reason</p>
          <SelectReport onChange={(value) => setReason(value)} />
        </div>
        <div>
          <p className="font-bold text-lg text-gray-700">Description</p>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide additional details about your report..."
            className="h-[150px] text-base border-gray-300 border placeholder:font-normal placeholder:text-gray-700"
          />
          <p className="text-slate-700 text-xs">
            Paste a link to the game(s) and explain what is wrong with this
            user&apos;s behavior. Don&apos;t just say &quot;they cheat&quot;, but tell us how you
            came to this conclusion. Your report will be processed faster if
            written in English. Maximum 3000 characters.
          </p>
        </div>
        <hr className="border-t border-gray-300 my-6" />
        <div className="flex items-center">
          <a href="" className="text-lg text-emerald-600 hover:text-emerald-800">
            Cancel
          </a>
          <button
            className="px-4 py-2 text-lg border border-emerald-600 text-emerald-600 rounded hover:bg-emerald-600 hover:text-white transition ml-auto"
            onClick={handleReport}
            disabled={loading}
          >
            {loading ? "SENDING..." : "SEND"}
          </button>
        </div>
      </div>
    </div>
  );
};
