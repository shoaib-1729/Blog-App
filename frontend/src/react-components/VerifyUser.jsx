import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const VerifyUser = () => {
  const { verificationToken } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  async function verifyEmail() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/verify-email/${verificationToken}`
      );
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
      setTimeout(() => navigate("/signin"), 2000);
    }
  }

  useEffect(() => {
    verifyEmail();
  }, [verificationToken]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      {loading ? (
        <p className="text-lg text-gray-700">Verifying your email, please wait...</p>
      ) : (
        <p className="text-lg text-gray-700">Redirecting to Sign In...</p>
      )}
    </div>
  );
};

export default VerifyUser;
