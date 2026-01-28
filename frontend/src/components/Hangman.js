import { useState, useEffect } from "react";

const ScottishHangmanGame = () => {
  const [currentWord, setCurrentWord] = useState("");
  const [currentCategory, setCurrentCategory] = useState("");
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameState, setGameState] = useState('menu'); // menu, playing, won, lost
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [hint, setHint] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');
  const [particles, setParticles] = useState([]);

  const maxWrongGuesses = 6;

  const wordCategories = {
    "Scottish Places": {
      easy: [
        { word: "GLASGOW", hint: "Scotland's largest city" },
        { word: "EDINBURGH", hint: "Capital city with a famous castle" },
        { word: "HIGHLANDS", hint: "Mountainous region in the north" },
        { word: "LOCH", hint: "Scottish word for lake" },
        { word: "ISLE", hint: "Scottish word for island" }
      ],
      medium: [
        { word: "CAIRNGORMS", hint: "National park with mountains" },
        { word: "STIRLING", hint: "Historic city with a famous castle" },
        { word: "INVERNESS", hint: "Highland capital city" },
        { word: "ABERDEENSHIRE", hint: "County known for granite" },
        { word: "HEBRIDES", hint: "Island chain off the west coast" }
      ],
      hard: [
        { word: "KIRKCUDBRIGHT", hint: "Artistic town in Dumfries" },
        { word: "AUCHTERMUCHTY", hint: "Small town in Fife" },
        { word: "ECCLEFECHAN", hint: "Village in Dumfries and Galloway" }
      ]
    },
    "Scottish Culture": {
      easy: [
        { word: "KILT", hint: "Traditional Scottish garment" },
        { word: "BAGPIPES", hint: "Traditional Scottish instrument" },
        { word: "TARTAN", hint: "Traditional Scottish pattern" },
        { word: "THISTLE", hint: "National flower of Scotland" },
        { word: "HAGGIS", hint: "Traditional Scottish dish" }
      ],
      medium: [
        { word: "CEILIDH", hint: "Traditional Scottish dance" },
        { word: "SPORRAN", hint: "Pouch worn with a kilt" },
        { word: "SHORTBREAD", hint: "Traditional Scottish biscuit" },
        { word: "NEEPS", hint: "Scottish word for turnips" },
        { word: "TATTIE", hint: "Scottish word for potato" }
      ],
      hard: [
        { word: "SGIAN DUBH", hint: "Traditional Scottish knife" },
        { word: "GHILLIE BROGUES", hint: "Traditional Scottish shoes" },
        { word: "CABER TOSS", hint: "Highland Games event" }
      ]
    },
    "Scout Skills": {
      easy: [
        { word: "KNOTS", hint: "Essential rope skills" },
        { word: "CAMP", hint: "Outdoor overnight stay" },
        { word: "FIRE", hint: "Essential for warmth and cooking" },
        { word: "COMPASS", hint: "Navigation tool" },
        { word: "BADGE", hint: "Award for skills learned" }
      ],
      medium: [
        { word: "ORIENTEERING", hint: "Navigation using map and compass" },
        { word: "PIONEERING", hint: "Building structures with poles and rope" },
        { word: "BACKWOODS", hint: "Cooking without modern equipment" },
        { word: "FIRST AID", hint: "Emergency medical skills" },
        { word: "SURVIVAL", hint: "Skills for emergency situations" }
      ],
      hard: [
        { word: "TRIANGULATION", hint: "Method of finding position" },
        { word: "BOWLINE", hint: "The king of knots" },
        { word: "DECLINATION", hint: "Compass adjustment for true north" }
      ]
    }
  };

  const difficulties = {
    easy: { name: "Cub Scout", lives: 8, scoreMultiplier: 1 },
    medium: { name: "Scout", lives: 6, scoreMultiplier: 2 },
    hard: { name: "Venture Scout", lives: 4, scoreMultiplier: 3 }
  };

  const selectRandomWord = () => {
    const categories = Object.keys(wordCategories);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const wordsInDifficulty = wordCategories[randomCategory][difficulty];
    const randomWordObj = wordsInDifficulty[Math.floor(Math.random() * wordsInDifficulty.length)];
    
    setCurrentWord(randomWordObj.word);
    setCurrentCategory(randomCategory);
    setHint(randomWordObj.hint);
  };

  const startGame = (selectedDifficulty = difficulty) => {
    setDifficulty(selectedDifficulty);
    setGuessedLetters([]);
    setWrongGuesses(0);
    setGameState('playing');
    setShowHint(false);
    setParticles([]);
    selectRandomWord();
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

  const guessLetter = (letter) => {
    if (guessedLetters.includes(letter) || gameState !== 'playing') return;

    const newGuessedLetters = [...guessedLetters, letter];
    setGuessedLetters(newGuessedLetters);

    if (currentWord.includes(letter)) {
      // Correct guess - create particles
      const wordDisplay = document.querySelector('.word-display');
      if (wordDisplay) {
        const rect = wordDisplay.getBoundingClientRect();
        for (let i = 0; i < 5; i++) {
          createParticle(rect.left + Math.random() * rect.width, rect.top + rect.height/2, '#4CAF50');
        }
      }

      // Check if word is complete
      const wordLetters = currentWord.split('').filter(char => char !== ' ');
      const isComplete = wordLetters.every(char => newGuessedLetters.includes(char));
      
      if (isComplete) {
        setGameState('won');
        const points = (currentWord.length * 10) * difficulties[difficulty].scoreMultiplier;
        setScore(prev => prev + points);
        setStreak(prev => {
          const newStreak = prev + 1;
          setBestStreak(current => Math.max(current, newStreak));
          return newStreak;
        });
      }
    } else {
      // Wrong guess
      const newWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(newWrongGuesses);
      
      if (newWrongGuesses >= difficulties[difficulty].lives) {
        setGameState('lost');
        setStreak(0);
      }
    }
  };

  const getDisplayedWord = () => {
    return currentWord
      .split('')
      .map(letter => {
        if (letter === ' ') return ' ';
        return guessedLetters.includes(letter) ? letter : '_';
      })
      .join(' ');
  };

  const getAlphabet = () => {
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  };

  const getHangmanDisplay = () => {
    const stages = [
      "🏴󠁧󠁢󠁳󠁣󠁴󠁿", // Scottish flag
      "🏰", // Castle
      "⚔️", // Sword
      "🛡️", // Shield
      "👑", // Crown
      "💀", // Skull
    ];
    
    const livesLeft = difficulties[difficulty].lives - wrongGuesses;
    const stageIndex = Math.max(0, stages.length - livesLeft - 1);
    return stages[stageIndex] || "🏴󠁧󠁢󠁳󠁣󠁴󠁿";
  };

  // Animate particles
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

  // Auto-select word when difficulty changes
  useEffect(() => {
    if (gameState === 'playing') {
      selectRandomWord();
    }
  }, [difficulty]);

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-indigo-900 flex items-center justify-center p-2 sm:p-4">
        <div className="text-center space-y-4 sm:space-y-8 animate-fadeIn w-full max-w-md sm:max-w-2xl">
          <div className="space-y-2 sm:space-y-4">
            <div className="text-4xl sm:text-6xl animate-bounce mb-4">🏴󠁧󠁢󠁳󠁣󠁴󠁿</div>
            <h1 className="text-3xl sm:text-6xl font-bold text-white drop-shadow-lg">
              SCOTTISH SCOUT
            </h1>
            <h2 className="text-2xl sm:text-4xl font-bold text-yellow-300 drop-shadow-lg">
              HANGMAN
            </h2>
            <p className="text-sm sm:text-xl text-blue-100 px-4">
              Test your knowledge of Scottish culture, places, and scout skills!
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-6 space-y-3 sm:space-y-4 mx-2 border border-white/20">
            <h3 className="text-lg sm:text-2xl font-semibold text-white">Choose Your Rank:</h3>
            <div className="grid grid-cols-1 gap-2 sm:gap-4">
              {Object.entries(difficulties).map(([level, config]) => (
                <button
                  key={level}
                  onClick={() => startGame(level)}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-white font-semibold transform hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white/30 hover:border-white/60"
                >
                  <div className="text-base sm:text-lg">{config.name}</div>
                  <div className="text-xs sm:text-sm opacity-80">
                    {config.lives} lives • {config.scoreMultiplier}x points
                  </div>
                </button>
              ))}
            </div>
          </div>

          {bestStreak > 0 && (
            <div className="bg-yellow-400/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 border-2 border-yellow-400/50 mx-2">
              <div className="text-yellow-200 text-sm sm:text-base">
                🏆 Best Streak: {bestStreak} words
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (gameState === 'won' || gameState === 'lost') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 flex items-center justify-center p-2 sm:p-4">
        <div className="text-center space-y-4 sm:space-y-6 animate-fadeIn w-full max-w-md">
          <div className="text-5xl sm:text-8xl animate-bounce">
            {gameState === 'won' ? '🎉' : '💀'}
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white">
            {gameState === 'won' ? 'Well Done, Scout!' : 'Better Luck Next Time!'}
          </h2>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4 mx-2">
            <div className="text-white">
              <div className="text-lg sm:text-xl font-bold mb-2">The word was:</div>
              <div className="text-2xl sm:text-3xl font-bold text-yellow-300 mb-2">{currentWord}</div>
              <div className="text-sm sm:text-base opacity-80 italic">"{hint}"</div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 sm:gap-4 text-white pt-4 border-t border-white/20">
              <div>
                <div className="text-lg sm:text-2xl font-bold">{score}</div>
                <div className="text-xs sm:text-sm opacity-80">Score</div>
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-bold">{streak}</div>
                <div className="text-xs sm:text-sm opacity-80">Streak</div>
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-bold">{bestStreak}</div>
                <div className="text-xs sm:text-sm opacity-80">Best</div>
              </div>
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3 px-2">
            <button
              onClick={() => startGame(difficulty)}
              className="w-full px-6 sm:px-8 py-3 bg-blue-600 text-white font-bold rounded-xl transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg text-sm sm:text-base"
            >
              🔄 Play Again
            </button>
            <button
              onClick={() => setGameState('menu')}
              className="w-full px-6 sm:px-8 py-3 bg-white/30 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/50 active:scale-95 transition-all duration-300 border-2 border-white/30 text-sm sm:text-base"
            >
              🏠 Main Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-blue-900 to-purple-900 p-2 sm:p-4">
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
            fontSize: '20px',
            zIndex: 1000
          }}
        >
          ✨
        </div>
      ))}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 border border-white/20">
          <div className="flex justify-between items-center flex-wrap gap-2 sm:gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="text-3xl sm:text-4xl">{getHangmanDisplay()}</div>
              <div className="text-white">
                <div className="text-lg sm:text-xl font-bold">{difficulties[difficulty].name}</div>
                <div className="text-xs sm:text-sm opacity-80">{currentCategory}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="text-white text-center">
                <div className="text-sm sm:text-lg font-bold">{score}</div>
                <div className="text-xs opacity-80">Score</div>
              </div>
              <div className="text-white text-center">
                <div className="text-sm sm:text-lg font-bold">{streak}</div>
                <div className="text-xs opacity-80">Streak</div>
              </div>
              <div className="flex items-center space-x-1">
                {Array.from({length: difficulties[difficulty].lives}, (_, i) => (
                  <div key={i} className={`text-xl ${i < wrongGuesses ? 'opacity-30' : ''}`}>
                    ❤️
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Word Display */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-8 mb-4 sm:mb-6 text-center border border-white/20">
          <div className="word-display text-2xl sm:text-5xl font-bold text-white tracking-wider mb-4 font-mono">
            {getDisplayedWord()}
          </div>
          
          <div className="flex justify-center space-x-2 sm:space-x-4">
            <button
              onClick={() => setShowHint(!showHint)}
              className="px-3 sm:px-4 py-2 bg-yellow-500/80 backdrop-blur-sm text-white rounded-xl hover:bg-yellow-500 active:scale-95 transition-all duration-300 text-xs sm:text-sm"
            >
              💡 {showHint ? 'Hide' : 'Show'} Hint
            </button>
            <button
              onClick={() => setGameState('menu')}
              className="px-3 sm:px-4 py-2 bg-red-500/80 backdrop-blur-sm text-white rounded-xl hover:bg-red-500 active:scale-95 transition-all duration-300 text-xs sm:text-sm"
            >
              🏠 Menu
            </button>
          </div>
          
          {showHint && (
            <div className="mt-4 p-3 bg-yellow-400/20 rounded-xl border border-yellow-400/50 animate-fadeIn">
              <div className="text-yellow-200 text-sm sm:text-base italic">💡 {hint}</div>
            </div>
          )}
        </div>

        {/* Alphabet */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-white/20">
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-13 gap-1 sm:gap-2">
            {getAlphabet().map(letter => {
              const isGuessed = guessedLetters.includes(letter);
              const isCorrect = isGuessed && currentWord.includes(letter);
              const isWrong = isGuessed && !currentWord.includes(letter);
              
              return (
                <button
                  key={letter}
                  onClick={() => guessLetter(letter)}
                  disabled={isGuessed}
                  className={`
                    aspect-square rounded-lg font-bold text-xs sm:text-base transition-all duration-300 transform hover:scale-105 active:scale-95
                    ${isCorrect ? 'bg-green-500 text-white' : 
                      isWrong ? 'bg-red-500 text-white opacity-50' :
                      'bg-white/20 hover:bg-white/30 text-white'}
                    ${isGuessed ? 'cursor-not-allowed' : 'cursor-pointer'}
                    border border-white/30
                  `}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
        
        /* Mobile improvements */
        @media (max-width: 768px) {
          .cursor-pointer {
            cursor: default;
          }
          
          * {
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }
          
          button {
            min-height: 40px;
          }
        }
      `}</style>
    </div>
  );
};

export default ScottishHangmanGame;
