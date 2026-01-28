"use client";

import { useNavigate, Link } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import { motion } from "framer-motion";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const isAuth = isAuthenticated();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background-beige pt-20 pb-12 relative bulletin-board flex items-center justify-center"
    >
      {/* Bulletin Board Background */}
      <div className="absolute inset-0 bg-cover bg-center opacity-30 z-0 "></div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-6xl font-heading font-bold text-woodland-brown mb-6 drop-shadow-lg">
            404 - Lost in the Woods!
          </h1>
          <p className="text-xl text-forest-green mb-8">
            It seems you've wandered off the scout trail. The page you're looking for couldn't be found.
          </p>

          <div className="relative mb-12">
            <div
              className="bg-white rounded-lg shadow-lg p-6 border border-forest-green note-tilt transform rotate-6"
              style={{ transition: "transform 0.3s ease" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-24 w-24 text-forest-green mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-woodland-brown font-medium">
                Looks like this note got lost in the forest!
              </p>
            </div>
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-yellow-400 drop-shadow"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2a1 1 0 011 1v10l4-4 2 2-6 6-6-6 2-2 4 4V3a1 1 0 011-1z" />
              </svg>
            </div>
          </div>

          <div className="space-x-4">
            <button
              onClick={handleGoHome}
              className="btn bg-forest-green hover:bg-primary-dark text-white px-6 py-3 rounded-full transition-colors duration-200"
            >
              Return to Base Camp
            </button>
            {!isAuth && (
              <Link
                to="/login"
                className="btn bg-white text-woodland-brown hover:bg-forest-green hover:text-white border-2 border-forest-green px-6 py-3 rounded-full transition-colors duration-200"
              >
                Scout Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NotFoundPage;