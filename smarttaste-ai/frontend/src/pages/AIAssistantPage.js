import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { aiAPI } from '../services/api';

/**
 * AI Assistant Page Component
 * Chat with AI for food recommendations and voice search
 */
const AIAssistantPage = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [mood, setMood] = useState(searchParams.get('mood') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Predefined moods
  const moodOptions = ['happy', 'sad', 'stressed', 'excited', 'tired', 'hungry'];

  useEffect(() => {
    // If mood is selected from URL, get recommendation
    if (mood && messages.length === 0) {
      getRecommendation(mood);
    }
  }, [mood]);

  const getRecommendation = async (selectedMood) => {
    try {
      setIsLoading(true);
      const response = await aiAPI.getRecommendation(selectedMood);
      
      setMessages(prev => [
        ...prev,
        {
          type: 'ai',
          text: response.data.data.message,
          suggestion: response.data.data.dishSuggestion,
          restaurants: response.data.data.restaurants
        }
      ]);
    } catch (error) {
      console.error('Error getting recommendation:', error);
      setMessages(prev => [
        ...prev,
        {
          type: 'ai',
          text: "I'm having trouble connecting to the AI service. Please try again!"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);

    try {
      setIsLoading(true);
      const response = await aiAPI.chat(userMessage);
      
      setMessages(prev => [
        ...prev,
        {
          type: 'ai',
          text: response.data.data.response
        }
      ]);
    } catch (error) {
      console.error('Error chatting:', error);
      setMessages(prev => [
        ...prev,
        {
          type: 'ai',
          text: "Sorry, I couldn't process that. Please try again!"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const startVoiceInput = () => {
    // Check if browser supports Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        
        // Automatically analyze voice input
        analyzeVoiceInput(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setMessages(prev => [
          ...prev,
          {
            type: 'ai',
            text: "Sorry, I couldn't hear you properly. Please try again or type your message."
          }
        ]);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      setMessages(prev => [
        ...prev,
        {
          type: 'ai',
          text: "Your browser doesn't support voice input. Please use a modern browser like Chrome."
        }
      ]);
    }
  };

  const analyzeVoiceInput = async (text) => {
    try {
      const response = await aiAPI.analyzeVoice(text);
      const analysis = response.data.data;
      
      if (analysis.intent === 'recommend' || analysis.mood) {
        const detectedMood = analysis.mood || 'hungry';
        getRecommendation(detectedMood);
      } else {
        setInput(text);
      }
    } catch (error) {
      console.error('Error analyzing voice:', error);
      setInput(text);
    }
  };

  return (
    <div style={styles.container}>
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={styles.header}
        >
          <h1 style={styles.title}>🤖 AI Food Assistant</h1>
          <p style={styles.subtitle}>
            Get personalized recommendations based on your mood or ask me anything!
          </p>
        </motion.div>

        {/* Mood Selection */}
        {!mood && messages.length === 0 && (
          <div className="card" style={styles.moodCard}>
            <h3 style={styles.moodTitle}>How are you feeling right now?</h3>
            <div style={styles.moodGrid}>
              {moodOptions.map((m) => (
                <motion.button
                  key={m}
                  className="btn btn-secondary"
                  style={styles.moodBtn}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => getRecommendation(m)}
                >
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="card" style={styles.chatContainer}>
          <div style={styles.messagesContainer}>
            {messages.length === 0 ? (
              <div style={styles.emptyChat}>
                <span style={styles.emptyIcon}>💬</span>
                <p>Select a mood or ask me a question!</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    ...styles.message,
                    ...(msg.type === 'user' ? styles.userMessage : styles.aiMessage)
                  }}
                >
                  {msg.type === 'ai' && <span style={styles.aiIcon}>🤖</span>}
                  <div style={styles.messageContent}>
                    <p>{msg.text}</p>
                    {msg.suggestion && (
                      <p style={styles.suggestion}>💡 {msg.suggestion}</p>
                    )}
                  </div>
                </motion.div>
              ))
            )}
            
            {isLoading && (
              <div style={styles.typingIndicator}>
                <span>AI is thinking</span>
                <div className="spinner" style={styles.spinner}></div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="card" style={styles.inputContainer}>
          <div style={styles.inputWrapper}>
            <button
              onClick={startVoiceInput}
              style={{
                ...styles.voiceBtn,
                backgroundColor: isListening ? '#FF6B6B' : 'var(--primary-color)'
              }}
              title="Voice Input"
            >
              {isListening ? '🔴' : '🎤'}
            </button>
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask me anything about food..."
              className="input"
              style={styles.input}
              disabled={isLoading}
            />
            
            <button
              onClick={sendMessage}
              className="btn btn-primary"
              style={styles.sendBtn}
              disabled={isLoading || !input.trim()}
            >
              Send
            </button>
          </div>
          
          {isListening && (
            <p style={styles.listeningText}>🎤 Listening... Speak now!</p>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    padding: '40px 0'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  title: {
    fontSize: '40px',
    fontWeight: 'bold',
    color: 'var(--text-primary)',
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '18px',
    color: 'var(--text-secondary)'
  },
  moodCard: {
    marginBottom: '40px',
    padding: '40px',
    textAlign: 'center'
  },
  moodTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'var(--text-primary)',
    marginBottom: '24px'
  },
  moodGrid: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    flexWrap: 'wrap'
  },
  moodBtn: {
    padding: '12px 24px',
    textTransform: 'capitalize'
  },
  chatContainer: {
    marginBottom: '20px',
    minHeight: '400px',
    maxHeight: '600px',
    overflowY: 'auto'
  },
  messagesContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '20px'
  },
  emptyChat: {
    textAlign: 'center',
    padding: '60px 20px',
    color: 'var(--text-secondary)'
  },
  emptyIcon: {
    fontSize: '64px',
    display: 'block',
    marginBottom: '16px'
  },
  message: {
    display: 'flex',
    gap: '12px',
    maxWidth: '80%'
  },
  userMessage: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse'
  },
  aiMessage: {
    alignSelf: 'flex-start'
  },
  aiIcon: {
    fontSize: '24px'
  },
  messageContent: {
    padding: '16px',
    borderRadius: 'var(--radius-lg)',
    backgroundColor: 'var(--background-secondary)'
  },
  suggestion: {
    marginTop: '8px',
    fontStyle: 'italic',
    color: 'var(--primary-color)'
  },
  typingIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--text-secondary)',
    padding: '16px'
  },
  spinner: {
    width: '20px',
    height: '20px'
  },
  inputContainer: {
    padding: '20px'
  },
  inputWrapper: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  },
  voiceBtn: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    fontSize: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  input: {
    flex: 1,
    padding: '16px'
  },
  sendBtn: {
    padding: '16px 32px'
  },
  listeningText: {
    textAlign: 'center',
    marginTop: '12px',
    color: 'var(--primary-color)',
    fontWeight: '600'
  }
};

export default AIAssistantPage;
