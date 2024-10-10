import React, { useState, useEffect, useRef } from 'react';
import { Clock, Send } from 'lucide-react';
import { startDebate, continueDebate } from '../api/openRouterApi';

interface DebateGameProps {
  topic: string;
  onEndGame: (userArguments: string[]) => void;
}

interface Message {
  id: number;
  role: 'user' | 'opponent';
  content: string;
}

const DebateGame: React.FC<DebateGameProps> = ({ topic, onEndGame }) => {
  const [timeLeft, setTimeLeft] = useState(300);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentArgument, setCurrentArgument] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleEndGame();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (topic) {
      setIsLoading(true);
      startDebate(topic).then((response) => {
        addMessage('opponent', response);
        setIsLoading(false);
      });
    }
  }, [topic]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (role: 'user' | 'opponent', content: string) => {
    setMessages((prevMessages) => [...prevMessages, { id: Date.now(), role, content }]);
  };

  const handleSendArgument = async () => {
    if (currentArgument.trim() === '' || isLoading) return;

    setIsLoading(true);
    addMessage('user', currentArgument);
    setCurrentArgument('');

    try {
      const response = await continueDebate(topic, messages, currentArgument);
      addMessage('opponent', response);
    } catch (error) {
      console.error('Error in debate continuation:', error);
    }

    setIsLoading(false);
  };

  const handleEndGame = () => {
    const userArguments = messages
      .filter((message) => message.role === 'user')
      .map((message) => message.content);
    onEndGame(userArguments);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-gray-800">
      <h2 className="text-2xl font-semibold mb-4">Topic: {topic}</h2>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Clock className="mr-2" />
          <span className="text-xl font-semibold">{formatTime(timeLeft)}</span>
        </div>
      </div>
      <div className="mb-4 h-96 overflow-y-auto border rounded p-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.role === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'bg-white text-gray-800 border border-gray-200'
              }`}
            >
              <p>{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="mb-4 flex">
        <textarea
          className="input-field"
          value={currentArgument}
          onChange={(e) => setCurrentArgument(e.target.value)}
          placeholder="Type your argument here..."
        />
        <button
          onClick={handleSendArgument}
          disabled={isLoading || currentArgument.trim() === ''}
          className="btn-primary ml-2 flex-shrink-0"
        >
          <Send className="mr-2" size={20} />
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
      <button
        onClick={handleEndGame}
        className="btn-secondary w-full"
        disabled={isLoading}
      >
        End Debate
      </button>
    </div>
  );
};

export default DebateGame;