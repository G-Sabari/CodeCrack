// Premium Aptitude Question Bank - Master Index
// Combines all premium questions from all topics
// This file serves as the single entry point for premium questions

import { 
  allPremiumQuestions, 
  getAllPremiumQuestionsFlat,
  getQuestionsByTopic,
  getQuestionsByDifficulty,
  getQuestionsByCompanyType,
  getQuestionsByYear,
  topicProgressMetadata,
  companyMetadata,
  type PremiumAptitudeQuestion 
} from './premiumAptitudeQuestions';

import { 
  allPremiumQuestionsPart2, 
  getAllPart2QuestionsFlat 
} from './premiumAptitudeQuestionsPart2';

// Merge all questions into single object
export const completePremiumQuestionBank = {
  ...allPremiumQuestions,
  ...allPremiumQuestionsPart2,
};

// Get all premium questions as flat array
export const getAllPremiumQuestions = (): PremiumAptitudeQuestion[] => {
  return [...getAllPremiumQuestionsFlat(), ...getAllPart2QuestionsFlat()];
};

// Statistics for the premium question bank
export const premiumBankStats = {
  totalQuestions: getAllPremiumQuestions().length,
  topicsCount: Object.keys(completePremiumQuestionBank).length,
  byDifficulty: {
    Easy: getAllPremiumQuestions().filter(q => q.difficulty === 'Easy').length,
    Medium: getAllPremiumQuestions().filter(q => q.difficulty === 'Medium').length,
    Hard: getAllPremiumQuestions().filter(q => q.difficulty === 'Hard').length,
  },
  byCompanyType: {
    'Service-Based': getAllPremiumQuestions().filter(q => q.companyType === 'Service-Based').length,
    'Product-Based': getAllPremiumQuestions().filter(q => q.companyType === 'Product-Based').length,
    'Both': getAllPremiumQuestions().filter(q => q.companyType === 'Both').length,
  },
  byYear: {
    2024: getAllPremiumQuestions().filter(q => q.year === 2024).length,
    2025: getAllPremiumQuestions().filter(q => q.year === 2025).length,
    2026: getAllPremiumQuestions().filter(q => q.year === 2026).length,
  }
};

// Re-export utilities
export { 
  getQuestionsByTopic, 
  getQuestionsByDifficulty, 
  getQuestionsByCompanyType,
  getQuestionsByYear,
  topicProgressMetadata,
  companyMetadata,
  type PremiumAptitudeQuestion 
};
