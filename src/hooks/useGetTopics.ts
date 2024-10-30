import { useEffect, useState } from "react";
import api from "../lib/axios";

const useGetTopics = (categoryId) => {
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                setLoading(true);
                const response = await api.get(`http://localhost:3333/forum/${categoryId}`);
                const data = await response.data;
                console.log(data)
                setTopics(data.topics);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (categoryId) {
            fetchTopics();
        }
    }, [categoryId]);

    return { topics, loading, error };
};

export default useGetTopics;