import { MagnifyingGlass } from "@phosphor-icons/react";
import { useEffect } from "react";
import axios from "../../axios";
import { useDispatch, useSelector } from "react-redux";
import { openSearch, setSearchInput } from "../../redux/slices/app";

function Search({ setSearchResults }) {
  const { searchInput } = useSelector((state) => state.app);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    async function searchUser() {
      const res = await axios.get(`/users?query=${searchInput}`, { signal });
      dispatch(openSearch(true));
      res.data.users = res.data.users.filter((u) => u._id !== user._id);
      setSearchResults(res.data.users);
    }

    if (searchInput?.length > 2) {
      searchUser();
    } else {
      setSearchResults([]);
      dispatch(openSearch(false));
    }

    return () => {
      controller.abort();
    };
  }, [searchInput]);

  return (
    <div className="p-2">
      <label
        htmlFor="search"
        className="input input-sm input-bordered flex items-center gap-2 rounded border-b-2 focus-within:border-b-whatsapp-green focus-within:outline-none focus:outline-none"
      >
        <MagnifyingGlass
          size={13}
          color="gray"
          mirrored
          weight="light"
          style={{
            fontSmooth: "antialiased",
            WebkitFontSmoothing: "antialiased",
          }}
        />
        <input
          type="text"
          id="search"
          placeholder="Search"
          value={searchInput}
          onChange={(e) => dispatch(setSearchInput(e.target.value))}
          className="input flex-1 border-0 px-0 text-sm placeholder-opacity-50 focus-within:!outline-none focus:!outline-none focus:!outline-0"
        />
      </label>
    </div>
  );
}

export default Search;
