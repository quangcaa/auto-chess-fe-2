import { useState } from "react";

const useCreateTopic = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const createTopic = async (categoryId, subject, message) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`http://localhost:3333/forum/${categoryId}/create`, {
        method: "POST",
        headers: {
            "x_authorization": `${localStorage.getItem('accessToken')}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create topic");
      }

      const data = await response.json();
      setSuccess(true);
      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { createTopic, loading, error, success };
};

export default useCreateTopic;
