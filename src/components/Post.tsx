import React, { useState } from 'react';

interface PostProps {
  PostData: {
    id: number;
    username: string;
    text: string;
    timestamp: string;
  };
  onDelete: (id: number) => void;
  onEdit: (id: number, text: string) => void;
}

export const Post: React.FC<PostProps> = ({ PostData, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newPost, setNewPost] = useState(PostData.text);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onEdit(PostData.id, newPost);
    setIsEditing(false);
  };

  return (
    <div className="border-b border-gray-300 py-4">
      <p className="font-bold">{PostData.username} - <span className="text-gray-500">{PostData.timestamp}</span></p>
      {isEditing ? (
        <textarea
          className="w-full p-2 mt-2 border rounded"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
      ) : (
        <p className="mt-2">{PostData.text}</p>
      )}
      <div className="flex space-x-2 mt-2">
        <button className="text-blue-500" onClick={handleEdit}>Edit</button>
        <button className="text-red-500" onClick={() => onDelete(PostData.id)}>Delete</button>
        {isEditing && <button className="text-green-500" onClick={handleSave}>Save</button>}
      </div>
    </div>
  );
};


