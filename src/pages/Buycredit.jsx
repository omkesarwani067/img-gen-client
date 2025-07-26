import { useContext, useEffect } from "react";
import { assets, plans } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BuyCredit = () => {
  const { user, setShowLogin, backendUrl, loadCreditsData, token } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      // ✅ FIXED: Check if script exists before removing
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleRazorpaySuccess = async (response) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/verify-razor`, response, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        loadCreditsData();
        toast.success("Credits added successfully!");
        navigate("/");
      } else {
        toast.error("Verification failed. Try again.");
      }
    } catch (error) {
      toast.error("Payment verification failed.");
    }
  };

  // ✅ FIXED: Add Razorpay loading check
  const initPayment = async (order) => {
    // Check if Razorpay is loaded
    if (!window.Razorpay) {
      toast.error("Payment system loading. Please try again in a moment.");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Credit Purchase",
      description: "Purchase credits",
      order_id: order.id,
      handler: handleRazorpaySuccess,
      prefill: {
        name: user?.name || "",
        email: user?.email || "",
      },
      theme: {
        color: "#3399cc"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const paymentrazor_pay = async (planId) => {
    try {
      if (!token || !user) {
        setShowLogin(true);
        return;
      }

      const { data } = await axios.post(`${backendUrl}/api/user/pay-razor`, { planId }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        initPayment(data.order);
      } else {
        toast.error("Failed to create Razorpay order.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Payment error. Please try again.");
    }
  };

  // ✅ Rest of component unchanged - JSX remains the same
  return (
    <motion.div
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="min-h-[80vh] text-center pt-14 mb-10"
    >
      <button className="border border-gray-400 px-10 py-2 rounded-full mb-6">Our Plans</button>
      <h1 className="text-center text-3xl font-medium mb-6 sm:mb-10">Choose the plan</h1>

      <div className="flex flex-wrap justify-center gap-6 text-left">
        {plans.map((item, index) => (
          <div
            key={index}
            className="bg-white drop-shadow-sm border rounded-lg py-12 px-8 text-gray-600 hover:scale-105 transition-all duration-500"
          >
            <img width={40} src={assets.logo_icon} alt="" />
            <p className="mt-3 mb-1 font-semibold">{item.id}</p>
            <p className="text-sm">{item.desc}</p>
            <p className="mt-6">
              <span className="text-3xl font-medium">₹{item.price}</span> / {item.credits} credits
            </p>
            <button
              onClick={() => paymentrazor_pay(item.id)}
              className="w-full bg-gray-800 text-white mt-8 text-sm rounded-md py-2.5 min-w-52"
            >
              {user ? "Purchase" : "Get Started"}
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default BuyCredit;