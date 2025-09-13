
export interface CareerPath {
  title: string;
  description: string;
  relevance: string;
}

export interface CareerDetails {
  title: string;
  summary: string;
  keyResponsibilities: string[];
  requiredSkills: {
    technical: string[];
    soft: string[];
  };
  learningPath: {
    step: string;
    description: string;
  }[];
  interviewQuestions: {
    behavioral: string[];
    technical: string[];
  };
  careerOutlook: string;
}

export interface LearningResource {
  name: string;
  url: string;
}

export interface LearningStep {
  title: string;
  description: string;
  resources?: LearningResource[];
}

export interface SkillsLearningPath {
  skillArea: string;
  steps: LearningStep[];
}