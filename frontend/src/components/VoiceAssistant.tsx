import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Bot, X, Volume2, Sparkles, Send } from 'lucide-react';
import { PredictionResponse, FinancialProfileInput } from '../types/financial';

interface VoiceAssistantProps {
  prediction: PredictionResponse | null;
  profile: FinancialProfileInput;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ prediction, profile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    {
      sender: 'bot',
      text: 'Hello! I am FinPulse AI Voice Assistant. Ask me about your EMI affordability, financial health, or default risk!'
    }
  ]);
  const [inputText, setInputText] = useState('');

  // Web Speech Recognition setup
  useEffect(() => {
    let recognition: any = null;
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;
        setTranscript(text);
        setInputText(text);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    }
    return () => {
      if (recognition) recognition.abort();
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (e: any) => {
          const text = e.results[0][0].transcript;
          setInputText(text);
          handleSendQuery(text);
        };
        recognition.onend = () => setIsListening(false);
        recognition.start();
      } else {
        alert("Speech Recognition API is not supported in this browser. You can type your query below!");
      }
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendQuery = (queryText?: string) => {
    const text = queryText || inputText;
    if (!text.trim()) return;

    const newMsgs = [...messages, { sender: 'user' as const, text }];
    setMessages(newMsgs);
    setInputText('');

    // Process Natural Language query
    const lower = text.toLowerCase();
    let reply = '';

    if (lower.includes('health') || lower.includes('score')) {
      reply = prediction
        ? `Your Financial Health Score is ${prediction.financial_health_score} out of 100. ${
            prediction.financial_health_score >= 70 ? 'You have a strong financial buffer!' : 'Consider reducing non-essential expenses to raise your score.'
          }`
        : 'Please run a prediction first to evaluate your financial health score.';
    } else if (lower.includes('risk') || lower.includes('default')) {
      reply = prediction
        ? `Your calculated EMI Default Risk probability is ${prediction.emi_default_risk}%. Your loan approval probability is ${prediction.loan_approval_chance}%.`
        : 'Run the prediction form to check your default risk.';
    } else if (lower.includes('emi') || lower.includes('afford')) {
      reply = prediction
        ? `Your proposed monthly EMI is $${prediction.predicted_monthly_emi.toLocaleString()}. Your maximum recommended safe EMI limit is $${prediction.recommended_max_emi.toLocaleString()}.`
        : 'Complete your profile to see your safe EMI limits.';
    } else if (lower.includes('savings') || lower.includes('cash')) {
      reply = prediction
        ? `You have $${prediction.monthly_savings_after_emi.toLocaleString()} in net monthly savings after all expenses and EMI obligations.`
        : 'Enter your details to calculate monthly savings.';
    } else if (lower.includes('recommend') || lower.includes('advice') || lower.includes('help')) {
      reply = prediction && prediction.recommendations.length > 0
        ? `Top Recommendation: ${prediction.recommendations[0].title}. ${prediction.recommendations[0].action_item}`
        : 'Your financial ratios look healthy! Keep maintaining a 6-month emergency buffer.';
    } else {
      reply = `Based on your profile, your gross monthly income is $${(
        profile.income.monthly_salary + profile.income.additional_income
      ).toLocaleString()}. Ask me about your health score, default risk, or EMI limits!`;
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
      speakText(reply);
    }, 400);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full gradient-bg text-white shadow-2xl shadow-sky-500/40 hover:scale-105 transition-all flex items-center justify-center group"
      >
        <Bot className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-900 animate-pulse"></span>
      </button>

      {/* Voice Assistant Modal/Drawer */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] glass-card rounded-2xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  FinPulse AI Voice Assistant
                  <Sparkles className="w-3 h-3 text-sky-400" />
                </h4>
                <span className="text-[10px] text-emerald-400 font-semibold">Web Speech API Enabled</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="p-4 h-72 overflow-y-auto space-y-3 bg-slate-950/40 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl ${
                    m.sender === 'user'
                      ? 'bg-sky-500 text-white rounded-br-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                  }`}
                >
                  <p>{m.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Controls & Input */}
          <div className="p-3 border-t border-slate-800 bg-slate-900/90 flex items-center gap-2">
            <button
              onClick={toggleListening}
              className={`p-2.5 rounded-xl border transition-all ${
                isListening
                  ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                  : 'bg-slate-800 text-sky-400 border-slate-700 hover:bg-slate-700'
              }`}
              title="Speak prompt"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <input
              type="text"
              placeholder={isListening ? 'Listening...' : 'Type or speak your financial question...'}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendQuery()}
              className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
            />
            <button
              onClick={() => handleSendQuery()}
              className="p-2 rounded-xl gradient-bg text-white shadow-md shadow-sky-500/20"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
