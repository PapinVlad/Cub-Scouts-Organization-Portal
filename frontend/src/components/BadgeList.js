"use client";

const BadgeList = ({ badges, onBadgeSelect }) => {
  if (!badges || !Array.isArray(badges)) {
    console.error("BadgeList: badges is not an array:", badges);
    return <div className="text-center py-12 text-text-secondary">No badges available</div>;
  }

  if (badges.length === 0) {
    return <div className="text-center py-12 text-text-secondary">No badges match your criteria</div>;
  }

  return (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12">
    {badges.map((badge, index) => (
      <div
        key={badge.id}
        className="relative bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100 hover:border-forest-green/30"
        onClick={() => onBadgeSelect(badge.id)}
        style={{
          animationDelay: `${index * 0.05}s`
        }}
      >
        {badge.isEarned && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-md z-10">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
            </svg>
          </div>
        )}

        <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center rounded-lg mb-4 overflow-hidden group-hover:bg-gradient-to-br group-hover:from-forest-green/5 group-hover:to-sage-green/10 transition-all duration-300">
          {badge.imageUrl ? (
            <img
              src={`http://localhost:5000${badge.imageUrl}`}
              alt={badge.name}
              className="object-contain h-full w-full transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                console.error(`Error loading badge image: ${e.target.src}`);
                e.target.onerror = null;
                e.target.src = "/placeholder-badge.png";
              }}
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-forest-green flex items-center justify-center text-white text-2xl font-bold transition-colors duration-300 group-hover:bg-sage-green">
              <span>{badge.name ? badge.name.charAt(0) : "?"}</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 rounded-lg"></div>
        </div>

        <div className="text-center space-y-2">
          <h3 className="font-heading font-semibold text-lg text-woodland-brown group-hover:text-forest-green transition-colors duration-300">
            {badge.name || "Unnamed"}
          </h3>
          
          <div className="inline-flex items-center">
            <span className="bg-forest-green/10 text-forest-green px-3 py-1 rounded-full text-sm font-medium group-hover:bg-forest-green/20 transition-colors duration-300">
              {badge.category || "Uncategorized"}
            </span>
          </div>
          
          <div className="flex justify-center items-center space-x-1 pt-1">
            {Array.from({ length: 5 }, (_, i) => (
              <span
                key={i}
                className={`text-sm transition-colors duration-200 ${
                  i < (badge.difficultyLevel || 0)
                    ? 'text-amber-400'
                    : 'text-gray-300'
                }`}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-forest-green to-sage-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-b-xl"></div>
        
        <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-forest-green/0 to-forest-green/0 group-hover:from-forest-green/5 group-hover:to-transparent transition-all duration-300 pointer-events-none"></div>
      </div>
    ))}
  </div>
);
};

export default BadgeList;