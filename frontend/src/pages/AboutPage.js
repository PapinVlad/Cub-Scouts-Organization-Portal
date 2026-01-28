// About Page Component
//
// Page Sections:
// - Hero: Animated GIF background with mission statement and CTA buttons
// - Our Story: Timeline showing organizational history from 1950s to present
// - Our Values: Highlights core principles (Courage, Curiosity, Community)
// - Our Team: Profiles of key members with interactive hover effects
// - Call to Action: Final recruitment section with join button
//
// Features:
// - Responsive design with mobile-friendly layouts
// - Scroll animations for section transitions
// - ScrollToTopButton for navigation convenience
// - React Router integration for internal links
//
// Uses Tailwind CSS with custom color scheme (woodland-brown, forest-green, background-beige).
// Client-side rendered with "use client" directive.
"use client"

import { Link } from "react-router-dom"
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import ScrollToTopButton from "../components/ScrollToTopButton";
import {  Phone } from "lucide-react"


const AboutPage = () => {
    useScrollAnimation(false);
  return (
    <div className="bg-background-beige min-h-screen">
      <section className="relative bg-woodland-brown overflow-hidden animate-on-scroll opacity-0 transition-all duration-700 translate-y-8">
        <div className="absolute inset-0">
          <img
            src="/Parallax-ezgif.com-speed.gif" 
            alt="Obanshire Cub Scouts Adventure Animation"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        <div className="relative container mx-auto px-4 py-24 md:py-32 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 drop-shadow-lg">
            The Heart of Obanshire Cub Scouts
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto drop-shadow">
            A place where local adventures spark lifelong memories, rooted in the values of teamwork, courage, and nature.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/login"
              className="btn bg-forest-green hover:bg-primary-dark text-white font-bold px-6 py-3 rounded-md transition-colors duration-200"
            >
              Start Your Journey
            </Link>
            <Link
              to="/events"
              className="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-woodland-brown px-6 py-3 rounded-md transition-colors duration-200"
            >
              Join an Adventure
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

<section className="py-16 bg-gradient-to-b from-white to-green-50 animate-on-scroll opacity-0 transition-all duration-700 translate-y-8 relative overflow-hidden">
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute top-10 left-10 w-32 h-32 bg-forest-green/5 rounded-full animate-float"></div>
    <div className="absolute top-40 right-20 w-24 h-24 bg-woodland-brown/5 rounded-full animate-float-delayed"></div>
    <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-sage-green/5 rounded-full animate-float-slow"></div>
  </div>

  <div className="container mx-auto px-4 relative">
    <h2 className="text-4xl font-heading font-bold text-center mb-16 text-woodland-brown relative">
      Our Story: A Legacy of Adventure
      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-forest-green to-sage-green rounded-full"></div>
    </h2>
    
    <div className="relative">
      <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-forest-green via-sage-green to-forest-green h-full md:block hidden shadow-lg">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-forest-green rounded-full animate-pulse shadow-md"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-sage-green rounded-full animate-pulse shadow-md" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-forest-green rounded-full animate-pulse shadow-md" style={{animationDelay: '1s'}}></div>
      </div>
      
      <div className="space-y-16">
        {/* 1950s Story */}
        <div className="flex flex-col md:flex-row items-center group">
          <div className="w-full md:w-1/2 pr-0 md:pr-12 text-center md:text-right mb-6 md:mb-0 transform transition-all duration-500 group-hover:translate-x-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:bg-white/90">
              <h3 className="text-2xl font-heading font-bold text-woodland-brown mb-3 flex items-center justify-center md:justify-end gap-2">
                <span className="text-2xl">🔥</span>
                1950s: The First Campfire
              </h3>
              <p className="text-text-primary leading-relaxed mb-4">
                It all began with a spark of inspiration in the Scottish Highlands. A small group of adventurous children gathered around a crackling campfire under the starlit sky, their eyes wide with wonder as local storytellers shared tales of ancient Celtic heroes and woodland mysteries.
              </p>
              <p className="text-text-primary leading-relaxed">
                These early pioneers of Obanshire Cub Scouts learned the fundamental values of friendship, courage, and respect for nature that would become the cornerstone of our organization for generations to come.
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/2 pl-0 md:pl-12 flex justify-center">
            <div className="relative group-hover:scale-105 transition-all duration-500 hover:rotate-1">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-red-200 rounded-xl blur-lg opacity-0 group-hover:opacity-30 transition-all duration-300"></div>
              <img
                src="/assets/1950-about-us.jpg"
                alt="First Obanshire campfire with children gathered around flames"
                className="rounded-xl shadow-xl max-w-full h-auto max-h-[400px] object-contain relative z-10 hover:shadow-2xl transition-all duration-300 border-4 border-white/50"
              />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-400 rounded-full animate-bounce opacity-0 group-hover:opacity-100 transition-all duration-300">
                <span className="absolute inset-0 flex items-center justify-center text-white text-sm">✨</span>
              </div>
            </div>
          </div>
        </div>

        {/* 1980s Story */}
        <div className="flex flex-col md:flex-row items-center md:flex-row-reverse group">
          <div className="w-full md:w-1/2 pl-0 md:pl-12 text-center md:text-left mb-6 md:mb-0 transform transition-all duration-500 group-hover:-translate-x-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:bg-white/90">
              <h3 className="text-2xl font-heading font-bold text-woodland-brown mb-3 flex items-center justify-center md:justify-start gap-2">
                <span className="text-2xl">🌳</span>
                1980s: Growing Roots
              </h3>
              <p className="text-text-primary leading-relaxed mb-4">
                The 1980s marked a period of tremendous growth and community building. Our pack flourished as families from across Oban joined together, creating a vibrant hub where Scottish traditions merged beautifully with scouting values.
              </p>
              <p className="text-text-primary leading-relaxed mb-4">
                We established our first permanent meeting hall, organized annual Highland Games for children, and began our legendary tree-planting initiatives that helped restore local woodlands after industrial development.
              </p>
              <p className="text-text-primary leading-relaxed">
                This decade saw the birth of many traditions still cherished today: the Autumn Harvest Festival, Winter Solstice Storytelling, and our famous "Wee Adventurers" badge program.
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/2 pr-0 md:pr-12 flex justify-center md:justify-start">
            <div className="relative group-hover:scale-105 transition-all duration-500 hover:-rotate-1">
              <div className="absolute inset-0 bg-gradient-to-br from-green-200 to-blue-200 rounded-xl blur-lg opacity-0 group-hover:opacity-30 transition-all duration-300"></div>
              <img
                src="/assets/1980-about-us.jpg"
                alt="Young scouts planting trees in the Scottish countryside"
                className="rounded-xl shadow-xl max-w-full h-auto max-h-[400px] object-contain relative z-10 hover:shadow-2xl transition-all duration-300 border-4 border-white/50"
              />
              <div className="absolute -top-2 -left-2 w-8 h-8 bg-green-400 rounded-full animate-bounce opacity-0 group-hover:opacity-100 transition-all duration-300" style={{animationDelay: '0.2s'}}>
                <span className="absolute inset-0 flex items-center justify-center text-white text-sm">🌱</span>
              </div>
            </div>
          </div>
        </div>

        {/* Today Story */}
        <div className="flex flex-col md:flex-row items-center group">
          <div className="w-full md:w-1/2 pr-0 md:pr-12 text-center md:text-right mb-6 md:mb-0 transform transition-all duration-500 group-hover:translate-x-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:bg-white/90">
              <h3 className="text-2xl font-heading font-bold text-woodland-brown mb-3 flex items-center justify-center md:justify-end gap-2">
                <span className="text-2xl">🏔️</span>
                Today: A Thriving Community
              </h3>
              <p className="text-text-primary leading-relaxed mb-4">
                Today, Obanshire Cub Scouts stands as a beacon of adventure and learning in the West Highlands. Our modern pack combines cutting-edge outdoor education with time-honored Scottish traditions, creating unforgettable experiences for young explorers.
              </p>
              <p className="text-text-primary leading-relaxed mb-4">
                We offer comprehensive badge programs covering everything from digital citizenship to wilderness survival, mountain climbing to marine conservation. Our weekly adventures might include kayaking in Oban Bay, exploring ancient castles, or camping under the Northern Lights.
              </p>
              <p className="text-text-primary leading-relaxed">
                With over 200 active members and a dedicated team of volunteer leaders, we continue to inspire confidence, creativity, and community spirit in every child who joins our Highland adventures.
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/2 pl-0 md:pl-12 flex justify-center">
            <div className="relative group-hover:scale-105 transition-all duration-500 hover:rotate-1">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-purple-200 rounded-xl blur-lg opacity-0 group-hover:opacity-30 transition-all duration-300"></div>
              <img
                src="/assets/Today-about-page.jpg"
                alt="Modern Obanshire scouts hiking through Highland mountains"
                className="rounded-xl shadow-xl max-w-full h-auto max-h-[400px] object-contain relative z-10 hover:shadow-2xl transition-all duration-300 border-4 border-white/50"
              />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-400 rounded-full animate-bounce opacity-0 group-hover:opacity-100 transition-all duration-300" style={{animationDelay: '0.1s'}}>
                <span className="absolute inset-0 flex items-center justify-center text-white text-sm">🎯</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <style jsx>{`
    
  `}</style>
</section>

     {/* Our Values Section with Enhanced Creative Hover Effects */}
<section className="py-20 relative bg-background-beige bg-cover bg-center bg-fixed overflow-hidden">
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-10 left-10 w-3 h-3 bg-amber-400/30 rounded-full animate-float-values"></div>
    <div className="absolute top-32 right-20 w-2 h-2 bg-forest-green/30 rounded-full animate-float-values-delayed"></div>
    <div className="absolute bottom-20 left-1/4 w-4 h-4 bg-woodland-brown/20 rounded-full animate-float-values-slow"></div>
    <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-amber-400/40 rounded-full animate-float-values-reverse"></div>
    
    {/* Geometric background shapes */}
    <div className="absolute top-1/4 left-1/6 w-20 h-20 border border-amber-400/10 transform rotate-45 animate-spin-ultra-slow"></div>
    <div className="absolute bottom-1/4 right-1/6 w-16 h-16 border border-forest-green/10 transform rotate-45 animate-spin-ultra-slow-reverse"></div>
  </div>

  <div className="absolute inset-0 bg-background-beige bg-opacity-50"></div>
  
  <div className="container mx-auto px-4 relative z-10">
    <h2 className="text-4xl font-heading font-bold text-center mb-16 text-woodland-brown drop-shadow-lg animate-on-scroll opacity-0 transition-all duration-700 translate-y-8 relative group">
      The Scout Values We Live By
      <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-forest-green via-amber-400 to-woodland-brown transition-all duration-700 group-hover:w-32"></span>
      
      <span className="absolute -top-6 -left-8 text-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 animate-bounce-gentle">🏕️</span>
      <span className="absolute -top-4 -right-8 text-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200 animate-bounce-gentle">🎖️</span>
    </h2>
    
    <div className="flex flex-wrap justify-center gap-12 max-w-5xl mx-auto">
      <div className="relative group w-64 h-72 flex items-center justify-center animate-on-scroll opacity-0 transition-all duration-700 delay-100 translate-y-8">
        <div className="absolute inset-0 rounded-full border-2 border-amber-400/20 opacity-0 group-hover:opacity-100 group-hover:animate-ping-slow transition-all duration-500"></div>
        <div className="absolute inset-0 rounded-full border border-forest-green/30 opacity-0 group-hover:opacity-100 group-hover:animate-pulse-slow transition-all duration-700 delay-100"></div>
        
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-twinkle-values"></div>
        <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-forest-green rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 delay-200 animate-twinkle-values"></div>
        
        <div className="absolute inset-0 bg-white bg-opacity-90 rounded-[20px] transform rotate-45 group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(251,191,36,0.8)] group-hover:rotate-[47deg] transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 via-transparent to-forest-green/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[20px]"></div>
          
          <div className="absolute top-2 right-2 text-amber-400 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-float-symbol">🦁</div>
          
          <div className="absolute inset-0 transform -rotate-45 group-hover:-rotate-[47deg] flex flex-col items-center justify-center p-8 transition-transform duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-400/30 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse blur-sm transition-all duration-500"></div>
              
              <img
                src="/assets/courage.png"
                alt="Courage Icon"
                className="w-24 h-24 rounded-full mb-4 border-3 border-forest-green group-hover:border-amber-400 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 relative z-10"
              />
              
              <div className="absolute inset-0 border-2 border-amber-400/50 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-spin-slow transition-all duration-500"></div>
            </div>
            
            <h3 className="text-xl font-heading font-bold text-woodland-brown group-hover:text-amber-600 mb-2 transition-all duration-300 group-hover:scale-110">
              Courage
            </h3>
            <p className="text-text-primary text-sm text-center leading-relaxed group-hover:text-woodland-brown transition-colors duration-300">
              We encourage cubs to step out of their comfort zones, whether it's hiking a new trail or speaking up in a group.
            </p>
          </div>
        </div>
      </div>

      {/* Curiosity Card */}
      <div className="relative group w-64 h-72 flex items-center justify-center mt-16 animate-on-scroll opacity-0 transition-all duration-700 delay-200 translate-y-8">
        <div className="absolute inset-0 rounded-full border-2 border-forest-green/20 opacity-0 group-hover:opacity-100 group-hover:animate-ping-slow transition-all duration-500"></div>
        <div className="absolute inset-0 rounded-full border border-amber-400/30 opacity-0 group-hover:opacity-100 group-hover:animate-pulse-slow transition-all duration-700 delay-100"></div>
        
        <div className="absolute -top-4 left-4 text-forest-green text-xl opacity-0 group-hover:opacity-100 transition-all duration-500 animate-bounce-gentle">❓</div>
        <div className="absolute -bottom-4 right-4 text-amber-400 text-lg opacity-0 group-hover:opacity-100 transition-all duration-500 delay-300 animate-bounce-gentle">💡</div>
        
        <div className="absolute inset-0 bg-white bg-opacity-90 rounded-[20px] transform rotate-45 group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(34,139,34,0.8)] group-hover:rotate-[43deg] transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-bl from-forest-green/20 via-transparent to-amber-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[20px]"></div>
          
          <div className="absolute top-2 left-2 text-forest-green opacity-0 group-hover:opacity-100 transition-all duration-500 animate-float-symbol">🔍</div>
          
          <div className="absolute inset-0 transform -rotate-45 group-hover:-rotate-[43deg] flex flex-col items-center justify-center p-8 transition-transform duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-forest-green/30 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse blur-sm transition-all duration-500"></div>
              
              <img
                src="/assets/curiosity.png"
                alt="Curiosity Icon"
                className="w-24 h-24 rounded-full mb-4 border-3 border-forest-green group-hover:border-amber-400 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 relative z-10"
              />
              
              <div className="absolute inset-0 border-2 border-forest-green/50 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-spin-slow transition-all duration-500"></div>
            </div>
            
            <h3 className="text-xl font-heading font-bold text-woodland-brown group-hover:text-forest-green mb-2 transition-all duration-300 group-hover:scale-110">
              Curiosity
            </h3>
            <p className="text-text-primary text-sm text-center leading-relaxed group-hover:text-woodland-brown transition-colors duration-300">
              Our activities spark wonder, teaching cubs to explore nature, ask questions, and discover the world around them.
            </p>
          </div>
        </div>
      </div>

      {/* Community Card */}
      <div className="relative group w-64 h-72 flex items-center justify-center animate-on-scroll opacity-0 transition-all duration-700 delay-300 translate-y-8">
        <div className="absolute inset-0 rounded-full border-2 border-woodland-brown/20 opacity-0 group-hover:opacity-100 group-hover:animate-ping-slow transition-all duration-500"></div>
        <div className="absolute inset-0 rounded-full border border-amber-400/30 opacity-0 group-hover:opacity-100 group-hover:animate-pulse-slow transition-all duration-700 delay-100"></div>
        
        <div className="absolute -top-2 left-2 text-woodland-brown text-xl opacity-0 group-hover:opacity-100 transition-all duration-500 animate-bounce-gentle">👥</div>
        <div className="absolute -bottom-2 right-2 text-amber-400 text-lg opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200 animate-bounce-gentle">🤝</div>
        
        <div className="absolute inset-0 bg-white bg-opacity-90 rounded-[20px] transform rotate-45 group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(139,69,19,0.8)] group-hover:rotate-[49deg] transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-tr from-woodland-brown/20 via-transparent to-amber-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[20px]"></div>
          
          <div className="absolute bottom-2 left-2 text-woodland-brown opacity-0 group-hover:opacity-100 transition-all duration-500 animate-float-symbol">🏠</div>
          
          <div className="absolute inset-0 transform -rotate-45 group-hover:-rotate-[49deg] flex flex-col items-center justify-center p-8 transition-transform duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-woodland-brown/30 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse blur-sm transition-all duration-500"></div>
              
              <img
                src="/assets/community.png"
                alt="Community Icon"
                className="w-24 h-24 rounded-full mb-4 border-3 border-forest-green group-hover:border-amber-400 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 relative z-10"
              />
              
              <div className="absolute inset-0 border-2 border-woodland-brown/50 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-spin-slow transition-all duration-500"></div>
            </div>
            
            <h3 className="text-xl font-heading font-bold text-woodland-brown group-hover:text-amber-600 mb-2 transition-all duration-300 group-hover:scale-110">
              Community
            </h3>
            <p className="text-text-primary text-sm text-center leading-relaxed group-hover:text-woodland-brown transition-colors duration-300">
              We build strong bonds through teamwork, ensuring every cub, parent, and leader feels part of our family.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  
</section>

      {/* Our Team Section with Enhanced Creative Hover Effects */}
<section className="py-16 bg-white animate-on-scroll opacity-0 transition-all duration-700 translate-y-8 relative overflow-hidden">
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-10 left-10 text-2xl opacity-20 animate-float-team">🏕️</div>
    <div className="absolute top-20 right-20 text-xl opacity-15 animate-float-team-delayed">⭐</div>
    <div className="absolute bottom-20 left-16 text-lg opacity-25 animate-float-team-slow">🥾</div>
    <div className="absolute bottom-32 right-12 text-2xl opacity-20 animate-float-team-reverse">🔥</div>
    
    <div className="absolute top-1/4 left-8 w-16 h-16 border border-forest-green/10 rounded-full animate-drift-team"></div>
    <div className="absolute bottom-1/3 right-8 w-12 h-12 border border-woodland-brown/10 transform rotate-45 animate-drift-team-reverse"></div>
  </div>

  <div className="container mx-auto px-4 relative z-10">
    <h2 className="text-3xl font-heading font-bold text-center mb-12 text-woodland-brown relative group">
      Meet the Trailblazers of Obanshire
      <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-forest-green via-woodland-brown to-amber-400 transition-all duration-700 group-hover:w-48"></span>
      
      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 animate-bounce-gentle">👥</span>
    </h2>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="relative bg-background-beige rounded-lg shadow-md p-6 text-center group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:rotate-1 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-amber-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-200"></div>
        
        <div className="absolute top-4 right-4 w-2 h-2 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-firefly"></div>
        <div className="absolute top-8 right-8 w-1 h-1 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 delay-200 animate-firefly"></div>
        <div className="absolute top-12 right-6 w-1.5 h-1.5 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 delay-400 animate-firefly"></div>
        
        <div className="absolute top-2 left-2 text-xl opacity-0 group-hover:opacity-100 transition-all duration-500 animate-bounce-gentle">👑</div>
        
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400/30 via-orange-500/30 to-red-500/30 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-spin-slow blur-sm transition-all duration-500"></div>
          
          <img
            src="/assets/pack-leader.png"
            alt="Scout Leader Sarah"
            className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-forest-green group-hover:border-amber-400 transition-all duration-500 relative z-10 group-hover:scale-110 group-hover:rotate-6"
          />
          
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
            <div className="bg-gradient-to-br from-amber-500/80 via-orange-500/80 to-red-500/80 w-32 h-32 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-amber-400/50">
              <div className="text-center">
                <div className="text-2xl mb-1 animate-bounce-gentle">🔥</div>
                <p className="text-white text-sm font-medium">"I love campfire stories!"</p>
              </div>
            </div>
          </div>
        </div>
        
        <h3 className="text-xl font-heading font-bold text-woodland-brown group-hover:text-amber-600 transition-colors duration-300 group-hover:scale-105 transform">
          Sarah "Firefly" Thompson
        </h3>
        <p className="text-text-secondary group-hover:text-orange-600 transition-colors duration-300 font-semibold">Pack Leader</p>
        <p className="text-text-primary mt-2 group-hover:text-woodland-brown transition-colors duration-300">
          Sarah has been leading our pack for 10 years, bringing her passion for storytelling and outdoor survival skills to every adventure.
        </p>
        
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-gradient-flame rounded-lg transition-all duration-500"></div>
      </div>

      <div className="relative bg-background-beige rounded-lg shadow-md p-6 text-center group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:-rotate-1 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-forest-green via-teal-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-teal-500 to-forest-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-200"></div>
        
        <div className="absolute top-4 left-4 text-forest-green opacity-0 group-hover:opacity-100 transition-all duration-500 animate-spin-compass">🧭</div>
        <div className="absolute top-4 right-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-300 animate-float-map">📍</div>
        <div className="absolute bottom-16 left-4 text-teal-600 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-200 animate-float-map">🗺️</div>
        
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-forest-green/30 via-teal-500/30 to-blue-500/30 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse blur-sm transition-all duration-500"></div>
          
          <img
            src="/assets/Helper.jpg"
            alt="Helper James"
            className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-forest-green group-hover:border-teal-500 transition-all duration-500 relative z-10 group-hover:scale-110 group-hover:-rotate-6"
          />
          
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
            <div className="bg-gradient-to-br from-forest-green/80 via-teal-500/80 to-blue-500/80 w-32 h-32 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-teal-400/50">
              <div className="text-center">
                <div className="text-2xl mb-1 animate-spin-compass">🧭</div>
                <p className="text-white text-sm font-medium">"I'm the map expert!"</p>
              </div>
            </div>
          </div>
        </div>
        
        <h3 className="text-xl font-heading font-bold text-woodland-brown group-hover:text-teal-600 transition-colors duration-300 group-hover:scale-105 transform">
          James "Pathfinder" Carter
        </h3>
        <p className="text-text-secondary group-hover:text-forest-green transition-colors duration-300 font-semibold">Helper</p>
        <p className="text-text-primary mt-2 group-hover:text-woodland-brown transition-colors duration-300">
          James ensures no one gets lost on our hikes, with a knack for navigation and a love for teaching map skills.
        </p>
        
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-gradient-compass rounded-lg transition-all duration-500"></div>
      </div>

      <div className="relative bg-background-beige rounded-lg shadow-md p-6 text-center group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:rotate-1 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 via-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-200"></div>
        
        <div className="absolute top-3 left-3 text-purple-400 opacity-0 group-hover:opacity-100 transition-all duration-300 animate-twinkle-star">⭐</div>
        <div className="absolute top-6 right-6 text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-200 animate-twinkle-star">✨</div>
        <div className="absolute top-10 left-8 text-indigo-400 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-400 animate-twinkle-star">💫</div>
        <div className="absolute bottom-20 right-4 text-purple-300 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-300 animate-twinkle-star">🌟</div>
        
        <div className="absolute top-2 right-2 bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-all duration-500 animate-bounce-gentle">5</div>
        
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-indigo-600/30 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse-glow blur-sm transition-all duration-500"></div>
          
          <img
            src="/assets/cub-scout-5-badges.png"
            alt="Cub Scout Ellie"
            className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-forest-green group-hover:border-purple-500 transition-all duration-500 relative z-10 group-hover:scale-110 group-hover:rotate-12"
          />
          
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
            <div className="bg-gradient-to-br from-purple-500/80 via-blue-500/80 to-indigo-600/80 w-32 h-32 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-purple-400/50">
              <div className="text-center">
                <div className="text-2xl mb-1 animate-twinkle-star">🌟</div>
                <p className="text-white text-sm font-medium">"I earned 5 badges!"</p>
              </div>
            </div>
          </div>
        </div>
        
        <h3 className="text-xl font-heading font-bold text-woodland-brown group-hover:text-purple-600 transition-colors duration-300 group-hover:scale-105 transform">
          Ellie "Starlight" Brown
        </h3>
        <p className="text-text-secondary group-hover:text-indigo-600 transition-colors duration-300 font-semibold">Cub Scout</p>
        <p className="text-text-primary mt-2 group-hover:text-woodland-brown transition-colors duration-300">
          Ellie is one of our brightest cubs, always eager to earn new badges and share her love for stargazing.
        </p>
        
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-gradient-star rounded-lg transition-all duration-500"></div>
      </div>
    </div>
  </div>

  {/* Custom CSS animations */}
  <style jsx>{`
    
  `}</style>
</section>

      {/* Call to Action Section */}
      <section className="py-16 bg-forest-green text-white text-center animate-on-scroll opacity-0 transition-all duration-700 translate-y-8">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold mb-6">Be Part of Our Story</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Whether you’re a cub ready for adventure, a parent wanting to help, or a leader eager to inspire, Obanshire Cub Scouts welcomes you.
          </p>
          <Link
            to="/login"
            className="btn bg-white text-woodland-brown hover:bg-forest-green hover:text-white border-2 border-white px-6 py-3 rounded-md inline-block transition-colors duration-200"
          >
            Join Our Pack Today
          </Link>
        </div>
      </section>
      <div className="fixed bottom-8 right-8 z-20">
        <a
          href="tel:+441234567890"
          className="flex items-center justify-center w-16 h-16 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark transition-colors duration-300 transform hover:scale-110"
        >
          <Phone className="h-6 w-6" />
        </a>
      </div>
      <ScrollToTopButton />
    </div>
  )
}

export default AboutPage