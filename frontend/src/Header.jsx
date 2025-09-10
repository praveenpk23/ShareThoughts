import React from "react";
import { useGetUserProfileQuery } from "./features/users/UserApiSLice";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "./features/users/UserApiSLice";
import { userApiSlice } from "./features/users/UserApiSLice";
import { useDispatch } from "react-redux";
const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    data,
    error,
    isLoading,
    refetch: refetchProfile,
  } = useGetUserProfileQuery();
  const [logout] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logout();
      dispatch(userApiSlice.util.resetApiState());
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <Link to='/'><a className="btn btn-ghost text-xl">Share Thoughts</a></Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            {data && (
              <Link to="/profile">{data && data?.name.slice(0, 1)}</Link>
            )}
          </li>
          <li>
            <details>
              <summary>{data?.name ? data.name : "User"}</summary>
              <ul className="bg-base-100 rounded-t-none p-2 absolute right-0 mt-2 shadow-lg z-[9999]">
                {data && (
                  <li>
                    <Link to='profile'>Profile</Link>
                  </li>
                )}
                {data ? (
                  <li>
                    <a onClick={logoutHandler}>Logout</a>
                  </li>
                ) : (
                  <li>
                    <Link to="/login">Login</Link>
                  </li>
                )}

              </ul>
            </details>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
