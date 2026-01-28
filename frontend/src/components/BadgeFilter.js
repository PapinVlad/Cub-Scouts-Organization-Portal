"use client";

import { useState } from "react";

const BadgeFilter = ({ categories, onSearch, onCategoryChange, onDifficultyChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    onCategoryChange(category);
  };

  const handleDifficultyChange = (e) => {
    const difficulty = e.target.value;
    setSelectedDifficulty(difficulty);
    onDifficultyChange(difficulty);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedDifficulty("");
    onSearch("");
    onCategoryChange("");
    onDifficultyChange("");
  };

  return (
    <div className="bg-white rounded-xl shadow-custom p-6 mb-12">
      <div className="md:flex md:items-center md:space-x-6">
        <div className="mb-6 md:mb-0 md:flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-text-secondary"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search badges..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="block w-full pl-12 pr-4 py-3 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-forest-green transition-all duration-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="block w-full py-3 px-4 border border-border-light rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-forest-green transition-all duration-300"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedDifficulty}
              onChange={handleDifficultyChange}
              className="block w-full py-3 px-4 border border-border-light rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-forest-green transition-all duration-300"
            >
              <option value="">All Difficulties</option>
              <option value="1">★ Very Easy</option>
              <option value="2">★★ Easy</option>
              <option value="3">★★★ Moderate</option>
              <option value="4">★★★★ Challenging</option>
              <option value="5">★★★★★ Very Challenging</option>
            </select>
          </div>

          <div>
            <button
              onClick={handleClearFilters}
              className="w-full py-3 px-6 border border-transparent rounded-lg bg-woodland-brown text-white hover:bg-forest-green focus:outline-none focus:ring-2 focus:ring-woodland-brown transition-all duration-300 shadow-custom hover:shadow-custom-hover"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgeFilter;