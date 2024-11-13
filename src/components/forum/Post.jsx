export const Post = ({ post, onDelete,index}) => {
  return (
    <div className="relative mx-7 py-3  pb-14 border-b-2 group">
      <div className="flex flex-row justify-between items-center">
      <div className="flex items-center">
        {/* Green circle in front of the username */}
        <span className="w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full mx-2"></span>
        
        <p className="font-semibold text-xl text-[#787878]">
          {post.username} 
        </p>  
        <span className="px-2 text-sm text-[#1b78d0] hover:cursor-pointer">{post.created_at}</span>
        <div className="h-5 w-5 hover:cursor-pointer hover:shadow-sm">
        <img src="/deleteInbox.png" onClick={() => onDelete(post.id)} className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:cursor-pointer" />
        </div>
      
      </div>
      <p className="text-[#428FD8] text-sm">#{post.index}</p>
      </div>
      <p className="text-[#4D4D4D] mt-3 px-2 leading-relaxed text-lg break-words">{post.text}</p>
      
    </div>
  );
};
