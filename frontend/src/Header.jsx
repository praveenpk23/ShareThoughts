// import { Link, useNavigate } from "react-router-dom";
// import {
//   useGetUserProfileQuery,
//   useLogoutMutation,
//   userApiSlice,
// } from "./app/UserApiSLice";
// import { useDispatch } from "react-redux";
// import { Search } from "lucide-react";

// const Header = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const { data } = useGetUserProfileQuery();
//   const [logout] = useLogoutMutation();

//   const logoutHandler = async () => {
//     await logout();
//     dispatch(userApiSlice.util.resetApiState());
//     navigate("/login");
//   };

//   return (
//     <div className="navbar bg-base-100 shadow-sm px-2 sm:px-4">
//       {/* LEFT - Logo */}
//       <div className="flex-1 min-w-0">
//         <Link
//           to="/"
//           className="btn btn-ghost text-lg sm:text-xl truncate"
//         >
//           Share Thoughts
//         </Link>
//       </div>

//       {/* RIGHT - Actions */}
//       <div className="flex items-center gap-1 sm:gap-3">
//         {/* 🔍 Search */}
//         <button
//           className="btn btn-ghost btn-circle"
//           onClick={() => navigate("/search")}
//           aria-label="Search"
//         >
//           <Search size={20} />
//         </button>

//         {/* 👤 Profile / Auth */}
//         {data ? (
//           <details className="dropdown dropdown-end">
//             <summary className="btn btn-ghost btn-circle avatar">
//               <div className="w-9 sm:w-10 rounded-full overflow-hidden flex items-center justify-center">
//                 <img
//                   src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
//                     data.name
//                   )}&background=random`}
//                   alt={data.name}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//             </summary>

//             <ul className="menu dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-40 sm:w-44 z-[9999]">
//               <li>
//                 <Link to="/profile">Profile</Link>
//               </li>
//               <li>
//                 <button onClick={logoutHandler}>Logout</button>
//               </li>
//             </ul>
//           </details>
//         ) : (
//           <Link to="/login" className="btn btn-primary btn-sm sm:btn-md">
//             Login
//           </Link>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Header;



import { Link, useNavigate } from "react-router-dom";
import {
  useGetUserProfileQuery,
  useLogoutMutation,
  userApiSlice,
} from "./app/UserApiSLice";
import { useDispatch } from "react-redux";
import { Search, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data } = useGetUserProfileQuery();
  const [logout] = useLogoutMutation();

  /* ================= THEME ================= */
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };
  /* ========================================= */

  const logoutHandler = async () => {
    await logout();
    dispatch(userApiSlice.util.resetApiState());
    navigate("/login");
  };

  return (
    <div className="navbar bg-base-100 shadow-sm px-2 sm:px-4 sticky top-0 z-50">
      {/* LEFT - Logo */}
      <div className="flex-1 min-w-0">
        <Link
          to="/"
          className="btn btn-ghost text-lg sm:text-xl truncate"
        >
          Share Thoughts
        </Link>
      </div>

      {/* RIGHT - Actions */}
      <div className="flex items-center gap-1 sm:gap-3">
        {/* 🔍 Search */}
        <button
          className="btn btn-ghost btn-circle"
          onClick={() => navigate("/search")}
          aria-label="Search"
        >
          <Search size={20} />
        </button>

        {/* 🌗 Theme Toggle */}
        <button
          className="btn btn-ghost btn-circle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === "light" ? (
            <Moon size={20} />
          ) : (
            <Sun size={20} />
          )}
        </button>

        {/* 👤 Profile / Auth */}
        {data ? (
          <details className="dropdown dropdown-end">
            <summary className="btn btn-ghost btn-circle avatar">
              <div className="w-9 sm:w-10 rounded-full overflow-hidden flex items-center justify-center">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    data.name
                  )}&background=random`}
                  alt={data.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </summary>

            <ul className="menu dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-40 sm:w-44 z-[9999]">
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <button onClick={logoutHandler}>Logout</button>
              </li>
            </ul>
          </details>
        ) : (
          <Link to="/login" className="btn btn-primary btn-sm sm:btn-md">
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
