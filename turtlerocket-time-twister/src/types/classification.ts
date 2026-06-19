export type CognitiveLoad = 'heavy' | 'medium' | 'light';

export interface ClassificationResult {
  cognitiveLoad: CognitiveLoad;
  matchedKeywords: string[];
}
