import React from "react";

import forumImage from "./../assets/images/forum.svg";
import useGetAllCategory from "../hooks/useGetAllCategory";
import { Link } from "react-router-dom";

export const Forum = () => {
  const { categories, loading, err } = useGetAllCategory();
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white p-4 w-3/4">
        <div className="flex flex-row items-center gap-4">
          <img src={forumImage} alt="forum" className="h-20" />
          <p className="text-3xl">AutoChess Forum</p>
        </div>
        <table className="w-full">
          <tr className="bg-gray-300">
            <td></td>
            <td>
              <p>Topic</p>
            </td>
            <td>
              <p>Posts</p>
            </td>
          </tr>
          <tbody>
            {categories.map((category, index) => (
              <tr
                key={category.category_id}
                className={index % 2 !== 0 ? "bg-gray-300" : "bg-white"}
              >
                <Link to={`/forum/category?id=${category.category_id}`}>
                <td className="flex flex-col items-start gap-1 justify-center mx-3 my-5 cursor-pointer">
                  <p className="text-3xl text-blue-500">
                    {category.category_name}
                  </p>
                  <p>{category.category_description}</p>
                </td>
                </Link>
                <td>
                  <p>{category.topic_count}</p>
                </td>
                <td>
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
