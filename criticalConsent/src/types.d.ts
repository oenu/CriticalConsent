// Type definitions for criticalConsent

// Type for questions from the database
export interface QuestionType {
  id: number;
  description: string;
  example_low: string;
  select_low: boolean;
  example_mid: string;
  select_mid: boolean;
  example_high: string;
  select_high: boolean;
  answered: boolean;
  nsfw: boolean;
  category: string;
}

// Tye for the group identifier from the database
export interface GroupType {
  id: number;
  name: string;
  shortid: string;
  nsfw: boolean;
}

// Type for uploading a response to the database
export interface UploadType {
  question_id: number;
  select_low: boolean;
  select_mid: boolean;
  select_high: boolean;
  answered: boolean;
  group_id: number;
}
