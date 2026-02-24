import React, { useState } from 'react';
import { Toolbar } from './components/Toolbar';
import { DesignPane } from './components/DesignPane';
import { CodePane } from './components/CodePane';
import { SplitPane } from './components/SplitPane';
import { ConfirmationModal } from './components/ConfirmationModal';
import { Chatbot } from './components/Chatbot';
import { useAppStore } from './hooks/useAppStore';
import { useAutoTrigger } from './hooks/useAutoTrigger';

export default function App() {
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const { 
    state, 
    updateState, 
    handleTransform, 
    handleSave, 
    handleLoad,
    handleReset,
    undo,
    redo,
    canUndo,
    canRedo
  } = useAppStore();

  useAutoTrigger({
    state,
    onTrigger: handleTransform,
  });

  return (
    <div className="flex flex-col h-screen bg-white text-gray-900">
      <Toolbar
        state={state}
        onModeChange={(mode) => updateState({ codeMode: mode })}
        onLanguageChange={(lang) => updateState({ targetLanguage: lang })}
        onAutoToggle={(enabled) => updateState({ autoMode: enabled })}
        onTransform={handleTransform}
        onDiffToggle={(enabled) => updateState({ diffView: enabled })}
        onSave={handleSave}
        onLoad={handleLoad}
        onReset={() => setIsResetModalOpen(true)}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
      />

      {state.error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p className="font-bold">Error</p>
          <p>{state.error}</p>
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        <SplitPane
          left={
            <DesignPane
              value={state.designText}
              onChange={(value) => updateState({ designText: value })}
            />
          }
          right={
            <CodePane
              code={state.generatedCode}
              previousCode={state.previousGeneratedCode}
              language={state.targetLanguage}
              showDiff={state.diffView}
              isGenerating={state.isGenerating}
            />
          }
        />
      </div>

      <Chatbot />

      {isResetModalOpen && (
        <ConfirmationModal
          isOpen={isResetModalOpen}
          onClose={() => setIsResetModalOpen(false)}
          onConfirm={handleReset}
          title="Reset Application"
          message="Are you sure you want to reset the application to its default state? This will clear all content and configuration."
        />
      )}
    </div>
  );
}
