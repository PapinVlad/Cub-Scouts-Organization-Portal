// Footer Component
//
// Core Functionality:
// - Provides the website footer with comprehensive site information and navigation
// - Implements a responsive multi-column layout with organized content sections
// - Displays contact information, social media links, and legal information
// - Dynamically generates copyright year information
//
// Content Sections:
// - About Us: Organization description and social media links
// - Explore: Navigation links to primary site sections
// - Get Involved: Links for participation and user account management
// - Contact Us: Physical address and communication channels
//
// Visual Design:
// - Implements custom styling with decorative background patterns
// - Uses consistent iconography for section headers and social links
// - Applies interactive hover effects for links and social icons
// - Maintains brand colors and typography consistent with site theme
//
// User Experience:
// - Provides animated link interactions with underline effects
// - Implements social media icon scaling on hover
// - Ensures responsive layout adapts to different screen sizes
// - Organizes links logically by category for intuitive navigation
//
// Accessibility Features:
// - Includes proper semantic HTML structure with address element
// - Provides aria-labels for social media links
// - Maintains sufficient color contrast for readability
// - Uses descriptive link text for screen reader compatibility

"use client";

import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <style jsx>{`
        footer {
          position: relative;
          overflow: hidden;
          background-color: #f5e9d4; /* background-beige */
        }

        .footer-pattern {
          position: absolute;
          inset: 0;
          opacity: 0.05;
          background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"%3E%3Cpath fill="%234a3726" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17v-2h-2v2h-1l3.5-7-3.5-7h1v2h2v-2h1l-3.5 7 3.5 7h-1z"/%3E%3C/svg%3E');
          background-repeat: repeat;
        }

        .footer-link {
          position: relative;
          display: inline-block;
          transition: color 0.2s ease, transform 0.2s ease;
        }

        .footer-link:hover {
          color: #2e7d32; /* forest-green */
          transform: translateY(-2px);
        }

        .footer-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background-color: #2e7d32; /* forest-green */
          transition: width 0.2s ease;
        }

        .footer-link:hover::after {
          width: 100%;
        }

        .social-icon {
          transition: transform 0.2s ease, color 0.2s ease;
        }

        .social-icon:hover {
          transform: scale(1.2);
          color: #2e7d32; /* forest-green */
        }
      `}</style>
      <footer className="py-12  bg-background-beige pt-20 pb-12 relative footer-board">
        <div className="absolute inset-0 bg-cover bg-center opacity-30 z-0 "></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About Us */}
            <div className="flex flex-col items-start animate-slideIn">
              <h3 className="text-2xl font-accent font-bold mb-4 flex items-center ">
                <svg className="w-6 h-6 mr-2 text-forest-green" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                </svg>
                About Us
              </h3>
              <p className="mb-4 text-md font-sans ">
                Obanshire Cub Scouts brings adventure, skills, and friendship to kids aged 8-10 in Obanshire.
              </p>
              <div className="flex space-x-4 mt-4">
                <a
                  href="https://facebook.com/obanshirecubscouts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className=" social-icon"
                  aria-label="Facebook"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="https://twitter.com/obanshirecubs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className=" social-icon"
                  aria-label="Twitter"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com/obanshirecubscouts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className=" social-icon"
                  aria-label="Instagram"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            {/* Explore */}
            <div className="flex flex-col items-start animate-slideIn">
              <h3 className="text-2xl font-accent font-bold mb-4 flex items-center ">
                <svg className="w-6 h-6 mr-2 text-forest-green" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                </svg>
                Explore
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="footer-link text-md font-sans ">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/badges" className="footer-link text-md font-sans ">
                    Badges
                  </Link>
                </li>
                <li>
                  <Link to="/events" className="footer-link text-md font-sans ">
                    Events
                  </Link>
                </li>
                <li>
                  <Link to="/photos" className="footer-link text-md font-sans ">
                    Photos
                  </Link>
                </li>
                <li>
                  <Link to="/games" className="footer-link text-md font-sans ">
                    Games
                  </Link>
                </li>
                <li>
                  <Link to="/announcements" className="footer-link text-md font-sans ">
                    Announcements
                  </Link>
                </li>
              </ul>
            </div>

            {/* Get Involved */}
            <div className="flex flex-col items-start animate-slideIn">
              <h3 className="text-2xl font-accent font-bold mb-4 flex items-center ">
                <svg className="w-6 h-6 mr-2 text-forest-green" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 3h-2v4h-4V3H7v4H5v14h14V7h-2V3zm-5 16c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                </svg>
                Get Involved
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/helper/register" className="footer-link text-md font-sans ">
                    Become a Helper
                  </Link>
                </li>
                
                <li>
                  <Link to="/about" className="footer-link text-md font-sans ">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="footer-link text-md font-sans ">
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="footer-link text-md font-sans ">
                    Login
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Us */}
            <div className="flex flex-col items-start animate-slideIn">
              <h3 className="text-2xl font-accent font-bold mb-4 flex items-center ">
                <svg className="w-6 h-6 mr-2 text-forest-green" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21.99 4c0-1.1-.89-2-1.99-2H4C2.9 2 2 2.9 2 4v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                </svg>
                Contact Us
              </h3>
              <address className="not-italic text-md font-sans ">
                <p className="mb-2">Obanshire Scout Hall</p>
                <p className="mb-2">123 Scout Road</p>
                <p className="mb-2">Obanshire, OB1 2CD</p>
                <p className="mb-2">United Kingdom</p>
              </address>
              <p className="mt-4 text-md">
                <a href="mailto:info@obanshirecubscouts.org" className="footer-link ">
                  info@obanshirecubscouts.org
                </a>
              </p>
              <p className="mt-2 text-md">
                <a href="tel:+441234567890" className="footer-link ">
                  +44 (0) 1234 567890
                </a>
              </p>
            </div>
          </div>

          <div className="border-t border-forest-green mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-md font-sans ">
            <p>© {currentYear} Obanshire Cub Scouts. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <Link to="/contact" className="footer-link ">
                Support
              </Link>
              <Link to="/privacy" className="footer-link ">
                Privacy Policy
              </Link>
              <Link to="/terms" className="footer-link ">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;