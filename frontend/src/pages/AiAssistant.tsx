import React, { useState, useEffect } from 'react';
import { Bot, Send, Sparkles, TrendingDown, AlertCircle, ShoppingCart, RefreshCw, Zap, ArrowRight, User } from 'lucide-react';
import { AiChatMessage, ForecastResult, ReorderSuggestion } from '../types';
import { apiClient } from '../api/client';

export const AiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: "Hello! I am Inventory Pro AI Copilot, your warehouse and supply chain optimization assistant.\n\nI monitor historical sales velocity, supplier lead times, and current shelf thresholds in real time. How can I help you manage stock today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedNextActions: ['Which items are low in stock?', 'Forecast 30-day stock runout', 'Draft purchase order for Supplier Apex']
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const [activeTab, setActiveTab] = useState<'chat' | 'forecasting' | 'reorder'>('chat');
  const [forecasts, setForecasts] = useState<ForecastResult[]>([]);
  const [reorders, setReorders] = useState<ReorderSuggestion[]>([]);
  const [poCreatedNotice, setPoCreatedNotice] = useState<string | null>(null);

  useEffect(() => {
    loadAiData();
  }, []);

  const loadAiData = async () => {
    const [fcData, roData] = await Promise.all([
      apiClient.getDemandForecast(),
      apiClient.getReorderSuggestions()
    ]);
    setForecasts(fcData);
    setReorders(roData);
  };

  const handleSend = async (textToSend?: string) => {
    const msg = textToSend || inputMessage;
    if (!msg.trim()) return;

    const userMsg: AiChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: msg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    const result = await apiClient.askAiAssistant(msg);
    setIsTyping(false);

    const botMsg: AiChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'assistant',
      text: result.response,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      intent: result.intent,
      suggestedNextActions: result.suggestedNextActions
    };

    setMessages(prev => [...prev, botMsg]);
  };

  const handleCreateDraftPo = (sugg: ReorderSuggestion) => {
    setPoCreatedNotice(`Purchase order draft generated for ${sugg.supplierName} (${sugg.suggestedOrderQuantity}x ${sugg.productName}). Ready for review in Orders tab!`);
    setTimeout(() => setPoCreatedNotice(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Demand Intelligence &amp; Copilot</h1>
            <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Spring AI &bull; GPT-4o
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Predictive demand forecasting, dynamic safety stock suggestions, and natural language analytics.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'chat' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Chat Copilot
          </button>
          <button
            onClick={() => setActiveTab('forecasting')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'forecasting' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Demand Forecast ({forecasts.length})
          </button>
          <button
            onClick={() => setActiveTab('reorder')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'reorder' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Reorder Suggestions ({reorders.length})
          </button>
        </div>
      </div>

      {poCreatedNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-600" />
            <span className="font-medium">{poCreatedNotice}</span>
          </div>
        </div>
      )}

      {/* Tab 1: Conversational AI Copilot */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[640px]">
          {/* Chat Window (2 cols) */}
          <div className="lg:col-span-2 rounded-xl bg-white border border-slate-200 flex flex-col overflow-hidden shadow-sm">
            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/40">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex items-start gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.sender === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0 text-white shadow-xs">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-xs ${
                      m.sender === 'user'
                        ? 'bg-emerald-600 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{m.text}</div>

                    {/* AI Quick Followup Action Pills */}
                    {m.suggestedNextActions && m.suggestedNextActions.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5">
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Suggested Actions:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {m.suggestedNextActions.map((action, i) => (
                            <button
                              key={i}
                              onClick={() => handleSend(action)}
                              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 text-[11px] font-medium transition-colors"
                            >
                              {action}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className={`text-[10px] text-right mt-1.5 ${m.sender === 'user' ? 'text-emerald-100' : 'text-slate-400'}`}>{m.timestamp}</div>
                  </div>

                  {m.sender === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-slate-200 border border-slate-300 flex items-center justify-center shrink-0 text-slate-700">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-emerald-700 italic">
                  <Bot className="w-4 h-4 animate-spin text-emerald-600" />
                  <span>AI Copilot is analyzing inventory records...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-white border-t border-slate-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask anything (e.g. 'Which items are low in stock?', 'Draft order for Supplier X')..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-xs"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isTyping}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-medium rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>

          {/* Quick AI Prompt Assistant Side Panel (1 col) */}
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Common Questions</span>
              </div>
              <p className="text-xs text-slate-500">Click any preset prompt to query warehouse data:</p>

              <div className="space-y-2">
                {[
                  "Which items are low in stock?",
                  "Generate a purchase order draft for Supplier Apex",
                  "What is our 30-day stock depletion forecast?",
                  "Recommend updated reorder points for GPUs",
                  "Summarize today's warehouse transactions"
                ].map((promptText, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(promptText)}
                    className="w-full text-left p-2.5 rounded-lg bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 text-xs text-slate-700 hover:text-emerald-900 flex items-center justify-between group transition-all"
                  >
                    <span className="truncate pr-2 font-medium">{promptText}</span>
                    <ArrowRight className="w-3 h-3 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2 text-xs">
              <h4 className="font-bold text-slate-900">How the Forecasting Works:</h4>
              <ul className="text-slate-600 space-y-1.5 list-disc list-inside">
                <li>Retrieves historical inventory movements.</li>
                <li>Calculates burn rate per day across 30 days.</li>
                <li>Factoring in supplier lead times and safety buffer.</li>
                <li>Generates automated replenishment drafts.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Smart Demand Forecasting */}
      {activeTab === 'forecasting' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {forecasts.map((fc) => (
              <div
                key={fc.productId}
                className={`p-5 rounded-xl bg-white border shadow-sm hover:shadow-md transition-shadow ${
                  fc.riskLevel === 'CRITICAL'
                    ? 'border-rose-300 bg-rose-50/20'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{fc.productName}</h3>
                    <p className="text-slate-500 text-[11px] font-mono mt-0.5">SKU: {fc.sku}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                      fc.riskLevel === 'CRITICAL'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : fc.riskLevel === 'WARNING'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {fc.riskLevel}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 my-4 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-center">
                  <div>
                    <p className="text-slate-500 text-[10px]">Avg Daily Consumption</p>
                    <p className="font-bold text-slate-900 text-base mt-0.5">{fc.averageDailySales} units</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-[10px]">Projected Runout</p>
                    <p className={`font-bold text-base mt-0.5 ${fc.projectedRunoutDays <= 7 ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {fc.projectedRunoutDays} days
                    </p>
                  </div>
                </div>

                {/* 7-Day Projected Stock Decline Bars */}
                <div className="space-y-1.5 mb-4">
                  <p className="text-[10px] font-semibold text-slate-500">7-Day Depletion Trend:</p>
                  <div className="flex items-end gap-1.5 h-12 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                    {fc.projections.map((p, idx) => {
                      const maxStock = Math.max(...fc.projections.map(x => x.projectedStock), 1);
                      const heightPercent = Math.max(8, (p.projectedStock / maxStock) * 100);
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                          <div
                            className={`w-full rounded-xs ${p.projectedStock === 0 ? 'bg-rose-500' : 'bg-emerald-600'}`}
                            style={{ height: `${heightPercent}%` }}
                          />
                          <span className="text-[8px] text-slate-500 mt-1">{p.date.split(' ')[1] || p.date}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {fc.aiReasoning}
                </p>

                {fc.recommendedOrderQuantity > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-800">
                      Reorder: +{fc.recommendedOrderQuantity} units
                    </span>
                    <button
                      onClick={() => handleSend(`Draft purchase order for ${fc.productName}`)}
                      className="px-2.5 py-1 rounded-md bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-medium shadow-xs transition-colors"
                    >
                      Draft Order
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Automated Reorder Point Suggestions */}
      {activeTab === 'reorder' && (
        <div className="rounded-xl bg-white border border-slate-200 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Dynamic Safety-Stock &amp; Reorder Optimization</h3>
              <p className="text-xs text-slate-500 mt-0.5">Calculated using supplier lead times and consumption variance</p>
            </div>
            <button
              onClick={loadAiData}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shadow-xs"
              title="Recalculate Suggestions"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reorders.map((r) => (
              <div key={r.productId} className="p-5 rounded-xl bg-slate-50/70 border border-slate-200 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{r.productName}</h4>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">SKU: {r.sku} &bull; Supplier: {r.supplierName}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    {r.priority}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs py-2.5 bg-white rounded-lg border border-slate-200">
                  <div>
                    <p className="text-slate-500 text-[10px]">Current Reorder Pt</p>
                    <p className="font-medium text-slate-400 line-through text-sm">{r.currentReorderPoint}</p>
                  </div>
                  <div>
                    <p className="text-emerald-700 text-[10px] font-bold">Suggested Reorder Pt</p>
                    <p className="font-bold text-emerald-700 text-sm">{r.suggestedReorderPoint}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-[10px]">Suggested Order</p>
                    <p className="font-bold text-slate-900 text-sm">+{r.suggestedOrderQuantity} pcs</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 italic">"{r.rationale}"</p>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-600">
                    Estimated Cost: <strong className="text-slate-900">${r.estimatedCost.toFixed(2)}</strong>
                  </span>
                  <button
                    onClick={() => handleCreateDraftPo(r)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-xs transition-colors"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>1-Click PO Draft</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
