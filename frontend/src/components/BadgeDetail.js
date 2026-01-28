"use client";

const BadgeDetail = ({ badge, onBack }) => {
  return (
    <div className="bg-white rounded-2xl shadow-custom p-6 mx-auto max-w-4xl">
      <button
        onClick={onBack}
        className="flex items-center text-woodland-brown hover:text-forest-green transition-colors mb-6 group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mr-2 group-hover:-translate-x-1 transition-transform"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Back to All Badges
      </button>

      <div className="md:flex items-center">
        <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
          {badge.imageUrl ? (
            <img
              src={`http://localhost:5000${badge.imageUrl}`}
              alt={badge.name}
              className="object-contain h-64 w-full rounded-xl transition-transform hover:scale-105 duration-300"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/placeholder-badge.png";
              }}
            />
          ) : (
            <div className="w-64 h-64 rounded-xl bg-forest-green flex items-center justify-center text-white text-6xl font-bold transition-colors hover:bg-primary">
              <span>{badge.name.charAt(0)}</span>
            </div>
          )}
        </div>

        <div className="md:w-2/3 md:pl-8">
          <h2 className="text-3xl font-heading font-bold text-woodland-brown mb-4 drop-shadow">{badge.name}</h2>
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="inline-block bg-forest-green/20 text-forest-green px-4 py-2 rounded-full text-sm font-medium transition-colors hover:bg-forest-green/40">
              {badge.category}
            </span>
            <div className="inline-block bg-autumn-brown/10 text-autumn-brown px-4 py-2 rounded-full text-sm font-medium transition-colors hover:bg-autumn-brown/20">
              Difficulty: {Array(badge.difficultyLevel).fill("★").join("")}
            </div>
          </div>
          <p className="text-text-secondary mb-6 text-lg">{badge.description}</p>
        </div>
      </div>

      <div className="p-6 mt-6 bg-background-beige/50 rounded-xl">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-4 rounded-lg shadow-inner">
            <h3 className="text-2xl font-heading font-bold text-woodland-brown mb-4 border-b-2 border-forest-green/20 pb-2">
              Requirements
            </h3>
            {badge.requirements && badge.requirements.length > 0 ? (
              <ol className="list-decimal pl-6 space-y-3">
                {badge.requirements.map((requirement, index) => (
                  <li key={index} className="text-text-primary text-lg">
                    {requirement}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-text-secondary italic text-lg">No specific requirements listed for this badge.</p>
            )}
          </div>

          <div className="p-4 rounded-lg shadow-inner">
            <h3 className="text-2xl font-heading font-bold text-woodland-brown mb-4 border-b-2 border-forest-green/20 pb-2">
              Suggested Activities
            </h3>
            {badge.activities && badge.activities.length > 0 ? (
              <ul className="list-disc pl-6 space-y-3">
                {badge.activities.map((activity, index) => (
                  <li key={index} className="text-text-primary text-lg">
                    {activity}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-text-secondary italic text-lg">No suggested activities listed for this badge.</p>
            )}
          </div>
        </div>

        {badge.resources && badge.resources.length > 0 && (
          <div className="mt-8 p-4 rounded-lg shadow-inner">
            <h3 className="text-2xl font-heading font-bold text-woodland-brown mb-4 border-b-2 border-forest-green/20 pb-2">
              Resources
            </h3>
            <ul className="grid md:grid-cols-2 gap-4">
              {badge.resources.map((resource) => (
                <li key={resource.id} className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-forest-green mr-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-forest-green hover:text-primary-dark text-lg transition-colors"
                  >
                    {resource.title} <span className="text-text-secondary text-base">({resource.type})</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default BadgeDetail;