import { FaCircle } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";

export const Post = ({ post, onDelete, index }) => {
  return (
    <div className="relative mx-8 group">
      <Separator className="w-full" />
      <div className="flex flex-row justify-between items-center my-2">
        <div className="flex items-center">
          <FaCircle className="text-green-500 size-4" />

          <p className="font-semibold text-xl text-gray-600 mx-3">
            {post.username}
          </p>

          <p className="text-sm text-emerald-600">{post.created_at}</p>

          <FaTrash
            className="mx-2 size-5 text-red-600 hover:cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={() => onDelete(post.id)}
          />
        </div>

        <p className="text-emerald-600 text-base font-bold">#{post.index}</p>
      </div>

      <p className="text-gray-800 mt-2 mb-4 leading-relaxed text-lg break-words">
        {post.text}
      </p>
    </div>
  );
};
