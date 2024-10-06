import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/input/PasswordInput";
import axiosInstance from "../../utils/axiosInstance";
import { validateEmail } from "../../utils/helper";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleGoogleSignIn = async (response) => {
    try {
      const result = await axiosInstance.post("/google-login", {
        token: response.credential,
        clientId: response.clientId,
      });

      localStorage.setItem("token", result.data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error during google signin", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(email.trim())) {
      setError("Please enter a valid email");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/login", {
        email: email.trim(),
        password: password,
      });
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        setIsAuthenticated(true);
        navigate("/dashboard");
      } else {
        setError("Email or password incorrect");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.accessToken
      ) {
        setError(error.response.data.message || "Invalid credentials");
      } else {
        setError("An unexpected error occurred. Please try again");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex item-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl mb-7">Login</h4>
            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
            <p className="text-sm text-center mt-4">
              Not registered yet?
              <Link
                to="/signUp"
                className="font-medium text-primary underline ml-1"
              >
                Create an Account
              </Link>
            </p>
            <div className="flex flex-col justify-center items-center">
              <hr className="my-6 w-[100%]" />
              <GoogleLogin
                onSuccess={handleGoogleSignIn}
                onError={() => {
                  console.log("Login Failed");
                }}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
