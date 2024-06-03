import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileInfo from "../cards/ProfileInfo";
import SearchBar from "../searchbar/SearchBar";
import debounce from "lodash.debounce";

const Navbar = ({ userInfo, onSearchNotes }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNotes && onSearchNotes(searchQuery);
    }
  };

  const debounced = useCallback(
    debounce(() => onSearchNotes(searchQuery), 1000, { trailing: true }),
    [onSearchNotes, searchQuery]
  );

  useEffect(() => {
    if (!searchQuery) {
      onSearchNotes && onSearchNotes("");
    }
  }, [searchQuery]);

  const onClearSearch = () => {
    setSearchQuery("");
  };

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
      <h2 className="text-xl font-medium text-black py-2">Notes</h2>
      <SearchBar
        value={searchQuery}
        onChange={({ target }) => {
          setSearchQuery(target.value);
          debounced();
        }}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />
      <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
    </div>
  );
};

export default Navbar;
