// Photo Upload Page
//
// Core Functionality:
// - Provides secure interface for authenticated users to upload photos
// - Implements authentication check with redirect to login for unauthorized users
// - Renders PhotoUpload component which handles the actual upload process
// - Preserves return path for post-login navigation
//
// User Interface:
// - Features clean, focused layout with clear purpose statement
// - Includes decorative icon to reinforce upload functionality
// - Maintains consistent styling with the photo gallery section
// - Implements smooth entrance animation for content
//
// Security:
// - Restricts access to authenticated users only
// - Redirects unauthorized users to login page
// - Preserves intended destination through router state
//
// Structure:
// - Acts as a container wrapper for the PhotoUpload component
// - Provides consistent page layout and styling
// - Handles authentication logic separately from upload functionality
// - Maintains separation of concerns between auth and content
//
// Uses Tailwind CSS with nature-themed color scheme and custom animations.
import PhotoUpload from "../components/PhotoUpload";
import { isAuthenticated } from "../utils/auth";
import { Navigate } from "react-router-dom";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const PhotoUploadPage = () => {
  useScrollAnimation(false);

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: "/photos/upload" }} />;
  }

  return (
    <div className="bg-background-beige min-h-screen animate-slideIn">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-accent font-bold text-woodland-brown mb-8 text-center drop-shadow">
          Share Your Scout Moment
        </h1>
        
        <PhotoUpload />
      </div>
    </div>
  );
};

export default PhotoUploadPage;