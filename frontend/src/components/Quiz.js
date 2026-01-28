"use client";

import { useState, useEffect } from "react";

const QuizGame = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [result, setResult] = useState(null);

  const questions = [
    {
      question: "What activity do you enjoy most?",
      options: [
        { text: "Exploring nature", score: { outdoor: 2, nature: 2 } },
        { text: "Building things", score: { craft: 2, skill: 1 } },
        { text: "Learning new skills", score: { skill: 2, leadership: 1 } },
        { text: "Helping others", score: { community: 2, leadership: 1 } },
      ],
    },
    {
      question: "How do you like to spend your free time?",
      options: [
        { text: "Hiking or camping", score: { outdoor: 2, nature: 1 } },
        { text: "Crafting or art", score: { craft: 2, skill: 1 } },
        { text: "Reading or studying", score: { skill: 2, knowledge: 1 } },
        { text: "Organizing games", score: { leadership: 2, community: 1 } },
      ],
    },
    {
      question: "What kind of challenge excites you?",
      options: [
        { text: "Surviving in the wild", score: { outdoor: 2, nature: 1 } },
        { text: "Creating a project", score: { craft: 2, skill: 1 } },
        { text: "Solving puzzles", score: { skill: 2, knowledge: 1 } },
        { text: "Leading a team", score: { leadership: 2, community: 1 } },
      ],
    },
    {
      question: "Which environment do you prefer?",
      options: [
        { text: "Forests or mountains", score: { outdoor: 2, nature: 2 } },
        { text: "Workshop or studio", score: { craft: 2, skill: 1 } },
        { text: "Library or classroom", score: { skill: 2, knowledge: 1 } },
        { text: "Community center", score: { community: 2, leadership: 1 } },
      ],
    },
    {
      question: "What skill would you like to improve?",
      options: [
        { text: "Navigation", score: { outdoor: 2, nature: 1 } },
        { text: "Handcrafting", score: { craft: 2, skill: 1 } },
        { text: "Problem-solving", score: { skill: 2, knowledge: 1 } },
        { text: "Teamwork", score: { leadership: 2, community: 1 } },
      ],
    },
    {
      question: "How do you handle group tasks?",
      options: [
        { text: "I lead the group", score: { leadership: 2, community: 1 } },
        { text: "I contribute ideas", score: { skill: 2, knowledge: 1 } },
        { text: "I build something for the group", score: { craft: 2, skill: 1 } },
        { text: "I explore options", score: { outdoor: 2, nature: 1 } },
      ],
    },
    {
      question: "What motivates you?",
      options: [
        { text: "Adventure", score: { outdoor: 2, nature: 1 } },
        { text: "Creativity", score: { craft: 2, skill: 1 } },
        { text: "Knowledge", score: { skill: 2, knowledge: 1 } },
        { text: "Helping others", score: { community: 2, leadership: 1 } },
      ],
    },
    {
      question: "Which role suits you best?",
      options: [
        { text: "Explorer", score: { outdoor: 2, nature: 2 } },
        { text: "Maker", score: { craft: 2, skill: 1 } },
        { text: "Thinker", score: { skill: 2, knowledge: 1 } },
        { text: "Leader", score: { leadership: 2, community: 1 } },
      ],
    },
    {
      question: "What do you value most?",
      options: [
        { text: "Nature", score: { outdoor: 2, nature: 2 } },
        { text: "Creativity", score: { craft: 2, skill: 1 } },
        { text: "Learning", score: { skill: 2, knowledge: 1 } },
        { text: "Team spirit", score: { community: 2, leadership: 1 } },
      ],
    },
    {
      question: "How do you approach a new task?",
      options: [
        { text: "With curiosity to explore", score: { outdoor: 2, nature: 1 } },
        { text: "By creating a plan", score: { craft: 2, skill: 1 } },
        { text: "With research", score: { skill: 2, knowledge: 1 } },
        { text: "By organizing others", score: { leadership: 2, community: 1 } },
      ],
    },
  ];

  const handleAnswer = (score) => {
    setAnswers([...answers, score]);
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult();
      setGameCompleted(true);
    }
  };

  const calculateResult = () => {
    const scores = {
      outdoor: 0,
      nature: 0,
      craft: 0,
      skill: 0,
      knowledge: 0,
      leadership: 0,
      community: 0,
    };

    answers.forEach((answer) => {
      Object.keys(scores).forEach((key) => {
        scores[key] += answer[key] || 0;
      });
    });

    const maxScore = Math.max(...Object.values(scores));
    const topCategories = Object.keys(scores).filter((key) => scores[key] === maxScore);

    let recommendedBadge;
    if (topCategories.includes("outdoor") || topCategories.includes("nature")) {
      recommendedBadge = "Outdoor Adventurer Badge";
    } else if (topCategories.includes("craft")) {
      recommendedBadge = "Craftsmanship Badge";
    } else if (topCategories.includes("skill") || topCategories.includes("knowledge")) {
      recommendedBadge = "Skill Master Badge";
    } else if (topCategories.includes("leadership") || topCategories.includes("community")) {
      recommendedBadge = "Leadership Badge";
    } else {
      recommendedBadge = "All-Around Scout Badge";
    }

    setResult({ badge: recommendedBadge, score: maxScore });
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setGameCompleted(false);
    setResult(null);
  };

  useEffect(() => {
    if (gameCompleted) {
      const confettiContainer = document.createElement("div");
      confettiContainer.className = "confetti-container";
      confettiContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1000;
      `;
      document.body.appendChild(confettiContainer);

      const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96c93d", "#f7d94c", "#ff9ff3", "#54a0ff"];
      const confettiCount = 100;

      for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement("div");
        confetti.style.cssText = `
          position: absolute;
          width: 10px;
          height: 10px;
          background: ${colors[Math.floor(Math.random() * colors.length)]};
          left: ${Math.random() * 100}%;
          animation: confetti-fall ${Math.random() * 3 + 2}s linear infinite;
          animation-delay: ${Math.random() * 2}s;
          transform: rotate(${Math.random() * 360}deg);
        `;
        confettiContainer.appendChild(confetti);
      }

      const style = document.createElement("style");
      style.textContent = `
        @keyframes confetti-fall {
          to {
            transform: translateY(100vh) rotate(720deg);
          }
        }
      `;
      document.head.appendChild(style);

      setTimeout(() => {
        confettiContainer.remove();
        style.remove();
      }, 6000);

      return () => {
        if (confettiContainer.parentNode) confettiContainer.remove();
        if (style.parentNode) style.remove();
      };
    }
  }, [gameCompleted]);

  const getOptionColors = (index) => {
    const colorSets = [
      "from-pink-400 via-purple-400 to-indigo-400",
      "from-yellow-400 via-orange-400 to-red-400", 
      "from-green-400 via-blue-400 to-purple-400",
      "from-cyan-400 via-teal-400 to-green-400"
    ];
    return colorSets[index % colorSets.length];
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-indigo-900 p-4 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-300 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-32 right-20 w-24 h-24 bg-pink-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-blue-300 rounded-full opacity-20 animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 right-32 w-28 h-28 bg-green-300 rounded-full opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-4xl w-full mx-auto relative z-10">
        {!gameCompleted ? (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl font-black bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent animate-pulse">
                🏆 SCOUT QUIZ 🏆
              </h1>
              <p className="text-2xl text-white font-bold animate-bounce">
                Find your perfect badge!
              </p>
            </div>

            <div className="w-full bg-gray-700 rounded-full h-4 shadow-lg">
              <div 
                className="bg-gradient-to-r from-pink-500 to-yellow-500 h-4 rounded-full transition-all duration-500 ease-out shadow-lg"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {/* Question card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="mb-8">
                <div className="text-3xl font-bold text-white mb-4">
                  Question {currentQuestion + 1} of {questions.length}
                </div>
                <h2 className="text-3xl font-bold text-yellow-300 leading-tight">
                  {questions[currentQuestion].question}
                </h2>
              </div>

              <div className="grid gap-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option.score)}
                    className={`group relative overflow-hidden p-6 rounded-2xl bg-gradient-to-r ${getOptionColors(index)} text-white font-bold text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl transform-gpu`}
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      animation: 'slideIn 0.5s ease-out forwards'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    <span className="relative z-10 flex items-center justify-center space-x-3">
                      <span className="text-2xl">
                        {index === 0 ? '🌟' : index === 1 ? '🚀' : index === 2 ? '⚡' : '🎯'}
                      </span>
                      <span>{option.text}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-8">
            {/* Result card */}
            <div className="bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-400 rounded-3xl p-12 shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="space-y-6">
                <div className="text-8xl animate-bounce">🏆</div>
                <h2 className="text-5xl font-black text-white drop-shadow-lg">
                  CONGRATULATIONS!
                </h2>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                  <p className="text-3xl font-bold text-white mb-4">
                    Your perfect badge:
                  </p>
                  <h3 className="text-4xl font-black text-yellow-100 drop-shadow-lg">
                    {result.badge}
                  </h3>
                  <p className="text-xl text-white mt-4">
                    Score: {result.score} points! 🎉
                  </p>
                </div>
                
                <div className="space-y-4">
                  <p className="text-xl text-white font-semibold">
                    Want to learn more about badges?{" "}
                    <a href="/badges" className="text-yellow-200 hover:text-yellow-100 underline decoration-wavy decoration-2 underline-offset-4 transition-colors">
                      Visit the badges page! 🔗
                    </a>
                  </p>
                  
                  <button
                    onClick={restartQuiz}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-2xl text-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    🔄 Take Quiz Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default QuizGame;