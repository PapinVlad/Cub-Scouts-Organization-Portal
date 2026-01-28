"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import EnhancedMatchingGame from "../components/MatchingGame";
import QuizGame from "../components/Quiz";
import ScrollToTopButton from "../components/ScrollToTopButton";
import ScottishHangmanGame from "../components/Hangman";
import {  Phone } from "lucide-react"

const GamesPage = () => {
  const [hoveredGame, setHoveredGame] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const navigate = useNavigate();

  const games = [
    {
      id: "matching",
      title: "Matching Game",
      description: "Test your memory by matching pairs of scout badges and symbols.",
      icon: "🎮",
      color: "bg-forest-green",
      component: <EnhancedMatchingGame />,
    },
    {
      id: "hangman",
      title: "Hangman",
      description: "Guess the scout-related words before you run out of attempts.",
      icon: "🎯",
      color: "bg-woodland-brown",
      component: <ScottishHangmanGame />,
    },
    {
      id: "quiz",
      title: "Scout Quiz",
      description: "Test your knowledge about scouting with our interactive quiz.",
      icon: "🧠",
      color: "bg-scout-green-dark",
      component: <QuizGame />,
    },
  ];

  const handlePlayGame = (gameId) => {
    const game = games.find((g) => g.id === gameId);
    if (game && !game.comingSoon) {
      setSelectedGame(gameId);
    }
  };

  const handleBackToGames = () => {
    setSelectedGame(null);
  };

  if (selectedGame) {
    const game = games.find((g) => g.id === selectedGame);

    return (
      <div
        className="min-h-screen bg-background-beige pt-20 pb-12 relative game-board"
        
      >
        {/* Затемнённый оверлей */}
        <div className="absolute inset-0 bg-black bg-opacity-10  z-0"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <button
            onClick={handleBackToGames}
            className="mb-8 flex items-center text-white hover:text-forest-green transition-all duration-300 animate-slide-in"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 transform hover:-translate-x-1 transition-transform"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Games
          </button>

          <div className="bg-background-beige rounded-2xl shadow-lg overflow-hidden border-4 border-forest-green animate-zoom-in">
            <div className={`${game.color} h-4 w-full`}></div>
            <div className="p-8">
              <div className="flex items-center mb-6">
                <span className="text-5xl mr-6">{game.icon}</span>
                <h2 className="text-3xl font-accent font-bold text-woodland-brown">{game.title}</h2>
              </div>
              {game.component}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
     

      <div
        className="min-h-screen bg-background-beige pt-20 pb-12 relative game-board"
       
      >
        <div className="absolute inset-0 bg-black bg-opacity-10 backdrop-blur-sm z-0"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12 animate-slide-in">
            <h1 className="text-5xl font-accent font-bold text-white mb-4">
              Cub Scout Games
            </h1>
            <p className="text-xl text-white max-w-2xl mx-auto opacity-90">
              Play interactive games related to Cub Scouts. Learn while having fun!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {games.map((game) => (
              <div
                key={game.id}
                className="game-card bg-background-beige rounded-2xl overflow-hidden border-2 border-forest-green animate-slide-in"
                onMouseEnter={() => setHoveredGame(game.id)}
                onMouseLeave={() => setHoveredGame(null)}
              >
                <div className={`${game.color} h-4 w-full`}></div>
                <div className="p-6">
                  <div className="flex items-center mb-6">
                    <span className="text-5xl mr-6">{game.icon}</span>
                    <h2 className="text-2xl font-accent font-bold text-woodland-brown">{game.title}</h2>
                  </div>
                  <p className="text-woodland-brown mb-6 font-sans">{game.description}</p>
                  <div className="flex items-center justify-between">
                    {game.comingSoon ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 animate-pulse">
                        Coming Soon!
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 animate-pulse">
                        Ready to Play
                      </span>
                    )}
                    <button
                      onClick={() => handlePlayGame(game.id)}
                      className={`game-button text-sm font-sans transition-all duration-300 ${
                        game.comingSoon
                          ? "text-gray-400 cursor-not-allowed"
                          : hoveredGame === game.id
                          ? "text-forest-green"
                          : "text-woodland-brown"
                      }`}
                      disabled={game.comingSoon}
                    >
                      Play Game
                      <ArrowRight
                        className={`ml-1 h-4 w-4 transition-transform duration-300 ${
                          hoveredGame === game.id && !game.comingSoon ? "transform translate-x-2" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

         
        </div>
        
      </div>
       <section className="py-16 bg-forest-green text-white text-center animate-on-scroll  transition-all duration-700 translate-y-8">
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
      {/* Call to Action Section */}
            <ScrollToTopButton />
    </>
  );
};

export default GamesPage;