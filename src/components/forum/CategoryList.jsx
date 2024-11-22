import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../utils/axios";

import { MdOutlineForum } from "react-icons/md";

export const CategoryList = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/forum");
        const data = await response.data;
        setCategories(data.forum);
      } catch (error) {
        toast.error(error.response.data.message || "Something went wrong");
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="flex flex-col items-center overflow-auto py-2">
      <div className="border border-gray-300 rounded-lg bg-white w-full max-w-screen-xl lg:w-[70%] h-full mb-4 shadow-lg">
        {/* HEADER */}
        <div className="flex flex-row items-center gap-4 m-7 ml-10 py-4">
          {/* FORUM ICON */}
          <MdOutlineForum className="size-20 text-gray-800" />
          <p className="text-5xl font-base text-gray-800">Autochess Forum</p>
        </div>

        {/* CONTENT */}
        <table className="w-full">
          <thead>
            <tr className="bg-[#E9E9E9] border-y border-gray-300">
              <td></td>
              <td>
                <p className="text-gray-800 text-lg text-right mr-4">Topics</p>
              </td>
              <td>
                <p className="text-gray-800 text-lg text-left">Posts</p>
              </td>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr
                key={category.category_id}
                className={
                  "hover:bg-gray-200 transition-colors h-16 border-y border-gray-300"
                }
              >
                <Link
                  to={`/forum/${category.category_id}`}
                  state={category.category_name}
                >
                  <td className="flex flex-col items-start gap-1 justify-center mx-10 my-5">
                    <p className="text-3xl text-emerald-600">
                      {category.category_name}
                    </p>
                    <p>{category.category_description}</p>
                  </td>
                </Link>
                <td className="text-right">
                  <p className="mr-4">{category.topic_count}</p>
                </td>
                <td className="text-left">
                  <p>{category.post_count}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
