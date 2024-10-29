import { useState } from "react";
import api from "../lib/axios";

const useCreateTopic = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const createTopic = async (categoryId, subject, message) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await api.post(`http://localhost:3333/forum/${categoryId}/create`, {
        subject,
          message,
      })
      const data = await response.data;
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