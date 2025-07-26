import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [credit, setCredit] = useState(0);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  // ✅ FIXED: Load credits and user profile
  const loadCreditsData = async () => {
    if (!token || token === "") return;
    
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/credits`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setUser(data.user);
        setCredit(data.credits);
      }
    } catch (error) {
      console.log('Credits load error:', error);
      // ✅ FIXED: Only logout if user exists and it's a real auth error
      if (error.response?.status === 401 && user) {
        logout();
        toast.error("Session expired. Please login again.");
      }
      // Don't show error toast on initial loads to prevent spam
    }
  };

  // ✅ Generate image (unchanged - working fine)
  const generateImage = async (prompt) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/image/generate-image`,
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        loadCreditsData(); // update credit balance
        return data.resultImage;
      } else {
        toast.error(data.message);
        if (data.creditBalance === 0) navigate("/buy");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
      }
      toast.error("Failed to generate image. Please login.");
    }
  };

  // ✅ Logout (unchanged - working fine)
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    setCredit(0);
    navigate("/");
    toast.success("Logged out successfully.");
  };

  // ✅ FIXED: Load credits when token changes
  useEffect(() => {
    if (token && token !== "" && !user) {
      loadCreditsData();
    }
  }, [token]); // Added token as dependency

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        showLogin,
        setShowLogin,
        backendUrl,
        token,
        setToken,
        credit,
        setCredit,
        loadCreditsData,
        logout,
        generateImage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;