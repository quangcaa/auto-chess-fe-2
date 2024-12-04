import { RiSwordFill } from "react-icons/ri";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "@/utils/axios";

export const ViewChallengeButton = () => {
  const [challengeList, setChallengeList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchChallenges = async () => {
        setLoading(true);
        try {
          const response = await api.get("/challenge/");
          console.log(response.data);
          if (response.data.success) {
            setChallengeList(response.data.data);
          } else {
            toast.error("Failed to load challenges.");
          }
        } catch (error) {
          toast.error(error.response?.data?.message || "Error fetching challenges.");
        } finally {
          setLoading(false);
        }
      };

      fetchChallenges();
    }
  }, [isOpen]);

  const toggleChallenge = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="relative">
      {/* Icon Trigger */}
      <div
        className="flex items-center justify-center h-full cursor-pointer hover:text-emerald-600"
        onClick={toggleChallenge}
      >
        <RiSwordFill className="size-6 ml-2 mr-2" />
      </div>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-80 bg-white border rounded-md shadow-lg p-4 z-50">
          <h3 className="text-lg font-bold mb-3">Challenges</h3>
          {loading ? (
            <p>Loading...</p>
          ) : challengeList.length > 0 ? (
            <ul>
              {challengeList.map((challenge) => (
                <li
                  key={challenge.challenge_id}
                  className="mb-2 p-2 bg-gray-100 rounded-md shadow-sm"
                >
                  <p>
                    <strong>From:</strong> {challenge.sender_id}
                  </p>
                  <p>
                    <strong>Status:</strong> {challenge.status}
                  </p>
                  <p>
                    <strong>Created:</strong>{" "}
                    {new Date(challenge.created_at).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No challenges available.</p>
          )}
        </div>
      )}
    </div>

  );
};
