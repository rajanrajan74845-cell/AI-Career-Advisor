
import { GoogleGenAI, Type } from "@google/genai";
import type { CareerPath, CareerDetails, SkillsLearningPath } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const careerPathSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: 'The job title or career path.' },
      description: { type: Type.STRING, description: 'A brief, one-paragraph summary of this career path.' },
      relevance: { type: Type.STRING, description: 'A short explanation of why this career fits the provided skills.' },
    },
    required: ['title', 'description', 'relevance'],
  },
};

const careerDetailsSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: 'The job title.' },
    summary: { type: Type.STRING, description: 'A detailed overview of the career.' },
    keyResponsibilities: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of primary day-to-day responsibilities.' },
    requiredSkills: {
      type: Type.OBJECT,
      properties: {
        technical: { type: Type.ARRAY, items: { type: Type.STRING } },
        soft: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ['technical', 'soft'],
    },
    learningPath: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          step: { type: Type.STRING, description: 'A learning step or topic.' },
          description: { type: Type.STRING, description: 'A description of the learning step and suggested resources.' },
        },
        required: ['step', 'description'],
      },
    },
    interviewQuestions: {
      type: Type.OBJECT,
      properties: {
        behavioral: { type: Type.ARRAY, items: { type: Type.STRING } },
        technical: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ['behavioral', 'technical'],
    },
    careerOutlook: { type: Type.STRING, description: 'The future job market outlook for this career, including trends and salary expectations.' },
  },
  required: ['title', 'summary', 'keyResponsibilities', 'requiredSkills', 'learningPath', 'interviewQuestions', 'careerOutlook'],
};

const skillsLearningPathSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            skillArea: { type: Type.STRING, description: 'The high-level skill or technology area this part of the learning path focuses on. E.g., "Python for Data Science", "Advanced React.js".' },
            steps: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: 'A concise title for this learning step. E.g., "Mastering Asynchronous JavaScript".' },
                        description: { type: Type.STRING, description: 'A detailed description of the learning step, including concepts to learn, projects to build, or resources to consult.' },
                        resources: {
                            type: Type.ARRAY,
                            description: "A list of suggested learning resources (articles, courses, documentation).",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING, description: "The name of the resource, e.g., 'MDN Docs', 'Coursera'." },
                                    url: { type: Type.STRING, description: "The direct URL to the resource." }
                                },
                                required: ['name', 'url']
                            }
                        }
                    },
                    required: ['title', 'description']
                }
            }
        },
        required: ['skillArea', 'steps']
    }
};


export const getCareerRecommendations = async (skills: string): Promise<CareerPath[]> => {
  const prompt = `Based on the following skills and interests, recommend 3-5 potential career paths for a student or professional. For each career, provide a title, a short description, and a brief explanation of why it's a good match. Skills: ${skills}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: careerPathSchema,
      },
    });

    const jsonText = response.text.trim();
    const recommendations = JSON.parse(jsonText);
    return recommendations as CareerPath[];
  } catch (error) {
    console.error("Error fetching career recommendations:", error);
    throw new Error("Failed to parse recommendations from the AI. The response might not be valid JSON.");
  }
};

export const getCareerDetails = async (careerTitle: string): Promise<CareerDetails> => {
    const prompt = `Provide a comprehensive guide for a student aspiring to become a "${careerTitle}". The guide should include a detailed summary, key responsibilities, essential technical and soft skills, a step-by-step learning path, sample behavioral and technical interview questions, and the future career outlook.`;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: careerDetailsSchema,
            },
        });

        const jsonText = response.text.trim();
        const details = JSON.parse(jsonText);
        return details as CareerDetails;
    } catch (error) {
        console.error("Error fetching career details:", error);
        throw new Error("Failed to parse career details from the AI. The response might not be valid JSON.");
    }
};

export const getSkillsLearningPath = async (skills: string): Promise<SkillsLearningPath[]> => {
  const prompt = `Based on the following skills, create a personalized, step-by-step learning path to help someone level up their abilities. Group the path by distinct skill areas. For each step within a skill area, provide a short, actionable title, a detailed description, and a few links to high-quality learning resources (like official documentation, popular tutorials, or courses on platforms like Coursera, freeCodeCamp, or Udemy). Skills: ${skills}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: skillsLearningPathSchema,
      },
    });

    const jsonText = response.text.trim();
    const learningPath = JSON.parse(jsonText);
    return learningPath as SkillsLearningPath[];
  } catch (error) {
    console.error("Error fetching skills learning path:", error);
    throw new Error("Failed to parse the learning path from the AI. The response might not be valid JSON.");
  }
};