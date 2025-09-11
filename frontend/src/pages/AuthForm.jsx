import { useState, useEffect } from "react";
import { Button } from "@/shadcn-components/ui/button";
import { Input } from "@/shadcn-components/ui/input";
import { Label } from "@/shadcn-components/ui/label";
import { login } from "../utils/userSlice";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { googleAuth } from "../utils/firebase.js";
import googleIcon from "../assets/google-icon-logo-svgrepo-com.svg";

const AuthForm = ({ type }) => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false); // 🔹 loader state

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // reset form on type change (signin/signup/forgot)
  useEffect(() => {
    setUserData(() => ({
      name: "",
      email: "",
      password: "",
    }));
  }, [type]);

  // disable/enable button dynamically
  useEffect(() => {
    if (type === "signup") {
      setIsButtonDisabled(!(userData.name && userData.email && userData.password));
    } else if (type === "signin") {
      setIsButtonDisabled(!(userData.email && userData.password));
    } else if (type === "forgot") {
      setIsButtonDisabled(!userData.email);
    }
  }, [userData, type]);

  // 🔹 Google Auth
  async function handleGoogleAuth() {
    try {
      setLoading(true); 
      const gUser = await googleAuth();
      if (!gUser) return;

      const idToken = await gUser.getIdToken();

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/google-auth`,
        { accessToken: idToken }
      );

      dispatch(login(res.data.user));
      toast.success(res.data.message || "Login successful");
      navigate("/");
    } catch (err) {
      const errorMessage = err?.response?.data?.message || "Google sign-in failed.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  // 🔹 Submit Form (SignIn / SignUp / Forgot Password)
  async function handleAuthFormSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const endpoint =
          type === "signup"
          ? "signup"
          : "signin";

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/${endpoint}`,
        userData
      );

      if (res.status === 200) {
        toast.success(res.data.message);
      }

      if (type === "signin") {
        dispatch(login(res?.data?.user));
        navigate("/");
      } else if (type === "signup") {
        navigate("/signin");
      } else if (type === "forgot") {
        navigate("/signin");
      }
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || "Something went wrong.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      if (type !== "signin") {
        setUserData({ name: "", email: "", password: "" });
      }
    }
  }

  function handleInput(e) {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-6">
        <h1 className="mb-6 text-2xl font-semibold">
          {type === "signup"
            ? "Sign Up"
            : "Sign In"}
        </h1>

        <form onSubmit={handleAuthFormSubmit} className="space-y-4">
          {type === "signup" && (
            <div className="space-y-2 relative">
              <Label htmlFor="name">Name</Label>
              <i className="fi fi-rr-file-user absolute left-3 top-8 text-muted-foreground opacity-50"></i>
              <Input
                onChange={handleInput}
                id="name"
                name="name"
                value={userData.name}
                placeholder="Enter your name"
                required
                className="pl-10"
              />
            </div>
          )}

          <div className="space-y-2 relative">
            <Label htmlFor="email">Email</Label>
            <i className="fi fi-rr-envelope absolute left-3 top-8 text-muted-foreground opacity-50"></i>
            <Input
              onChange={handleInput}
              id="email"
              name="email"
              value={userData.email}
              type="email"
              placeholder="Enter your email address"
              required
              className="pl-10"
            />
          </div>

          {type !== "forgot" && (
            <div className="space-y-2 relative">
              <Label htmlFor="password">Password</Label>
              <i className="fi fi-rr-lock absolute left-3 top-8 text-muted-foreground opacity-50"></i>
              <i
                onClick={() => setShowPassword((prev) => !prev)}
                className={`fi ${
                  showPassword ? "fi-rr-eye-crossed" : "fi-rr-eye"
                } absolute right-3 top-8 text-muted-foreground opacity-50 cursor-pointer`}
              ></i>
              <Input
                onChange={handleInput}
                id="password"
                name="password"
                value={userData.password}
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                required
                className="pl-10 pr-10"
              />
            </div>
          )}

          {/* 🔹 Button with loader */}
          <Button
            type="submit"
            disabled={isButtonDisabled || loading}
            className={`
              w-full flex items-center justify-center
              ${
                isButtonDisabled || loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-900"
              }
            `}
          >
            {loading ? (
              <span className="loader border-2 border-t-transparent border-white rounded-full w-4 h-4 animate-spin mr-2"></span>
            ) : null}
            {loading
              ? "Please wait..."
              : type === "signup"
              ? "Register"
              : type === "forgot"
              ? "Send Reset Link"
              : "Sign In"}
          </Button>
        </form>

        {/* 🔹 Links */}
        <div className="mt-4 text-sm text-center">
          {type === "signin" && (
            <>
              <p>
                Don’t have an account?{" "}
                <Link
                  to="/signup"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Sign up
                </Link>
              </p>
              <p className="mt-2">
                <Link
                  to="/forget-password"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </p>
              <div className="mt-4">
                <Button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                >
                  <img src={googleIcon} alt="Google" className="w-5 h-5" />
                  Continue with Google
                </Button>
              </div>
            </>
          )}

          {type === "signup" && (
            <p>
              Already have an account?{" "}
              <Link
                to="/signin"
                className="text-blue-600 hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          )}

          {type === "forgot" && (
            <p>
              Back to{" "}
              <Link
                to="/signin"
                className="text-blue-600 hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
