import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileInfo from "../cards/ProfileInfo";
import SearchBar from "../searchbar/SearchBar";
import debounce from "lodash.debounce";

const Navbar = ({ userInfo, onSearchNotes }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Create a debounced function
  const debouncedSearch = useCallback(
    debounce(
      (query) => {
        console.log("Debounced search for:", query); // Debugging line
        onSearchNotes(query);
      },
      1000,
      { trailing: true }
    ),
    [onSearchNotes]
  );

  // useEffect(() => {
  //   if (searchQuery) {
  //     debouncedSearch(searchQuery);
  //   } else {
  //     // Handle empty search query
  //     onSearchNotes && onSearchNotes("");
  //   }
  // Clean up debounce on unmount
  //   return () => {
  //     debouncedSearch.cancel();
  //   };
  // }, [searchQuery, debouncedSearch, onSearchNotes]);

  const onClearSearch = () => {
    setSearchQuery("");
  };

  const onLogout = () => {
    localStorage.clear();
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
          debouncedSearch(searchQuery); // Ensure manual search still works
        }}
        onClearSearch={onClearSearch}
      />
      <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
    </div>
  );
};

export default Navbar;
