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
  const [googleLoading, setGoogleLoading] = useState(false); // 🔹 Google auth loader state

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Loading configuration based on type and operation
  const getLoadingConfig = () => {
    return {
      title:
        type === "signup"
          ? "Signing You Up..."
          : type === "signin"
            ? "Signing You In..."
            : "Processing...",
      description:
        type === "signup"
          ? "Please wait while we create your account."
          : type === "signin"
            ? "Please wait while we sign you in."
            : "Please wait while we process your request.",
    };
  };

  // reset form on type change (signin/signup)
  useEffect(() => {
    if (type === "signin") {
      setUserData(() => ({
        email: userData.email || "",
        password: userData.password || "",
      }));
    } else {
      setUserData(() => ({
        name: "",
        email: "",
        password: "",
      }));
    }
  }, [type]);

  // disable/enable button dynamically
  useEffect(() => {
    if (type === "signup") {
      setIsButtonDisabled(
        !(userData.name && userData.email && userData.password)
      );
    } else if (type === "signin") {
      setIsButtonDisabled(!(userData.email && userData.password));
    }
  }, [userData, type]);

  // 🔹 Google Auth
  async function handleGoogleAuth() {
    try {
      setGoogleLoading(true);
      const gUser = await googleAuth();
      if (!gUser) return;

      const idToken = await gUser.getIdToken();

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/google-auth`,
        { accessToken: idToken }
      );

      dispatch(login(res.data.user));
      toast.success(res.data.message || "Login successful");

      // Delay for smooth UX, then navigate
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || "Google sign-in failed.";
      toast.error(errorMessage);
    } finally {
      setGoogleLoading(false);
    }
  }

  // 🔹 Submit Form (SignIn / SignUp / Forgot Password)
  async function handleAuthFormSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const endpoint = type === "signup" ? "signup" : "signin";

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/${endpoint}`,
        userData
      );

      if (res.status === 200) {
        toast.success(res.data.message);
      }

      if (type === "signin") {
        dispatch(login(res?.data?.user));

        // Delay for smooth UX, then navigate
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else if (type === "signup") {
        // Delay for smooth UX, then navigate
        setTimeout(() => {
          navigate("/signin");
        }, 1000);
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

  const loadingConfig = getLoadingConfig();

  return (
    <>
      {/* Loading spinner overlay - Same style as AddBlog */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {loadingConfig.title}
              </h3>
              <p className="text-sm text-gray-600">
                {loadingConfig.description}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md p-6">
          <h1 className="mb-6 text-2xl font-semibold">
            {type === "signup" ? "Sign Up" : "Sign In"}
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
                  disabled={loading || googleLoading} // Disable during loading
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
                disabled={loading || googleLoading} // Disable during loading
              />
            </div>

            {type !== "forgot" && (
              <div className="space-y-2 relative">
                <Label htmlFor="password">Password</Label>
                <i className="fi fi-rr-lock absolute left-3 top-8 text-muted-foreground opacity-50"></i>
                <i
                  onClick={() =>
                    !loading &&
                    !googleLoading &&
                    setShowPassword((prev) => !prev)
                  } // Disable during loading
                  className={`fi ${
                    showPassword ? "fi-rr-eye-crossed" : "fi-rr-eye"
                  } absolute right-3 top-8 text-muted-foreground opacity-50 ${loading || googleLoading ? "cursor-not-allowed opacity-30" : "cursor-pointer"}`}
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
                  disabled={loading || googleLoading} // Disable during loading
                />
              </div>
            )}

            {/* 🔹 Button with loader */}
            <Button
              type="submit"
              disabled={isButtonDisabled || loading || googleLoading}
              className={`
                w-full flex items-center justify-center
                ${
                  isButtonDisabled || loading || googleLoading
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
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className={`font-medium ${loading || googleLoading ? "pointer-events-none opacity-50" : "text-blue-600 hover:underline"}`}
                  >
                    Sign up
                  </Link>
                </p>
                <p className="mt-2">
                  <Link
                    to="/forget-password"
                    className={`font-medium ${loading || googleLoading ? "pointer-events-none opacity-50" : "text-blue-600 hover:underline"}`}
                  >
                    Forgot password?
                  </Link>
                </p>
                <div className="mt-4">
                  <Button
                    type="button"
                    onClick={handleGoogleAuth}
                    disabled={loading || googleLoading}
                    className={`w-full flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 ${
                      googleLoading ? "opacity-70" : ""
                    }`}
                  >
                    {googleLoading ? (
                      <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <img src={googleIcon} alt="Google" className="w-5 h-5" />
                    )}
                    {googleLoading ? "Signing in..." : "Continue with Google"}
                  </Button>
                </div>
              </>
            )}

            {type === "signup" && (
              <p>
                Already have an account?{" "}
                <Link
                  to="/signin"
                  className={`font-medium ${loading || googleLoading ? "pointer-events-none opacity-50" : "text-blue-600 hover:underline"}`}
                >
                  Sign in
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthForm;
