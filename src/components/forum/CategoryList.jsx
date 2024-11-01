import React from "react";
import forumImage from "/forum.svg";
import { Link } from "react-router-dom";
import api from "../../utils/axios";
import { useState, useEffect } from 'react';

export const CategoryList = () => {
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

  return (
    <div className="h-screen flex flex-col items-center">
      <div className="border rounded-md bg-white w-7/8 m-4 shadow-md">
        <div className="flex flex-row justify-between items-center m-7 py-4 min-h-[80px]">
          <div className="flex flex-row items-center gap-4">
            <img src={forumImage} alt="forum" className="h-20" />
            <p className="text-3xl font-sans text-[#4D4D4D]">AutoChess Forum</p>
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-[#EDEBE9] border-b border-gray-300 font-sans">
              <td></td>
              <td>
                <p className="text-gray-500 text-lg">Topic</p>
              </td>
              <td>
                <p className="text-gray-500 text-lg">Posts</p>
              </td>
              {/* <td>
                <p className="text-gray-500 text-lg">Last Post</p>
              </td> */}
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr
                key={category.category_id}
                className={
                  "hover:bg-gray-100 transition-colors h-16" +
                  (index % 2 !== 0 ? " bg-[#EDEBE9]" : "")
                }
              >
                <Link
                  to={`/forum/category?categoryId=${category.category_id}`}
                  state={category.category_name}
                >
                  <td className="flex flex-col items-start gap-1 justify-center mx-10 my-5">
                    {" "}
                    {/* Tăng khoảng cách bên trái */}
                    <p className="text-3xl text-blue-500">
                      {category.category_name}
                    </p>
                    <p>{category.category_description}</p>
                  </td>
                </Link>
                <td>
                  <p>{category.post_count}</p>
                </td>
                <td>
                  <p>{category.topic_count}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};