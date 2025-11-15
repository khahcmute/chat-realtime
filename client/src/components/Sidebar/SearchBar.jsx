import React, { useState } from "react";
import { Search, UserPlus, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api";

const SearchBar = () => {
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const data = await api.searchFriends(token, searchQuery);
      setSearchResults(data || []);
      setShowResults(true);
    } catch (err) {
      console.error("Search error:", err);
      alert("Lỗi tìm kiếm: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async (userId) => {
    try {
      await api.addFriend(token, userId);
      alert("Đã gửi lời mời kết bạn!");
      setShowResults(false);
      setSearchQuery("");
      setSearchResults([]);
    } catch (err) {
      console.error("Add friend error:", err);
      alert("Không thể gửi lời mời: " + err.message);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="p-4 border-b border-gray-200 relative">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50"
        >
          {loading ? "..." : <Search className="w-5 h-5" />}
        </button>
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute left-4 right-4 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
          <div className="flex items-center justify-between p-3 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800">Kết quả tìm kiếm</h3>
            <button
              onClick={() => {
                setShowResults(false);
                setSearchResults([]);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {searchResults.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Không tìm thấy người dùng
            </div>
          ) : (
            searchResults.map((user) => (
              <div
                key={user._id}
                className="p-3 hover:bg-gray-50 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {user.username?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{user.username}</p>
                    {user.isFriend && (
                      <p className="text-xs text-green-500">Đã là bạn bè</p>
                    )}
                  </div>
                </div>
                {!user.isFriend && (
                  <button
                    onClick={() => handleAddFriend(user._id)}
                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                    title="Thêm bạn"
                  >
                    <UserPlus className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
