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

  // ✅ Load credits and user profile
  const loadCreditsData = async () => {
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
      if (error.response?.status === 401) {
        logout();
        toast.error("Session expired or unauthorized. Please login.");
      } else {
        toast.error("Failed to load user data.");
      }
    }
  };

  // ✅ Generate image
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

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    setCredit(0);
    navigate("/");
    toast.success("Logged out successfully.");
  };

  // ✅ Load credit only once on initial app load
  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if (savedToken && !user) {
      setToken(savedToken);

      // Delay to ensure setToken completes before loadCreditsData runs
      setTimeout(() => {
        loadCreditsData();
      }, 0);
    }
  }, []);

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
