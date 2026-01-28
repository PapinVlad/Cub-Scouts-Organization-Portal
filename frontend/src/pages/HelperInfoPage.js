"use client"

import { Link } from "react-router-dom"
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { useEffect, useState, useRef } from "react";

const HelperInfoPage = () => {
  const [loading, setLoading] = useState(true);
  useScrollAnimation(loading);
  return (
    <div className="bg-background-beige min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-woodland-brown overflow-hidden animate-on-scroll  transition-all duration-700 translate-y-8 text-white text-center">
        <div className="absolute inset-0">
          <img
            src="/assets/ezgif.com-speed.gif"
            alt="Obanshire Cub Scouts Adventure Animation"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>
        <div className="relative container mx-auto px-4 py-24 md:py-32 text-center flex items-center justify-center align-center">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Become a Volunteer Helper with Obanshire Cub Scouts</h1>
            <p className="text-xl md:text-2xl mb-8">
              Join our community, support young scouts, and make a difference in their lives.
            </p>
            <Link
              to="/login"
              className="btn bg-forest-green hover:bg-primary-dark text-white font-bold px-6 py-3 rounded-md transition-colors duration-200"
            >
              Join as a Helper Now
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 100L60 80C120 60 240 20 360 20C480 20 600 60 720 80C840 100 960 100 1080 80C1200 60 1320 20 1380 0L1440 0V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0Z"
              fill="#F5F5DC"
            />
          </svg>
        </div>
      </section>

      {/* Volunteer Information Section */}
      <section className="py-16 bg-white animate-on-scroll  transition-all duration-700 translate-y-8">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-12 text-woodland-brown">Why Become a Volunteer Helper?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-heading font-bold mb-4 text-woodland-brown">Support the Community</h3>
              <p className="text-text-primary">
                As a volunteer helper with Obanshire Cub Scouts, you’ll play a vital role in supporting our local community. Help children aged 8-10 develop new skills, build confidence, and enjoy outdoor adventures.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-heading font-bold mb-4 text-woodland-brown">Flexible Opportunities</h3>
              <p className="text-text-primary">
                We offer flexible volunteering options to fit your schedule. Whether you can commit to regular sessions or assist occasionally, your contribution as a helper is invaluable.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-heading font-bold mb-4 text-woodland-brown">Training and Growth</h3>
              <p className="text-text-primary">
                Receive training and support to enhance your skills while volunteering. Join a team of dedicated helpers and grow personally while inspiring the next generation of Cub Scouts.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-heading font-bold mb-4 text-woodland-brown">Build Connections</h3>
              <p className="text-text-primary">
                Connect with like-minded individuals, forge new friendships, and become part of the Cub Scouts family as a volunteer helper.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Get Involved Section */}
      <section className="py-16 bg-background-beige animate-on-scroll  transition-all duration-700 translate-y-8">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-12 text-woodland-brown">How to Get Involved</h2>
          <div className="text-center">
            <p className="text-xl text-text-primary mb-6">
              Ready to become a volunteer helper? Start by logging in or registering to join our team. Explore the exciting opportunities to support Cub Scouts and make a lasting impact.
            </p>
            <Link
              to="/login"
              className="btn bg-forest-green hover:bg-primary-dark text-white px-6 py-3 rounded-md inline-block transition-colors duration-200"
            >
              Join as a Helper Now
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white animate-on-scroll  transition-all duration-700 translate-y-8">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-12 text-woodland-brown">What Our Volunteers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-background-beige p-6 rounded-lg shadow-md">
              <p className="text-text-primary italic mb-4">
                "Volunteering with Cub Scouts has been a rewarding experience. I love seeing the kids grow and learn!"
              </p>
              <p className="text-right font-bold text-woodland-brown">- Jane D., Helper</p>
            </div>
            <div className="bg-background-beige p-6 rounded-lg shadow-md">
              <p className="text-text-primary italic mb-4">
                "The flexibility and support make it easy to contribute as a volunteer. Highly recommend joining!"
              </p>
              <p className="text-right font-bold text-woodland-brown">- Mark S., Volunteer</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HelperInfoPage