import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetUsernameSuggestionsQuery } from "../../../app/UserApiSLice";
import useDebounce from "../../../hooks/useDebounce";

const SearchPage = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const debouncedSearch = useDebounce(search, 400);

  const {
    data,
    isFetching,
    isError,
  } = useGetUsernameSuggestionsQuery(debouncedSearch, {
    skip: debouncedSearch.trim().length < 2,
  });

  const suggestions = data?.suggestions || [];

  const showSuggestions =
    debouncedSearch.trim().length >= 2 && suggestions.length > 0;

  return (
    <div className="min-h-screen bg-base-100 flex justify-center pt-10">
      <div className="w-full max-w-md px-4">
        <h1 className="text-xl font-semibold text-center mb-4">
          Search
        </h1>

        {/* Search input */}
        <input
          type="text"
          placeholder="Search"
          className="input input-bordered w-full rounded-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Loading */}
        {isFetching && search.trim().length >= 2 && (
          <div className="mt-3 text-sm text-gray-500 text-center">
            Searching...
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="mt-3 text-error text-sm text-center">
            Something went wrong
          </div>
        )}

        {/* Suggestions (ONLY when search is not empty) */}
        {showSuggestions && (
          <div className="mt-4 bg-base-200 rounded-xl my-auto shadow divide-y">
            {suggestions.map((user) => {
              const initials = user.username
                ? user.username.slice(0, 1).toUpperCase()
                : "??";

              return (
                <div
                  key={user.userId}
                  className="flex items-center gap-3 p-3  cursor-pointer hover:bg-base-300 transition"
                  onClick={() =>
                    navigate(`/profile/${user.userId}`)
                  }
                >
                  {/* Avatar with initials */}
                  <div className="avatar ">
                    <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center font-semibold">
                     <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              user?.name
            )}&background=random`}
            alt={user?.name}
            className="w-full h-full object-cover"
          />
                    </div>
                  </div>

                  {/* Username + Name */}
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">
                      @{user.username}
                    </span>

                    {user.name && (
                      <span className="text-xs text-gray-500">
                        {user.name}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty result */}
        {debouncedSearch.trim().length >= 2 &&
          !isFetching &&
          suggestions.length === 0 && (
            <p className="mt-4 text-sm text-center text-gray-500">
              No users found
            </p>
          )}
      </div>
    </div>
  );
};

export default SearchPage;
