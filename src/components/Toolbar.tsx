import React from 'react';
import { CodeMode, Language, AppState } from '../types';
import { Play, Save, Upload, RotateCcw, Undo, Redo, Trash2 } from 'lucide-react';

interface ToolbarProps {
  state: AppState;
  onModeChange: (mode: CodeMode) => void;
  onLanguageChange: (lang: Language) => void;
  onAutoToggle: (enabled: boolean) => void;
  onTransform: () => void;
  onDiffToggle: (enabled: boolean) => void;
  onSave: () => void;
  onLoad: () => void;
  onReset: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function Toolbar({
  state,
  onModeChange,
  onLanguageChange,
  onAutoToggle,
  onTransform,
  onDiffToggle,
  onSave,
  onLoad,
  onReset,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: ToolbarProps) {
  return (
    <div className="flex items-center justify-between p-2 bg-gray-100 border-b border-gray-200">
      <div className="flex items-center space-x-4">
        <div className="flex space-x-1 border-r pr-4 border-gray-300">
          <button
            onClick={onReset}
            className="p-1 hover:bg-gray-200 rounded text-gray-600 hover:text-red-600"
            title="Reset / Clear All"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <div className="w-px h-4 bg-gray-300 mx-1 self-center"></div>
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-1 rounded ${!canUndo ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-200 text-gray-600'}`}
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-1 rounded ${!canRedo ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-200 text-gray-600'}`}
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </button>
        </div>

        <select
          value={state.codeMode}
          onChange={(e) => onModeChange(e.target.value as CodeMode)}
          className="p-1 border rounded text-sm"
        >
          {Object.values(CodeMode).map((mode) => (
            <option key={mode} value={mode}>
              {mode}
            </option>
          ))}
        </select>

        <select
          value={state.targetLanguage}
          onChange={(e) => onLanguageChange(e.target.value as Language)}
          className="p-1 border rounded text-sm"
        >
          {Object.values(Language).map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>

        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            checked={state.autoMode}
            onChange={(e) => onAutoToggle(e.target.checked)}
            className="form-checkbox h-4 w-4 text-blue-600"
          />
          <span>Auto Transform</span>
        </label>
      </div>

      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            checked={state.diffView}
            onChange={(e) => onDiffToggle(e.target.checked)}
            className="form-checkbox h-4 w-4 text-blue-600"
          />
          <span>Show Diff</span>
        </label>

        <button
          onClick={onTransform}
          disabled={state.isGenerating}
          className={`flex items-center px-3 py-1 rounded text-white text-sm ${
            state.isGenerating ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {state.isGenerating ? (
            <RotateCcw className="animate-spin h-4 w-4 mr-1" />
          ) : (
            <Play className="h-4 w-4 mr-1" />
          )}
          Generate
        </button>

        <div className="flex space-x-2 border-l pl-4 border-gray-300">
          <button
            onClick={onSave}
            className="p-1 hover:bg-gray-200 rounded"
            title="Save State"
          >
            <Save className="h-4 w-4 text-gray-600" />
          </button>
          <button
            onClick={onLoad}
            className="p-1 hover:bg-gray-200 rounded"
            title="Load State"
          >
            <Upload className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
