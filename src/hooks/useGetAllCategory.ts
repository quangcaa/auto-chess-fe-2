import { useState, useEffect } from 'react';
import api from '../lib/axios';

const useGetAllCategory = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await api.get('http://localhost:3333/forum')
                const data = await response.data;
                console.log(data)
                setCategories(data.forum);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return { categories, loading, error };
};

export default useGetAllCategory;
