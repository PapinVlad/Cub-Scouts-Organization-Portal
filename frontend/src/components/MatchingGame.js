import { useState, useEffect, useCallback } from "react";

const EnhancedMatchingGame = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [gameState, setGameState] = useState('menu'); // menu, playing, completed, paused
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [hintCards, setHintCards] = useState([]);
  const [combo, setCombo] = useState(0);
  const [particles, setParticles] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  const badgeEmojis = [
    "🏃", "🍳", "📚", "🔥", "🌍", "🥋", 
    "🏕️", "🎯", "🚀", "⚽", "🎨", "🎵",
    "🔬", "🌳", "💻", "📸", "🏊", "🧗"
  ];

  const difficulties = {
    1: { pairs: 6, time: 120, name: "Rookie" },
    2: { pairs: 8, time: 100, name: "Scout" },
    3: { pairs: 10, time: 80, name: "Expert" },
    4: { pairs: 12, time: 60, name: "Master" }
  };

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const initializeGame = (difficulty = level) => {
    const config = difficulties[difficulty];
    const selectedEmojis = badgeEmojis.slice(0, config.pairs);
    const duplicatedCards = [...selectedEmojis, ...selectedEmojis]
      .map((emoji, index) => ({ 
        id: index, 
        emoji, 
        matched: false,
        isNew: true
      }))
      .sort(() => Math.random() - 0.5);

    setCards(duplicatedCards);
    setFlipped([]);
    setMatched([]);
    setDisabled(false);
    setMoves(0);
    setTimeLeft(config.time);
    setStreak(0);
    setCombo(0);
    setGameState('playing');
    setShowHint(false);
    setHintCards([]);
    setParticles([]);
    setLevel(difficulty);

    // Show cards for memory on mobile
    setTimeout(() => {
      setCards(prev => prev.map(card => ({ ...card, isNew: false })));
    }, isMobile ? 3000 : 2000);
  };

  const createParticle = (x, y, color = '#FFD700') => {
    const newParticle = {
      id: Date.now() + Math.random(),
      x, y, color,
      vx: (Math.random() - 0.5) * 10,
      vy: Math.random() * -8 - 2,
      life: 1
    };
    setParticles(prev => [...prev, newParticle]);
  };

  const handleCardClick = (id) => {
    if (disabled || flipped.includes(id) || matched.includes(id) || gameState !== 'playing') return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setDisabled(true);
      setMoves(prev => prev + 1);

      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find(card => card.id === firstId);
      const secondCard = cards.find(card => card.id === secondId);

      if (firstCard.emoji === secondCard.emoji) {
        // Match found!
        setTimeout(() => {
          setMatched(prev => [...prev, firstId, secondId]);
          setFlipped([]);
          setDisabled(false);
          setStreak(prev => prev + 1);
          setCombo(prev => prev + 1);
          
          // Calculate points with combo and time bonus
          const timeBonus = Math.floor(timeLeft / 10);
          const comboBonus = combo * 50;
          const points = 100 + timeBonus + comboBonus;
          setScore(prev => prev + points);

          // Create particles
          const cardElement = document.getElementById(`card-${firstId}`);
          if (cardElement) {
            const rect = cardElement.getBoundingClientRect();
            for (let i = 0; i < 8; i++) {
              createParticle(rect.left + rect.width/2, rect.top + rect.height/2);
            }
          }

          // Check level completion
          if (matched.length + 2 === cards.length) {
            const finalScore = score + points + (timeLeft * 10);
            setScore(finalScore);
            setBestScore(prev => Math.max(prev, finalScore));
            setGameState('completed');
          }
        }, 500);
      } else {
        // No match
        setCombo(0);
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  const useHint = () => {
    if (showHint) return;
    
    const unmatched = cards.filter(card => !matched.includes(card.id));
    const availablePairs = [];
    
    for (let i = 0; i < unmatched.length; i++) {
      for (let j = i + 1; j < unmatched.length; j++) {
        if (unmatched[i].emoji === unmatched[j].emoji) {
          availablePairs.push([unmatched[i].id, unmatched[j].id]);
        }
      }
    }
    
    if (availablePairs.length > 0) {
      setHintCards(availablePairs[0]);
      setShowHint(true);
      setScore(prev => Math.max(0, prev - 50)); // Penalty for hint
      
      setTimeout(() => {
        setShowHint(false);
        setHintCards([]);
      }, 2000);
    }
  };

  // Timer
  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('completed');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  // Particle animation
  useEffect(() => {
    const animateParticles = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        vy: particle.vy + 0.3,
        life: particle.life - 0.03
      })).filter(particle => particle.life > 0));
    };

    const interval = setInterval(animateParticles, 16);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeLeft > 30) return 'text-green-600';
    if (timeLeft > 10) return 'text-yellow-600';
    return 'text-red-600 animate-pulse';
  };

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 flex items-center justify-center p-2 sm:p-4">
        <div className="text-center space-y-4 sm:space-y-8 animate-fadeIn w-full max-w-md sm:max-w-2xl">
          <div className="space-y-2 sm:space-y-4">
            <h1 className="text-3xl sm:text-6xl font-bold text-white drop-shadow-lg animate-bounce">
              🏅 SCOUT BADGES 🏅
            </h1>
            <p className="text-sm sm:text-xl text-purple-100 px-4">
              Test your memory! Find all matching scout badge pairs within the time limit.
            </p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 sm:p-6 space-y-3 sm:space-y-4 mx-2">
            <h3 className="text-lg sm:text-2xl font-semibold text-white">Choose Difficulty:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              {Object.entries(difficulties).map(([lvl, config]) => (
                <button
                  key={lvl}
                  onClick={() => initializeGame(parseInt(lvl))}
                  className="bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-white font-semibold transform hover:scale-105 transition-all duration-300 border-2 border-white/30 hover:border-white/60 active:scale-95"
                >
                  <div className="text-base sm:text-lg">{config.name}</div>
                  <div className="text-xs sm:text-sm opacity-80">
                    {config.pairs} pairs • {config.time}s
                  </div>
                </button>
              ))}
            </div>
          </div>

          {bestScore > 0 && (
            <div className="bg-yellow-400/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 border-2 border-yellow-400/50 mx-2">
              <div className="text-yellow-200 text-sm sm:text-base">
                🏆 Best Score: {bestScore} points
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (gameState === 'completed') {
    const isWin = matched.length === cards.length;
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 flex items-center justify-center p-2 sm:p-4">
        <div className="text-center space-y-4 sm:space-y-6 animate-fadeIn w-full max-w-md">
          <div className="text-5xl sm:text-8xl animate-bounce">
            {isWin ? '🎉' : '⏰'}
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white">
            {isWin ? 'Congratulations!' : 'Time\'s Up!'}
          </h2>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4 mx-2">
            <div className="grid grid-cols-3 gap-2 sm:gap-4 text-white">
              <div>
                <div className="text-lg sm:text-2xl font-bold">{score}</div>
                <div className="text-xs sm:text-sm opacity-80">Points</div>
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-bold">{moves}</div>
                <div className="text-xs sm:text-sm opacity-80">Moves</div>
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-bold">{streak}</div>
                <div className="text-xs sm:text-sm opacity-80">Best Streak</div>
              </div>
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3 px-2">
            {isWin && level < 4 && (
              <button
                onClick={() => initializeGame(level + 1)}
                className="w-full px-6 sm:px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-xl transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg text-sm sm:text-base"
              >
                🚀 Next Level
              </button>
            )}
            <button
              onClick={() => initializeGame(level)}
              className="w-full px-6 sm:px-8 py-3 bg-white/30 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/50 active:scale-95 transition-all duration-300 border-2 border-white/30 text-sm sm:text-base"
            >
              🔄 Play Again
            </button>
            <button
              onClick={() => setGameState('menu')}
              className="w-full px-6 sm:px-8 py-3 bg-purple-600/50 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-purple-600/70 active:scale-95 transition-all duration-300 text-sm sm:text-base"
            >
              🏠 Main Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 p-2 sm:p-4">
      {/* Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="fixed pointer-events-none"
          style={{
            left: particle.x,
            top: particle.y,
            opacity: particle.life,
            transform: `scale(${particle.life})`,
            color: particle.color,
            fontSize: isMobile ? '16px' : '20px',
            zIndex: 1000
          }}
        >
          ✨
        </div>
      ))}

      <div className="max-w-6xl mx-auto">
        {/* Top Panel */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 sm:p-4 mb-3 sm:mb-6 border border-white/20">
          <div className="flex justify-between items-center flex-wrap gap-2 sm:gap-4">
            <div className="flex items-center space-x-2 sm:space-x-6">
              <div className="text-white">
                <div className="text-lg sm:text-2xl font-bold">Level {level}</div>
                <div className="text-xs sm:text-sm opacity-80">{difficulties[level].name}</div>
              </div>
              <div className={`text-lg sm:text-2xl font-bold ${getTimeColor()}`}>
                ⏰ {formatTime(timeLeft)}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="text-white text-center">
                <div className="text-sm sm:text-xl font-bold">{score}</div>
                <div className="text-xs opacity-80">Points</div>
              </div>
              <div className="text-white text-center">
                <div className="text-sm sm:text-xl font-bold">{moves}</div>
                <div className="text-xs opacity-80">Moves</div>
              </div>
              {combo > 1 && (
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-2 sm:px-3 py-1 rounded-full text-white font-bold animate-pulse text-xs sm:text-sm">
                  🔥 x{combo}
                </div>
              )}
            </div>

            <div className="flex space-x-1 sm:space-x-2 w-full sm:w-auto">
              <button
                onClick={useHint}
                disabled={showHint}
                className="flex-1 sm:flex-none px-2 sm:px-4 py-2 bg-yellow-500/80 backdrop-blur-sm text-white rounded-xl hover:bg-yellow-500 active:scale-95 transition-all duration-300 disabled:opacity-50 text-xs sm:text-sm"
              >
                💡 Hint (-50)
              </button>
              <button
                onClick={() => setGameState('menu')}
                className="flex-1 sm:flex-none px-2 sm:px-4 py-2 bg-red-500/80 backdrop-blur-sm text-white rounded-xl hover:bg-red-500 active:scale-95 transition-all duration-300 text-xs sm:text-sm"
              >
                🏠 Menu
              </button>
            </div>
          </div>
        </div>

        {/* Game Board */}
        <div className={`grid gap-2 sm:gap-3 ${
          isMobile 
            ? cards.length <= 12 ? 'grid-cols-3' : 'grid-cols-4'
            : 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6'
        }`}>
          {cards.map((card) => {
            const isFlipped = flipped.includes(card.id) || matched.includes(card.id) || card.isNew;
            const isMatched = matched.includes(card.id);
            const isHinted = hintCards.includes(card.id) && showHint;
            
            return (
              <div
                key={card.id}
                id={`card-${card.id}`}
                className={`
                  relative aspect-square rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-500 transform hover:scale-105 active:scale-95
                  ${isMatched ? 'animate-pulse' : 
                    isHinted ? 'animate-bounce' : ''}
                  shadow-lg hover:shadow-2xl
                `}
                onClick={() => handleCardClick(card.id)}
                style={{
                  transformStyle: 'preserve-3d',
                  boxShadow: isHinted ? '0 0 20px rgba(255, 193, 7, 0.8)' : undefined,
                  minHeight: isMobile ? '60px' : '80px'
                }}
              >
                {/* Back side (hidden card) */}
                <div className={`absolute inset-0 flex items-center justify-center rounded-xl sm:rounded-2xl backface-hidden transition-transform duration-500 bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 border-2 border-white/30 ${isFlipped ? 'rotate-y-180' : ''}`}>
                  <div className={`${isMobile ? 'text-2xl' : 'text-4xl'} animate-pulse`}>🎯</div>
                </div>
                
                {/* Front side (revealed card) */}
                <div className={`absolute inset-0 flex items-center justify-center rounded-xl sm:rounded-2xl backface-hidden bg-white/95 border-2 transition-transform duration-500 ${
                  isMatched ? 'border-green-400 bg-gradient-to-br from-green-100 to-green-200' : 
                  isHinted ? 'border-yellow-400 bg-gradient-to-br from-yellow-100 to-yellow-200' : 
                  'border-white/50'
                } ${isFlipped ? '' : 'rotate-y-180'}`}>
                  <div className={`${isMobile ? 'text-3xl' : 'text-5xl'} animate-bounce-in`}>
                    {card.emoji}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-in {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }
        
        /* Mobile touch improvements */
        @media (max-width: 768px) {
          .cursor-pointer {
            cursor: default;
          }
          
          /* Prevent text selection on mobile */
          * {
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }
          
          /* Better touch targets */
          button, .cursor-pointer {
            min-height: 44px;
            min-width: 44px;
          }
        }
      `}</style>
    </div>
  );
};

export default EnhancedMatchingGame;