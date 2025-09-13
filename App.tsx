
import React, { useState, useCallback, useEffect } from 'react';
import { getCareerRecommendations, getCareerDetails, getSkillsLearningPath } from './services/geminiService';
import type { CareerPath, CareerDetails as CareerDetailsType, SkillsLearningPath } from './types';
import SkillInput from './components/SkillInput';
import CareerRecommendations from './components/CareerRecommendations';
import CareerDetails from './components/CareerDetails';
import LoadingSpinner from './components/LoadingSpinner';
import SkillsLearningPathView from './components/SkillsLearningPathView';

type AppState = 'input' | 'recommendations' | 'details' | 'learningPath';

const App: React.FC = () => {
  const [skills, setSkills] = useState<string>('');
  const [recommendations, setRecommendations] = useState<CareerPath[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<CareerPath | null>(null);
  const [careerDetails, setCareerDetails] = useState<CareerDetailsType | null>(null);
  const [skillsLearningPath, setSkillsLearningPath] = useState<SkillsLearningPath[] | null>(null);
  const [favorites, setFavorites] = useState<CareerPath[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [appState, setAppState] = useState<AppState>('input');

  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('careerAdvisorFavorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (e) {
      console.error('Failed to load favorites from localStorage.', e);
    }
  }, []);

  const handleToggleFavorite = useCallback((career: CareerPath) => {
    setFavorites(prevFavorites => {
      const isFavorited = prevFavorites.some(fav => fav.title === career.title);
      let updatedFavorites;
      if (isFavorited) {
        updatedFavorites = prevFavorites.filter(fav => fav.title !== career.title);
      } else {
        updatedFavorites = [...prevFavorites, career];
      }
      try {
        localStorage.setItem('careerAdvisorFavorites', JSON.stringify(updatedFavorites));
      } catch (e) {
        console.error('Failed to save favorites to localStorage.', e);
      }
      return updatedFavorites;
    });
  }, []);

  const handleGetRecommendations = useCallback(async () => {
    if (!skills.trim()) {
      setError('Please enter your skills.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await getCareerRecommendations(skills);
      setRecommendations(result);
      setAppState('recommendations');
    } catch (e) {
      console.error(e);
      setError('Failed to get career recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [skills]);

  const handleSelectCareer = useCallback(async (career: CareerPath) => {
    setSelectedCareer(career);
    setIsLoading(true);
    setError(null);
    setAppState('details');
    try {
      const details = await getCareerDetails(career.title);
      setCareerDetails(details);
    } catch (e) {
      console.error(e);
      setError('Failed to get career details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleGetLearningPath = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setAppState('learningPath');
    try {
      const result = await getSkillsLearningPath(skills);
      setSkillsLearningPath(result);
    } catch (e) {
      console.error(e);
      setError('Failed to generate learning path. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [skills]);

  const handleBack = useCallback(() => {
    if (appState === 'details') {
      setAppState('recommendations');
      setSelectedCareer(null);
      setCareerDetails(null);
    } else if (appState === 'learningPath') {
      setAppState('recommendations');
      setSkillsLearningPath(null);
    } else if (appState === 'recommendations') {
      setAppState('input');
      setRecommendations([]);
    }
    setError(null);
  }, [appState]);

  const renderContent = () => {
    if (isLoading && appState !== 'details' && appState !== 'learningPath') {
      return <LoadingSpinner text="Analyzing your skills..." />;
    }
    
    if (error) {
        return (
            <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 font-medium">{error}</p>
                <button
                  onClick={handleBack}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-sky-600 transition-colors"
                >
                  Go Back
                </button>
            </div>
        )
    }

    switch (appState) {
      case 'input':
        return <SkillInput skills={skills} setSkills={setSkills} onSubmit={handleGetRecommendations} />;
      case 'recommendations':
        return <CareerRecommendations recommendations={recommendations} favorites={favorites} onToggleFavorite={handleToggleFavorite} onSelectCareer={handleSelectCareer} onGenerateLearningPath={handleGetLearningPath} onBack={handleBack} />;
      case 'details':
        return <CareerDetails career={selectedCareer} details={careerDetails} isLoading={isLoading} onBack={handleBack} favorites={favorites} onToggleFavorite={handleToggleFavorite} />;
      case 'learningPath':
        return <SkillsLearningPathView path={skillsLearningPath} isLoading={isLoading} onBack={handleBack} />;
      default:
        return <SkillInput skills={skills} setSkills={setSkills} onSubmit={handleGetRecommendations} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-text flex flex-col items-center p-4 sm:p-6 md:p-8">
      <header className="w-full max-w-4xl text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-heading tracking-tight">AI Career Advisor</h1>
        <p className="mt-2 text-lg text-secondary">Map your skills to your future career.</p>
      </header>
      <main className="w-full max-w-4xl">
        {renderContent()}
      </main>
      <footer className="w-full max-w-4xl text-center mt-12 text-sm text-slate-500">
        <p>Powered by Google Gemini</p>
      </footer>
    </div>
  );
};

export default App;
