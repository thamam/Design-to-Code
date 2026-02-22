export enum CodeMode {
  CLASS = 'CLASS',
  FUNCTION = 'FUNCTION',
  STREAMLINED = 'STREAMLINED',
}

export enum Language {
  PYTHON = 'Python',
  JAVASCRIPT = 'JavaScript',
  TYPESCRIPT = 'TypeScript',
  JAVA = 'Java',
  CPP = 'C++',
  GO = 'Go',
  RUST = 'Rust',
}

export interface AppState {
  designText: string;
  generatedCode: string;
  previousGeneratedCode: string;
  previousDesignText: string;
  codeMode: CodeMode;
  targetLanguage: Language;
  autoMode: boolean;
  diffView: boolean;
  isDirty: boolean;
  isGenerating: boolean;
  error: string | null;
}

export const DEFAULT_STATE: AppState = {
  designText: '',
  generatedCode: '',
  previousGeneratedCode: '',
  previousDesignText: '',
  codeMode: CodeMode.CLASS,
  targetLanguage: Language.PYTHON,
  autoMode: false,
  diffView: false,
  isDirty: false,
  isGenerating: false,
  error: null,
};
