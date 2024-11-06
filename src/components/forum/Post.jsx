export const Post = ({ post, onDelete }) => {
  return (
    <div className="border-b border-gray-300 py-4">
      <p className="font-bold">
        {post.username} -{" "}
        <span className="text-gray-500">{post.created_at}</span>
      </p>
      <p className="mt-2">{post.text}</p>
      <button className="text-red-500 mt-2" onClick={() => onDelete(post.id)}>
        Delete
      </button>
    </div>
  );
};
