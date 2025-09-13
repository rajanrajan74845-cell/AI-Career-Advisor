
import React from 'react';
import { ArrowRightIcon } from './icons/ArrowRightIcon';

interface SkillInputProps {
  skills: string;
  setSkills: (skills: string) => void;
  onSubmit: () => void;
}

const SkillInput: React.FC<SkillInputProps> = ({ skills, setSkills, onSubmit }) => {
  return (
    <div className="bg-card shadow-lg rounded-xl p-6 sm:p-8 border border-slate-200/80">
      <h2 className="text-2xl font-semibold text-heading mb-1">Discover Your Career Path</h2>
      <p className="text-secondary mb-6">Enter your skills, interests, or project experiences below to get personalized career recommendations.</p>
      <textarea
        className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition duration-200 resize-none"
        rows={6}
        placeholder="e.g., JavaScript, Python, UI/UX Design, Data Analysis, Project Management..."
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
      />
      <button
        onClick={onSubmit}
        className="mt-4 w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 px-6 rounded-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-transform transform hover:scale-[1.02] duration-200"
      >
        <span>Find My Career Path</span>
        <ArrowRightIcon />
      </button>
    </div>
  );
};

export default SkillInput;
