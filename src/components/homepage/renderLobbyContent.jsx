export const renderLobbyContent = () => {
    // Danh sách các phòng lobby
    const lobbies = [
      { id: 1, name: "Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", players: 5, maxPlayers: 10, status: "Đang mở", rating: 1500, time: "5+0", mode: "Blitz" },
      { id: 2, name: "2", players: 3, maxPlayers: 8, status: "Đang chờ", rating: 1400, time: "3+2", mode: "Blitz" },
      { id: 3, name: "1", players: 7, maxPlayers: 10, status: "Đang chơi", rating: 1600, time: "10+0", mode: "Rapid" },
      { id: 1, name: "Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", players: 5, maxPlayers: 10, status: "Đang mở", rating: 1500, time: "5+0", mode: "Blitz" },
      { id: 2, name: "2", players: 3, maxPlayers: 8, status: "Đang chờ", rating: 1400, time: "3+2", mode: "Blitz" },
      { id: 3, name: "1", players: 7, maxPlayers: 10, status: "Đang chơi", rating: 1600, time: "10+0", mode: "Rapid" },
      { id: 1, name: "Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", players: 5, maxPlayers: 10, status: "Đang mở", rating: 1500, time: "5+0", mode: "Blitz" },
      { id: 2, name: "2", players: 3, maxPlayers: 8, status: "Đang chờ", rating: 1400, time: "3+2", mode: "Blitz" },
      { id: 3, name: "1", players: 7, maxPlayers: 10, status: "Đang chơi", rating: 1600, time: "10+0", mode: "Rapid" },
      { id: 1, name: "Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", players: 5, maxPlayers: 10, status: "Đang mở", rating: 1500, time: "5+0", mode: "Blitz" },
      { id: 2, name: "2", players: 3, maxPlayers: 8, status: "Đang chờ", rating: 1400, time: "3+2", mode: "Blitz" },
      { id: 3, name: "1", players: 7, maxPlayers: 10, status: "Đang chơi", rating: 1600, time: "10+0", mode: "Rapid" },
      { id: 1, name: "Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", players: 5, maxPlayers: 10, status: "Đang mở", rating: 1500, time: "5+0", mode: "Blitz" },
      { id: 2, name: "2", players: 3, maxPlayers: 8, status: "Đang chờ", rating: 1400, time: "3+2", mode: "Blitz" },
      { id: 3, name: "1", players: 7, maxPlayers: 10, status: "Đang chơi", rating: 1600, time: "10+0", mode: "Rapid" },
      // Thêm nhiều phòng lobby khác nếu cần
    ];
  
    return (
      <div className="w-full bg-white h-[70vh] border rounded-md">
        <div className="w-full max-h-[70vh] overflow-auto border rounded-md shadow-md">
          <table className="w-full bg-gray-800 text-white table-fixed">
            <thead className="sticky top-0 bg-gray-900 text-gray-200 shadow-md">
              <tr className="border-b border-gray-700">
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider w-1/2">Player</th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider w-1/6">Rating</th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider w-1/6">Time</th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider w-1/6">Mode</th>
              </tr>
            </thead>
            <tbody>
              {/* Duyệt qua danh sách lobby và hiển thị thông tin */}
              {lobbies.map((lobby) => (
                <tr key={lobby.id} className="border-b border-gray-700">
                  <td className="px-4 py-2">{lobby.name}</td>
                  <td className="px-4 py-2">{lobby.rating}</td>
                  <td className="px-4 py-2">{lobby.time}</td>
                  <td className="px-4 py-2">{lobby.mode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  