import SimpleBar from "simplebar-react";
import SearchElement from "./searchElement";

export default function SearchList({ searchResults }) {
  return (
    <div>
      <>
        <SimpleBar
          style={{
            maxHeight: "calc(100vh - 9.1rem)",
            scrollbarWidth: "thin",
            paddingRight: "8px",
          }}
        >
          {/* To add a new group */}

          <p className="text-gray-500 text-sm font-semibold p-2">Users</p>
          {searchResults.map((user) => (
            <SearchElement key={user._id} user={user} />
          ))}
        </SimpleBar>
      </>
    </div>
  );
}
