import { Routes, Route, useLocation } from "react-router-dom";
import AuthForm from "./pages/AuthForm.jsx";
import Navbar from "./react-components/Navbar.jsx";
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

    return false;
  };

  return (
    <div className="min-h-screen flex flex-col theme-bg theme-text">
      {/* Navbar stays at the top */}
      {/* add-blog, signin, signup, reset-password routes par navbar matt dikhao */}
      {!shouldHideNavbar() && <Navbar />}

      {/* Main content will take the remaining space */}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
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
            path="/verify-user/:verificationToken"
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
          <Route
            path="/:username"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <ProtectedRoute>
                  <UserProfileBlogList />
                </ProtectedRoute>
              }
            />
            <Route
              path="saved-blogs"
              element={
                <ProtectedRoute>
                  <UserProfileBlogList />
                </ProtectedRoute>
              }
            />
            <Route
              path="liked-blogs"
              element={
                <ProtectedRoute>
                  <UserProfileBlogList />
                </ProtectedRoute>
              }
            />
            <Route
              path="draft-blogs"
              element={
                <ProtectedRoute>
                  <UserProfileBlogList />
                </ProtectedRoute>
              }
            />
            <Route
              path="about"
              element={
                <ProtectedRoute>
                  <AboutPage />
                </ProtectedRoute>
              }
            />
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
          <Route
            path="/search-query"
            element={
              <ProtectedRoute>
                <SearchedBlog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tag/:tagName"
            element={
              <ProtectedRoute>
                <TagPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
