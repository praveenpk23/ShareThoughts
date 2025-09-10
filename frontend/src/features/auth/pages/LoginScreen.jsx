import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  useLoginMutation,
  useGetUserProfileQuery,
} from "../../users/UserApiSLice";
import { useLogoutMutation } from "../../users/UserApiSLice";
const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

console.log(redirect)
  // Login mutation
  const [loginUser, { isLoading }] = useLoginMutation();
  // Auto-fetch user profile
  const { data: profileData, refetch: refetchProfile } = useGetUserProfileQuery();

  // Submit handler
  const submitHandler = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Login
      await loginUser({ email, password }).unwrap();
      refetchProfile();

      if(redirect){
        navigate(`/${redirect}`)
      }else{
        navigate(`/${redirect}`)
      }

    } catch (err) {
      console.error("Login failed:", err);
      setError(err?.data?.message || "Login failed");
    }
  };

  // console.log(JSON.parse(localStorage.getItem("cart")));


  useEffect(()=>{
    if(profileData){
      navigate('/')
    }
  },[profileData])


  return (
    <div className="flex justify-center items-center h-screen bg-base-200">
      <div className="card w-96 shadow-2xl bg-base-100">
        <form onSubmit={submitHandler} className="card-body">
          <h2 className="text-2xl font-bold text-center">Login</h2>

          {error && <p className="text-error">{error}</p>}

          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="input input-bordered"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="input input-bordered"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-control mt-4">
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
              <p className="text-center pb-5"> Dont Have An Account ? <span className="text-primary link"><Link to='/register'>Register</Link></span> </p>
      </div>
    </div>
  );
};

export default LoginScreen;
