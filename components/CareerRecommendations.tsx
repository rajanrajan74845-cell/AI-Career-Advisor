
import React from 'react';
import type { CareerPath } from '../types';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { StarIcon } from './icons/StarIcon';

interface CareerRecommendationsProps {
  recommendations: CareerPath[];
  favorites: CareerPath[];
  onSelectCareer: (career: CareerPath) => void;
  onToggleFavorite: (career: CareerPath) => void;
  onGenerateLearningPath: () => void;
  onBack: () => void;
}

const CareerRecommendations: React.FC<CareerRecommendationsProps> = ({ recommendations, favorites, onSelectCareer, onToggleFavorite, onGenerateLearningPath, onBack }) => {
  return (
    <div className="bg-card shadow-lg rounded-xl p-6 sm:p-8 border border-slate-200/80">
      <h2 className="text-2xl font-semibold text-heading mb-2">Recommended Career Paths</h2>
      <p className="text-secondary mb-4">Based on your skills, here are a few roles that could be a great fit.</p>

      <div className="mb-6 p-4 bg-sky-50 border border-sky-200 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
            <h3 className="font-semibold text-sky-800">Want to level up your skills?</h3>
            <p className="text-sm text-sky-700 mt-1">Generate a personalized learning path based on your current skillset.</p>
        </div>
        <button
            onClick={onGenerateLearningPath}
            className="w-full sm:w-auto flex-shrink-0 bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-sky-600 transition-colors"
        >
            Create Learning Path
        </button>
      </div>

      <div className="space-y-4">
        {recommendations.map((career, index) => {
          const isFavorited = favorites.some(fav => fav.title === career.title);
          return (
            <div
              key={index}
              onClick={() => onSelectCareer(career)}
              className="group p-5 border border-slate-200 rounded-lg hover:border-primary hover:shadow-md cursor-pointer transition-all duration-300 relative"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(career);
                }}
                className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:bg-yellow-100 hover:text-yellow-500 transition-colors"
                aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
              >
                <StarIcon filled={isFavorited} />
              </button>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-10 w-10 bg-sky-100 text-primary rounded-full flex items-center justify-center">
                  <BriefcaseIcon />
                </div>
                <div className="flex-1 pr-8">
                  <h3 className="text-lg font-semibold text-heading group-hover:text-primary transition-colors">{career.title}</h3>
                  <p className="text-secondary mt-1">{career.description}</p>
                  <div className="mt-3 flex items-start gap-2 text-sm text-slate-500 bg-slate-100/70 p-3 rounded-md">
                     <div className="flex-shrink-0 pt-0.5"><LightbulbIcon /></div>
                     <p><span className="font-semibold">Why it's a match:</span> {career.relevance}</p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <button
        onClick={onBack}
        className="mt-6 text-sm font-medium text-primary hover:text-sky-600"
      >
        &larr; Back to skills
      </button>
    </div>
  );
};

export default CareerRecommendations;
