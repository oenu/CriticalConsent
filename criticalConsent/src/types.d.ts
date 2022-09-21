// Type definitions for criticalConsent

// Type for questions from the database extended with answered and selected properties
export interface QuestionType {
  id: number;
  type: "toggle" | "select" | "custom_response";
  title: string;
  description: string;
  example_low: string;
  select_low: boolean;
  example_mid: string;
  select_mid: boolean;
  example_high: string;
  select_high: boolean;
  answered: boolean;
  nsfw: boolean;
  category: "sexual" | "graphic" | "offensive" | "phobic" | null;
  custom_response: string;
  opt_in: boolean;
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
