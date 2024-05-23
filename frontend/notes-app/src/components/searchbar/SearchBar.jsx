import { CloseIcon, MagnifyingGlass } from "../../assets/icons";
const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div className="w-80 flex items-center px-4 rounded-md bg-slate-100">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Search notes"
        className="w-full text-xs bg-transparent py-[11px] outline-none"
      />

      {value && (
        <CloseIcon
          size={20}
          className="text-lg text-slate-500 cursor-pointer hover:text-black mr-3"
          onClick={onClearSearch}
        />
      )}

      <MagnifyingGlass
        size={18}
        className="text-slate-400 cursor-pointer hover:text-black"
        onClick={handleSearch}
      />
    </div>
  );
};

export default SearchBar;
