import { CodeMode, Language } from '../types';
import * as Diff from 'diff';

export function buildPrompt(
  currentText: string,
  previousText: string,
  existingCode: string,
  mode: CodeMode,
  language: Language
): string {
  // Compute diff between previous and current design text
  const diff = Diff.createPatch('design.txt', previousText || '', currentText || '');
  
  // Format the prompt
  return `You are a code generator. You write clean, well-documented ${language} code.

MODE: ${mode} (Class | Function | Streamlined Code)

PREVIOUS DESIGN TEXT:
${previousText || "None — this is the first generation."}

CURRENT DESIGN TEXT:
${currentText}

CHANGES SINCE LAST VERSION:
${diff || "First generation — no previous version."}

EXISTING CODE:
${existingCode || "None — generate from scratch."}

TASK:
Update the existing code to match the CURRENT DESIGN TEXT.
- If there is no existing code, generate it from scratch.
- If there is existing code, make minimal changes to align it with the new design text.
- Preserve working code that is still consistent with the design.
- Follow ${mode} conventions: ${
    mode === CodeMode.CLASS
      ? 'define a class with methods'
      : mode === CodeMode.FUNCTION
      ? 'define standalone functions'
      : 'write streamlined procedural code with minimal boilerplate'
  }.

OUTPUT:
Return ONLY the code. No explanations, no markdown fences, no commentary.`;
}
