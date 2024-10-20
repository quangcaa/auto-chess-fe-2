import { useEffect, useState } from "react";

const useGetTopics = (categoryId) => {
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:3333/forum/${categoryId}`, {
                    method: 'GET',
                    headers: {
                        'x_authorization': `${localStorage.getItem('accessToken')}`,
                        'Content-Type': 'application/json',
                    }
                });
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }
                const data = await response.json();
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