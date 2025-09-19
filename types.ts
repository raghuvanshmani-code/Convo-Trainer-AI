
export interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export interface Analysis {
  trigger: boolean;
  summary: string;
  positives: string[];
  improvements: string[];
}

export interface GeminiResponse {
  reply: string;
  analysis: Analysis;
}

export interface Scenario {
    role: string;
    mode: string;
}

export interface ScenarioOption {
    name: string;
    description: string;
}
