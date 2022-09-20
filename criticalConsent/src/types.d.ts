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
