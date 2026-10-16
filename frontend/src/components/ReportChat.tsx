import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, MedicalReport } from '../types/medical';
import { sendChatMessage } from '../services/api';
import { MessageSquare, Send, Sparkles, Bot, User, Loader2, ShieldCheck } from 'lucide-react';

interface ReportChatProps {
  report: MedicalReport;
}

export const ReportChat: React.FC<ReportChatProps> = ({ report }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I have reviewed your **${report.title}**. You can ask me anything about your specific biomarker values, what the reference ranges indicate, or how to discuss these findings with your physician. How can I help you understand your report today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const question = textToSend || inputValue;
    if (!question.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: question.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const replyText = await sendChatMessage(report.id, question, messages);
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: 'assistant',
        text: "I encountered a hiccup processing that request. Please try asking again in a moment.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    'Explain my out-of-range results simply',
    'Do these numbers indicate an emergency?',
    'What diet or habits influence these markers?',
    'What key questions should I ask my physician?',
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[600px] overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-sm">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h4 className="text-sm font-bold text-slate-900">Report Copilot</h4>
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            </div>
            <p className="text-[11px] text-slate-400">Strictly grounded in your active lab report</p>
          </div>
        </div>

        <div className="flex items-center space-x-1 text-[11px] text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-200">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>Grounded & Safe</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start space-x-2.5 ${m.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                m.sender === 'user'
                  ? 'bg-slate-800 text-white'
                  : 'bg-teal-50 text-teal-700 border border-teal-200'
              }`}
            >
              {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`max-w-[82%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-teal-600 text-white rounded-tr-none shadow-sm'
                  : 'bg-slate-100/80 text-slate-800 rounded-tl-none border border-slate-200/60'
              }`}
            >
              <div className="whitespace-pre-wrap">{m.text}</div>
              <span
                className={`text-[10px] mt-1.5 block ${
                  m.sender === 'user' ? 'text-teal-100/80 text-right' : 'text-slate-400'
                }`}
              >
                {m.timestamp}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-xs text-slate-400 pl-10">
            <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
            <span>Consulting clinical literature & analyzing report...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="p-2.5 border-t border-slate-100 bg-slate-50/50 flex flex-wrap gap-1.5 overflow-x-auto">
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            disabled={loading}
            className="text-[11px] font-medium bg-white hover:bg-teal-50 text-slate-600 hover:text-teal-700 border border-slate-200 hover:border-teal-300 rounded-full px-2.5 py-1 transition shrink-0 disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 border-t border-slate-200 flex items-center space-x-2 bg-white"
      >
        <input
          type="text"
          placeholder="Ask a question about this report..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={loading}
          className="flex-1 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || loading}
          className="bg-teal-600 hover:bg-teal-700 text-white p-2.5 rounded-xl shadow-sm hover:shadow disabled:opacity-40 transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

