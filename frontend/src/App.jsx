import { Routes, Route, useLocation } from "react-router-dom";
import AuthForm from "./pages/AuthForm.jsx";
import Navbar from "./react-components/Navbar.jsx";
import { useState } from "react";
import HomePage from "./pages/HomePage.jsx";
import AddBlog from "./react-components/AddBlog.jsx";
import BlogPage from "./pages/BlogPage.jsx";
import ProtectedRoute from "./react-components/ProtectedRoute.jsx";
import VerifyUser from "./react-components/VerifyUser.jsx";
import UserProfile from "./react-components/UserProfile.jsx";
import EditProfile from "./react-components/EditProfile.jsx";
import SearchedBlog from "./react-components/SearchedBlog.jsx";
import TagPage from "./pages/TagPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import UserProfileBlogList from "./react-components/UserProfileBlogList.jsx";
import SidebarBlogList from "./react-components/SidebarBlogList.jsx";
import SettingPage from "./pages/SettingPage.jsx";
import ResetPassword from "./react-components/ResetPassword.jsx";
import ForgetPassword from "./react-components/ForgetPassword.jsx";

function App() {
  const location = useLocation();

  const [showHeroPage, setShowHeroPage] = useState(false);

  const handleGetStarted = () => {
    localStorage.setItem("visitedHeroPage", "true");
    setShowHeroPage(false);
  };

  // Function to check if navbar should be hidden
  const shouldHideNavbar = () => {
    const hiddenRoutes = ["/add-blog", "/signin", "/signup"];
    const pathname = location.pathname;

    // Check exact matches
    if (hiddenRoutes.includes(pathname)) {
      return true;
    }

    // Check if path starts with /reset-password or /forget-password
    if (
      pathname.startsWith("/reset-password") ||
      pathname.startsWith("/forget-password")
    ) {
      return true;
    }

    // hero page par navbar hide karo
    if (showHeroPage && pathname === "/") {
      return true;
    }

    return false;
  };

  return (
    <div className="min-h-screen flex flex-col theme-bg theme-text">
      {/* Navbar stays at the top */}
      {/* add-blog, signin, signup, reset-password routes par navbar matt dikhao */}
      {!shouldHideNavbar() && <Navbar setShowHeroPage={setShowHeroPage} />}

      {/* Main content will take the remaining space */}
      <div className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                showHeroPage={showHeroPage}
                setShowHeroPage={setShowHeroPage}
                handleGetStarted={handleGetStarted}
              />
            }
          />
          <Route
            path="/add-blog"
            element={
              <ProtectedRoute>
                <AddBlog />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute>
                <AddBlog />
              </ProtectedRoute>
            }
          />
          <Route path="/signup" element={<AuthForm type={"signup"} />} />
          <Route path="/signin" element={<AuthForm type={"signin"} />} />
          <Route path="/blog/:id" element={<BlogPage />} />

          <Route
            path="/verify-email/:verificationToken"
            element={<VerifyUser />}
          />
          <Route
            path="/reset-password/:id"
            element={
              <ProtectedRoute>
                <ResetPassword />
              </ProtectedRoute>
            }
          />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/:username" element={<UserProfile />}>
            <Route index element={<UserProfileBlogList />} />
            <Route path="saved-blogs" element={<UserProfileBlogList />} />
            <Route path="liked-blogs" element={<UserProfileBlogList />} />
            <Route path="draft-blogs" element={<UserProfileBlogList />} />
            <Route path="about" element={<AboutPage />} />
          </Route>

          <Route
            path="/:username/bloglist/liked"
            element={
              <ProtectedRoute>
                <SidebarBlogList type={"liked"} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/:username/bloglist/saved"
            element={
              <ProtectedRoute>
                <SidebarBlogList type={"saved"} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-setting"
            element={
              <ProtectedRoute>
                <SettingPage />
              </ProtectedRoute>
            }
          />
          <Route path="/search-query" element={<SearchedBlog />} />
          <Route path="/tag/:tagName" element={<TagPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
