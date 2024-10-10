import React, { useState, useEffect } from 'react';
import { Trophy, ThumbsUp, Zap } from 'lucide-react';
import DebateGame from './components/DebateGame';
import CategorySelection from './components/CategorySelection';
import { generateTopic, endDebate } from './api/openRouterApi';

function App() {
  const [topic, setTopic] = useState('');
  const [gameState, setGameState] = useState('start');
  const [score, setScore] = useState(0);
  const [rationale, setRationale] = useState('');
  const [recommendations, setRecommendations] = useState('');

  const handleCategorySelect = async (category: string) => {
    const newTopic = await generateTopic(category);
    setTopic(newTopic);
    setGameState('playing');
  };

  const handleEndGame = async (userArguments: string[]) => {
    const { score, rationale, recommendations } = await endDebate(topic, userArguments);
    setScore(score);
    setRationale(rationale);
    setRecommendations(recommendations);
    setGameState('end');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-pink-100 flex items-center justify-center text-gray-800 p-4">
      <div className="card w-full max-w-4xl">
        <h1 className="text-4xl font-bold mb-6 text-center text-indigo-600">Debate Master</h1>
        {gameState === 'start' && (
          <div className="text-center">
            <p className="mb-6 text-xl">Ready to challenge your debating skills? Choose a category:</p>
            <CategorySelection onSelect={handleCategorySelect} />
          </div>
        )}
        {gameState === 'playing' && (
          <DebateGame topic={topic} onEndGame={handleEndGame} />
        )}
        {gameState === 'end' && (
          <div className="text-center">
            <h2 className="text-3xl font-semibold mb-6">Game Over!</h2>
            <div className="mb-6">
              <p className="text-xl mb-2">Your debate score:</p>
              <div className="flex items-center justify-center">
                <Trophy className="text-yellow-500 mr-2" size={32} />
                <span className="text-4xl font-bold text-indigo-600">{score}/10</span>
              </div>
            </div>
            <div className="mb-6 text-left">
              <h3 className="text-2xl font-semibold mb-2">Feedback:</h3>
              <p className="bg-indigo-100 p-4 rounded-lg">{rationale}</p>
            </div>
            <div className="mb-6 text-left">
              <h3 className="text-2xl font-semibold mb-2">Level Up Tips:</h3>
              <ul className="list-disc list-inside bg-pink-100 p-4 rounded-lg">
                {recommendations.split('\n').map((rec, index) => (
                  <li key={index} className="mb-2">{rec}</li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => setGameState('start')}
              className="btn-secondary flex items-center justify-center mx-auto"
            >
              <ThumbsUp className="mr-2" />
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;