// Type definitions for criticalConsent

// Enums
export enum QuestionTypes {
  toggle = "toggle",
  select = "select",
  custom_response = "custom_response",
}

export enum QuestionCategories {
  sexual = "sexual",
  graphic = "graphic",
  offensive = "offensive",
  phobic = "phobic",
  general = "general",
}

// Type for questions from the database extended with answered and selected properties
export interface QuestionType {
  id: number;
  type: QuestionTypes;
  title: string;
  description: string;
  example_low: string;
  select_low: boolean;
  example_mid: string;
  select_mid: boolean;
  example_high: string;
  select_high: boolean;
  answered: boolean;
  mature_content: boolean;
  category: QuestionCategories;
  custom_response: string;
  opt_in: boolean;
}

// Type for the group identifier from the database
export interface GroupType {
  id: string;
  name: string;
  shortid: string;
  mature_content: boolean;
  graphic_content: boolean;
  offensive_content: boolean;
  phobic_content: boolean;
  sexual_content: boolean;
  word_code: string;
}

// Type for uploading a response to the database
export interface UploadType {
  question_id: number;
  select_low: boolean;
  select_mid: boolean;
  select_high: boolean;
  answered: boolean;
  group_id: string;
  word_code: string;
}
