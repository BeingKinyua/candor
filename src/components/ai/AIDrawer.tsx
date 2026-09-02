import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  X,
  Send,
  CheckCircle,
  ExternalLink,
  Bot,
  User as UserIcon,
  RefreshCw,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useNavigation } from '@/src/lib/router/navigationContext';
import { aiService, AIQueryContext } from '@/src/lib/services/aiService';
import { campaignStore } from '@/src/lib/services/store';
import { AIMessage, AIActionProposal, SourceChip } from '@/src/types';
import { Button } from '@/src/components/ui/Controls';

export const AIDrawer: React.FC = () => {
  const { isAiDrawerOpen, closeAiDrawer, currentPath, aiInitialPrompt, clearAiInitialPrompt, navigate } = useNavigation();
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [actionStatus, setActionStatus] = useState<Record<string, { status: 'idle' | 'executing' | 'done' | 'failed'; message?: string }>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Derive active context from current route
  const getRouteContext = (): AIQueryContext => {
    if (currentPath.startsWith('/people/per-')) {
      const id = currentPath.split('/')[2];
      const person = campaignStore.getPerson(id);
      return {
        currentRoute: currentPath,
        contextTitle: person?.fullName || 'Contact Profile',
        entityType: 'person',
        entityId: id,
        entityData: person,
      };
    }
    if (currentPath.startsWith('/meetings/mtg-')) {
      const id = currentPath.split('/')[2];
      const meeting = campaignStore.getMeeting(id);
      return {
        currentRoute: currentPath,
        contextTitle: meeting?.title || 'Meeting Brief',
        entityType: 'meeting',
        entityId: id,
        entityData: meeting,
      };
    }
    if (currentPath.startsWith('/field/submissions/fs-')) {
      const id = currentPath.split('/')[3];
      const sub = campaignStore.getSubmission(id);
      return {
        currentRoute: currentPath,
        contextTitle: `Batch ${sub?.batchNumber}` || 'Submission Verification',
        entityType: 'field_submission',
        entityId: id,
        entityData: sub,
      };
    }
    if (currentPath.startsWith('/knowledge/doc-')) {
      const id = currentPath.split('/')[2];
      const doc = campaignStore.getDocument(id);
      return {
        currentRoute: currentPath,
        contextTitle: doc?.title || 'Knowledge Memo',
        entityType: 'document',
        entityId: id,
        entityData: doc,
      };
    }
    if (currentPath.startsWith('/issues/iss-')) {
      const id = currentPath.split('/')[2];
      const issue = campaignStore.getIssue(id);
      return {
        currentRoute: currentPath,
        contextTitle: issue?.title || 'Operational Issue',
        entityType: 'issue',
        entityId: id,
        entityData: issue,
      };
    }
    return {
      currentRoute: currentPath,
      contextTitle: 'Campaign Command HQ',
      entityType: 'overview',
    };
  };

  const context = getRouteContext();
  const suggestedPrompts = aiService.getSuggestedPrompts(context);

  // Initialize welcome message when drawer opens
  useEffect(() => {
    if (isAiDrawerOpen && messages.length === 0) {
      setMessages([
        {
          id: 'msg-init',
          role: 'assistant',
          content: `**Campaign AI Intelligence Engine Active.**\n\nI am grounded in live campaign records across people, meetings, commitments, field OCR submissions, and strategy documents.\n\nHow can I support your operational decision-making today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [isAiDrawerOpen, messages.length]);

  // Handle initial prompt passed from global search or buttons
  useEffect(() => {
    if (isAiDrawerOpen && aiInitialPrompt) {
      handleSend(aiInitialPrompt);
      clearAiInitialPrompt();
    }
  }, [isAiDrawerOpen, aiInitialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (userPrompt?: string) => {
    const textToSend = userPrompt || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: AIMessage = {
      id: `msg-usr-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await aiService.ask(textToSend, context);
      setMessages((prev) => [...prev, aiResponse]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          role: 'assistant',
          content: 'An error occurred while querying the intelligence repository. Please retry.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteAction = async (action: AIActionProposal) => {
    setActionStatus((prev) => ({
      ...prev,
      [action.id]: { status: 'executing' },
    }));

    const result = await aiService.executeProposedAction(action);

    setActionStatus((prev) => ({
      ...prev,
      [action.id]: {
        status: result.success ? 'done' : 'failed',
        message: result.message,
      },
    }));
  };

  const handleSourceClick = (chip: SourceChip) => {
    switch (chip.type) {
      case 'person':
        navigate(`/people/${chip.id}`);
        break;
      case 'meeting':
        navigate(`/meetings/${chip.id}`);
        break;
      case 'commitment':
        navigate('/commitments');
        break;
      case 'field_submission':
        navigate(`/field/submissions/${chip.id}`);
        break;
      case 'document':
        navigate(`/knowledge/${chip.id}`);
        break;
      case 'issue':
        navigate(`/issues/${chip.id}`);
        break;
    }
    closeAiDrawer();
  };

  if (!isAiDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#032221]/70 backdrop-blur-sm transition-opacity"
        onClick={closeAiDrawer}
      />

      {/* Slide-over Panel */}
      <div className="fixed inset-y-0 right-0 flex max-w-full">
        <div className="w-full sm:w-[540px] md:w-[600px] glass-panel-elevated h-full shadow-2xl flex flex-col border-l border-[#00DF81]/30 z-10 animate-in slide-in-from-right duration-200">
          
          {/* Drawer Header */}
          <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#AACBC4]/15 bg-[#06302B]/95 flex items-center justify-between">
            <div className="flex items-center space-x-2.5 sm:space-x-3 overflow-hidden">
              <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-xl bg-gradient-to-tr from-[#002DF8] via-[#03624C] to-[#00DF81] p-0.5 flex items-center justify-center shadow-sm shrink-0">
                <div className="w-full h-full bg-[#032221] rounded-[10px] flex items-center justify-center text-[#00DF81]">
                  <Sparkles className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                </div>
              </div>
              <div className="overflow-hidden">
                <h3 className="font-serif-heading text-base sm:text-lg font-semibold text-[#F1F7F6] truncate">
                  Campaign AI Intelligence
                </h3>
                <div className="flex items-center space-x-1.5 text-[10px] sm:text-[11px] text-[#AACBC4] truncate">
                  <span className="w-2 h-2 rounded-full bg-[#00DF81] animate-pulse shrink-0" />
                  <span className="truncate">Context: <strong className="text-[#00DF81]">{context.contextTitle}</strong></span>
                </div>
              </div>
            </div>

            <button
              onClick={closeAiDrawer}
              className="p-1.5 rounded-full text-[#AACBC4] hover:text-[#F1F7F6] hover:bg-[#08453A] transition-colors shrink-0 ml-2 cursor-pointer hover:cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Context Banner */}
          {context.contextTitle ? (
            <div className="px-4 sm:px-6 py-2 bg-[#002DF8]/10 border-b border-[#AACBC4]/10 flex items-center justify-between text-[11px] sm:text-xs text-[#AACBC4]">
              <div className="flex items-center space-x-1.5 truncate mr-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00DF81] shrink-0" />
                <span className="truncate">Active Page: <strong>{context.contextTitle}</strong></span>
              </div>
              <span className="text-[10px] font-mono text-[#707D7D] shrink-0 uppercase">{context.entityType}</span>
            </div>
          ) : null}

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${
                  msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    msg.role === 'user'
                      ? 'bg-[#00DF81] text-[#032221]'
                      : 'bg-[#08453A] text-[#00DF81] border border-[#00DF81]/30'
                  }`}
                >
                  {msg.role === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#00DF81]/20 border border-[#00DF81]/40 text-[#F1F7F6]'
                      : 'glass-panel border border-[#AACBC4]/20 text-[#F1F7F6]'
                  }`}
                >
                  <div className="whitespace-pre-wrap space-y-2">
                    {msg.content.split('\n\n').map((para, i) => (
                      <p key={i} className="leading-relaxed">
                        {para}
                      </p>
                    ))}
                  </div>

                  {/* Source Chips */}
                  {msg.sourceChips && msg.sourceChips.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#AACBC4]/15 space-y-1.5">
                      <p className="text-[10px] uppercase tracking-wider font-semibold text-[#AACBC4]">
                        Referenced Operational Records:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.sourceChips.map((chip) => (
                          <button
                            key={chip.id}
                            onClick={() => handleSourceClick(chip)}
                            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[#08453A] hover:bg-[#00DF81]/20 border border-[#AACBC4]/20 text-[#AACBC4] hover:text-[#00DF81] text-[11px] font-medium transition-colors"
                          >
                            <span>{chip.title}</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Action Proposal */}
                  {msg.proposedAction && (
                    <div className="mt-3 p-3.5 rounded-xl bg-[#032221]/90 border border-[#00DF81]/40 space-y-2">
                      <div className="flex items-center space-x-2 text-[#00DF81] font-semibold text-xs">
                        <Zap className="w-4 h-4" />
                        <span>Proposed Operational Action (Human Sign-off Required)</span>
                      </div>
                      <p className="text-xs text-[#AACBC4]">{msg.proposedAction.summary}</p>

                      {actionStatus[msg.proposedAction.id]?.status === 'done' ? (
                        <div className="p-2 rounded-lg bg-[#00DF81]/15 text-[#00DF81] text-xs flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>{actionStatus[msg.proposedAction.id].message || 'Action executed successfully.'}</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 pt-1">
                          <Button
                            size="sm"
                            variant="primary"
                            isLoading={actionStatus[msg.proposedAction.id]?.status === 'executing'}
                            onClick={() => handleExecuteAction(msg.proposedAction!)}
                          >
                            Confirm & Execute
                          </Button>
                          <span className="text-[11px] text-[#707D7D]">Will record to audit log</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-2 text-right">
                    <span className="text-[10px] text-[#707D7D]">{msg.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center space-x-3 text-xs text-[#00DF81] animate-pulse">
                <div className="w-8 h-8 rounded-xl bg-[#08453A] flex items-center justify-center border border-[#00DF81]/30">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                </div>
                <span>Querying institutional memory & synthesizing brief...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts */}
          <div className="p-4 bg-[#06302B]/60 border-t border-[#AACBC4]/15 space-y-2">
            <p className="text-[10px] uppercase font-semibold tracking-wider text-[#AACBC4]/70">
              Contextual Suggested Inquiries:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {suggestedPrompts.slice(0, 3).map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  disabled={isLoading}
                  className="px-3 py-1.5 rounded-full bg-[#032221]/80 hover:bg-[#08453A] border border-[#AACBC4]/20 text-[#AACBC4] hover:text-[#00DF81] text-xs transition-colors text-left truncate max-w-full cursor-pointer hover:cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-[#032221]/95 border-t border-[#AACBC4]/15">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center space-x-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about voter turnout, meetings, commitments, or documents..."
                className="flex-1 bg-[#06302B]/80 border border-[#AACBC4]/25 rounded-full px-4 py-2.5 text-sm text-[#F1F7F6] placeholder-[#707D7D] focus:outline-none focus:border-[#00DF81]"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2.5 rounded-full bg-[#00DF81] text-[#032221] hover:bg-[#2CC295] disabled:opacity-40 transition-colors shrink-0 cursor-pointer hover:cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[10px] text-center text-[#707D7D] mt-2">
              All AI recommendations undergo human audit gates. No actions execute without operator authorization.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
