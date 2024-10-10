import axios from 'axios';

const API_KEY = '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';
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${API_KEY}`,
};

const MAX_TOKENS = 100;

export const generateTopic = async (category: string): Promise<string> => {
  try {
    const response = await axios.post(API_URL, {
      model: 'openai/gpt-4o',
      messages: [{ role: 'user', content: `Generate a brief, controversial debate topic related to ${category}.` }],
      max_tokens: 30,
    }, { headers });

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating topic:', error);
    throw new Error('Failed to generate a debate topic. Please try again.');
  }
};

export const startDebate = async (topic: string): Promise<string> => {
  try {
    const response = await axios.post(API_URL, {
      model: 'openai/gpt-4o',
      messages: [{ role: 'user', content: `You are an AI debate opponent named Marvin. The topic is: "${topic}". Start the debate with a strong opening argument.` }],
      max_tokens: MAX_TOKENS,
    }, { headers });

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error starting debate:', error);
    throw new Error('Failed to start the debate. Please try again.');
  }
};

export const continueDebate = async (topic: string, messages: { role: string; content: string }[], userArgument: string): Promise<string> => {
  try {
    const debateHistory = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    debateHistory.push({ role: 'user', content: userArgument });

    const response = await axios.post(API_URL, {
      model: 'openai/gpt-4o',
      messages: [
        { role: 'system', content: `You are an AI debate opponent named Marvin. The topic is: "${topic}". Respond to the user's argument with a strong counter-argument.` },
        ...debateHistory
      ],
      max_tokens: MAX_TOKENS,
    }, { headers });

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error continuing debate:', error);
    throw new Error('Failed to continue the debate. Please try again.');
  }
};

export const endDebate = async (topic: string, userArguments: string[]): Promise<{ score: number; rationale: string; recommendations: string }> => {
  try {
    const response = await axios.post(API_URL, {
      model: 'openai/gpt-4o',
      messages: [
        { role: 'system', content: `You are an AI debate judge. The topic was: "${topic}". Evaluate the user's arguments, provide a score out of 10, a rationale for the score, and recommendations for improvement.` },
        { role: 'user', content: `Here are the user's arguments:\n${userArguments.join('\n')}` }
      ],
      max_tokens: 200,
    }, { headers });

    const content = response.data.choices[0].message.content;
    const [scoreStr, rationale, recommendations] = content.split('\n\n');
    const score = parseInt(scoreStr.match(/\d+/)[0], 10);

    return { score, rationale, recommendations };
  } catch (error) {
    console.error('Error ending debate:', error);
    throw new Error('Failed to end the debate. Please try again.');
  }
};