
import React from 'react';
import type { SkillsLearningPath } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';

interface SkillsLearningPathViewProps {
    path: SkillsLearningPath[] | null;
    isLoading: boolean;
    onBack: () => void;
}

const SkillsLearningPathView: React.FC<SkillsLearningPathViewProps> = ({ path, isLoading, onBack }) => {
    if (isLoading || !path) {
        return <LoadingSpinner text="Crafting your personalized learning path..." />;
    }

    return (
        <div className="bg-card shadow-lg rounded-xl border border-slate-200/80 animate-fade-in">
            <div className="p-6 sm:p-8 border-b border-slate-200">
                <button onClick={onBack} className="text-sm font-medium text-primary hover:text-sky-600 mb-3">
                    &larr; Back to recommendations
                </button>
                <h2 className="text-3xl font-bold text-heading">Personalized Learning Path</h2>
                <p className="mt-1 text-secondary">Actionable steps to enhance your skills and advance your career.</p>
            </div>
            <div className="p-6 sm:p-8 space-y-8">
                {path.map((area, index) => (
                    <div key={index}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex-shrink-0 h-10 w-10 bg-sky-100 text-primary rounded-full flex items-center justify-center">
                                <LightbulbIcon />
                            </div>
                            <h3 className="text-2xl font-semibold text-heading">{area.skillArea}</h3>
                        </div>
                        <div className="space-y-4 pl-4 border-l-2 border-slate-200 ml-5">
                            {area.steps.map((step, stepIndex) => (
                                <div key={stepIndex} className="relative pl-8 pb-4 last:pb-0">
                                    <div className="absolute left-[-29px] top-1 h-4 w-4 bg-white border-2 border-primary rounded-full"></div>
                                    <h4 className="font-semibold text-heading">{step.title}</h4>
                                    <p className="text-secondary mt-1 text-sm leading-relaxed">{step.description}</p>
                                    
                                    {step.resources && step.resources.length > 0 && (
                                        <div className="mt-3">
                                            <h5 className="text-sm font-semibold text-slate-600 mb-2">Suggested Resources:</h5>
                                            <ul className="space-y-1.5">
                                                {step.resources.map((resource, resourceIndex) => (
                                                    <li key={resourceIndex}>
                                                        <a 
                                                            href={resource.url} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer" 
                                                            className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-sky-600 hover:underline transition-colors"
                                                        >
                                                            <ExternalLinkIcon className="flex-shrink-0" />
                                                            <span>{resource.name}</span>
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SkillsLearningPathView;