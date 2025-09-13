
import React, { useState } from 'react';
import type { CareerDetails as CareerDetailsType, CareerPath } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { StarIcon } from './icons/StarIcon';

interface CareerDetailsProps {
  career: CareerPath | null;
  details: CareerDetailsType | null;
  isLoading: boolean;
  onBack: () => void;
  favorites: CareerPath[];
  onToggleFavorite: (career: CareerPath) => void;
}

type Tab = 'overview' | 'skills' | 'path' | 'interview';

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm sm:text-base font-medium rounded-md transition-colors ${
            active
                ? 'bg-primary text-white'
                : 'text-secondary hover:bg-slate-200'
        }`}
    >
        {children}
    </button>
);


const CareerDetails: React.FC<CareerDetailsProps> = ({ career, details, isLoading, onBack, favorites, onToggleFavorite }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  if (isLoading || !details || !career) {
    return <LoadingSpinner text="Building your career roadmap..." />;
  }
  
  const isFavorited = favorites.some(fav => fav.title === career.title);

  const renderTabContent = () => {
    switch (activeTab) {
        case 'overview':
            return (
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold text-heading mb-2">Summary</h3>
                        <p className="text-secondary leading-relaxed">{details.summary}</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-heading mb-3">Key Responsibilities</h3>
                        <ul className="space-y-2">
                           {details.keyResponsibilities.map((item, index) => (
                               <li key={index} className="flex items-start gap-3">
                                   <CheckCircleIcon className="flex-shrink-0 text-primary mt-1" />
                                   <span className="text-secondary">{item}</span>
                               </li>
                           ))}
                        </ul>
                    </div>
                     <div>
                        <h3 className="text-xl font-semibold text-heading mb-2">Career Outlook</h3>
                        <p className="text-secondary leading-relaxed">{details.careerOutlook}</p>
                    </div>
                </div>
            );
        case 'skills':
            return (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-xl font-semibold text-heading mb-3">Technical Skills</h3>
                         <ul className="space-y-2">
                           {details.requiredSkills.technical.map((item, index) => (
                               <li key={index} className="flex items-start gap-3">
                                   <CheckCircleIcon className="flex-shrink-0 text-primary mt-1" />
                                   <span className="text-secondary">{item}</span>
                               </li>
                           ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-heading mb-3">Soft Skills</h3>
                         <ul className="space-y-2">
                           {details.requiredSkills.soft.map((item, index) => (
                               <li key={index} className="flex items-start gap-3">
                                   <CheckCircleIcon className="flex-shrink-0 text-primary mt-1" />
                                   <span className="text-secondary">{item}</span>
                               </li>
                           ))}
                        </ul>
                    </div>
                </div>
            )
        case 'path':
            return (
                <div>
                    <h3 className="text-xl font-semibold text-heading mb-4">Recommended Learning Path</h3>
                    <div className="space-y-4">
                        {details.learningPath.map((item, index) => (
                            <div key={index} className="p-4 bg-slate-100/70 rounded-lg">
                                <h4 className="font-semibold text-heading">{index + 1}. {item.step}</h4>
                                <p className="text-secondary mt-1 text-sm">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )
        case 'interview':
             return (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-xl font-semibold text-heading mb-3">Behavioral Questions</h3>
                        <ul className="space-y-2 list-disc list-inside text-secondary">
                           {details.interviewQuestions.behavioral.map((item, index) => (
                               <li key={index}>{item}</li>
                           ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-heading mb-3">Technical Questions</h3>
                        <ul className="space-y-2 list-disc list-inside text-secondary">
                           {details.interviewQuestions.technical.map((item, index) => (
                               <li key={index}>{item}</li>
                           ))}
                        </ul>
                    </div>
                </div>
            )
    }
  }

  return (
    <div className="bg-card shadow-lg rounded-xl border border-slate-200/80">
      <div className="p-6 sm:p-8 border-b border-slate-200">
        <button onClick={onBack} className="text-sm font-medium text-primary hover:text-sky-600 mb-3">
            &larr; Back to recommendations
        </button>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-3xl font-bold text-heading">{details.title}</h2>
          <button
            onClick={() => onToggleFavorite(career)}
            className="p-2 rounded-full text-slate-400 hover:bg-yellow-100 hover:text-yellow-500 transition-colors flex-shrink-0"
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <StarIcon filled={isFavorited} className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <div className="mb-6 border-b border-slate-200 pb-4">
            <div className="flex flex-wrap items-center gap-2">
                <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>Overview</TabButton>
                <TabButton active={activeTab === 'skills'} onClick={() => setActiveTab('skills')}>Skills</TabButton>
                <TabButton active={activeTab === 'path'} onClick={() => setActiveTab('path')}>Learning Path</TabButton>
                <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')}>Interview Prep</TabButton>
            </div>
        </div>
        
        <div className="min-h-[200px]">
           {renderTabContent()}
        </div>
      </div>
      
      <div className="p-6 sm:p-8 border-t border-slate-200 bg-slate-50/50 rounded-b-xl">
        <h3 className="text-xl font-semibold text-heading mb-3">Start Your Job Search</h3>
        <p className="text-secondary mb-4">Find open positions for "{details.title}" on popular job boards:</p>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <a
            href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(details.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex-1 text-center py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            LinkedIn
          </a>
          <a
            href={`https://www.indeed.com/jobs?q=${encodeURIComponent(details.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex-1 text-center py-2 px-4 bg-sky-700 text-white font-semibold rounded-lg hover:bg-sky-800 transition-colors duration-200"
          >
            Indeed
          </a>
          <a
            href={`https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${encodeURIComponent(details.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex-1 text-center py-2 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            Glassdoor
          </a>
        </div>
      </div>
    </div>
  );
};

export default CareerDetails;
