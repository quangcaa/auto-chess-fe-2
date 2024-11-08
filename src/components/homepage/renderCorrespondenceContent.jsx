export const renderCorrespondenceContent = () => {
    // Danh sách các thư tín, bạn có thể thêm các đối tượng vào mảng này để hiển thị trong bảng
    const correspondences = [
      // Ví dụ về các thư tín, mỗi đối tượng có các trường tương tự như phòng lobby
      // { id: 1, name: "Player 1", rating: 1500, time: "5+0", mode: "Blitz" },
      // { id: 2, name: "Player 2", rating: 1400, time: "3+2", mode: "Rapid" },
    ];
  
    return (
      <div className="w-full bg-white h-[70vh] border rounded-md shadow-md">
        <div className="overflow-auto w-full max-h-[70vh]  border rounded-md">
          <table className="w-full bg-gray-800 text-white table-fixed">
            <thead className="sticky top-0 bg-gray-900 text-gray-200 shadow-md">
              <tr className="border-b border-gray-700">
                {/* Các cột trong bảng */}
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider w-1/2">Player</th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider w-1/6">Rating</th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider w-1/6">Time</th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider w-1/6">Mode</th>
              </tr>
            </thead>
            <tbody>
              {/* Duyệt qua các thư tín và hiển thị thông tin */}
              {correspondences.map((correspondence) => (
                <tr key={correspondence.id} className="border-b border-gray-700">
                  {/* Các giá trị trong mỗi thư tín */}
                  <td className="px-4 py-2">{correspondence.name}</td>
                  <td className="px-4 py-2">{correspondence.rating}</td>
                  <td className="px-4 py-2">{correspondence.time}</td>
                  <td className="px-4 py-2">{correspondence.mode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  