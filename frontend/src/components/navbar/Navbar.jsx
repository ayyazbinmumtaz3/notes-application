import debounce from "lodash.debounce";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileInfo from "../cards/ProfileInfo";
import SearchBar from "../searchbar/SearchBar";

const Navbar = ({ userInfo, onSearchNotes }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const prevSearchQueryRef = useRef(searchQuery);

  // Create a debounced function
  const debouncedSearch = useCallback(
    debounce(
      (query) => {
        if (query !== prevSearchQueryRef.current) {
          console.log("Debounced search for:", query);
          onSearchNotes(query);
          prevSearchQueryRef.current = query;
        }
      },
      1000,
      { trailing: true }
    ),
    [onSearchNotes]
  );

  useEffect(() => {
    if (searchQuery !== prevSearchQueryRef.current) {
      debouncedSearch(searchQuery);
    }
    // Clean up debounce on unmount
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, debouncedSearch]);

  const onClearSearch = () => {
    setSearchQuery("");
  };

  const onLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="relative bg-white flex items-center justify-between px-6 py-2 drop-shadow z-10">
      <h2 className="text-xl font-medium text-black py-2">Notes</h2>
      <SearchBar
        value={searchQuery}
        onChange={({ target }) => {
          setSearchQuery(target.value);
        }}
        handleSearch={() => {
          debouncedSearch(searchQuery);
        }}
        onClearSearch={onClearSearch}
      />
      <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
    </div>
  );
};

export default Navbar;
