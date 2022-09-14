export type Answer = {
  id?: number;
  isTrue?: boolean;
  text?: string;
};

export type Question = {
  text: string;
  id?: number;
  answers: Answer[];
  feedbackFalse?: string;
  feedbackTrue?: string;
};

export type Quiz = {
  created: string | undefined;
  description: string;
  id?: number;
  modified: string;
  questions: Question[];
  title: string;
  url: string;
  score?: string | null;
}; 
