import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Chip,
  CircularProgress,
  Fade,
  Button,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Send as SendIcon,
  Psychology as AIIcon,
  Person as PersonIcon,
  Attachment as AttachIcon,
  Mic as MicIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import apiService, { type TeamMember, type ChatContext } from '../services/apiService';

/**
 * AIChatInterface Component
 * 
 * This component handles AI chat interactions and automatically processes AI responses
 * to hide <think></think> sections from the user interface while preserving them
 * for internal processing.
 * 
 * Features:
 * - Automatically extracts and hides <think> sections from AI responses
 * - Provides optional toggle to show/hide AI reasoning process
 * - Supports task creation, risk analysis, and general recommendations
 * - Fallback mode when backend is unavailable
 */

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'task_creation' | 'risk_analysis' | 'recommendation';
  thinking_process?: string[];
  metadata?: {
    project?: string;
    assignee?: string;
    priority?: string;
    tasks?: string[];
    suggested_task?: {
      title: string;
      description: string;
      estimated_hours: number;
      priority: string;
      suggested_assignee: string;
      skills_required: string[];
    };
  };
  actions?: Array<{
    type: string;
    data: any;
  }>;
}

interface AIChatInterfaceProps {
  mode: 'light' | 'dark';
  onTaskCreate?: (task: any) => void;
  onProjectUpdate?: (project: any) => void;
}

const AIChatInterface: React.FC<AIChatInterfaceProps> = ({ mode, onTaskCreate, onProjectUpdate }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI Project Manager. I can help you create tasks, analyze project risks, assign work, and provide recommendations. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [showThinkingProcess, setShowThinkingProcess] = useState<{ [messageId: string]: boolean }>({});
  const [lastMessageId, setLastMessageId] = useState('1'); // Track the last message ID
  const [animatedMessages, setAnimatedMessages] = useState<Set<string>>(new Set(['1'])); // Track which messages have been animated
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Function to process AI response and hide thinking sections
  const processAIResponse = (rawResponse: string): { displayText: string; thinkingProcess: string[] } => {
    // Extract thinking sections using regex
    const thinkRegex = /<think>([\s\S]*?)<\/think>/gi;
    const thinkingMatches = [...rawResponse.matchAll(thinkRegex)];
    
    // Extract thinking content
    const thinkingProcess = thinkingMatches.map(match => match[1].trim());
    
    // Remove thinking sections from display text
    const displayText = rawResponse.replace(thinkRegex, '').trim();
    
    return { displayText, thinkingProcess };
  };

  // Toggle thinking process visibility for a specific message
  const toggleThinkingProcess = (messageId: string) => {
    setShowThinkingProcess(prev => ({
      ...prev,
      [messageId]: !prev[messageId]
    }));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Connect to DeepSeek R1 backend
  const sendToDeepSeekR1 = async (userMessage: string): Promise<Message> => {
    setIsThinking(true);
    
    try {
      // Get context for AI
      const context = {
        current_project: 'web-redesign',
        user_role: 'team_lead',
        available_team: [
          { id: '1', name: 'Sarah Wilson', skills: ['react', 'typescript'], availability: 6, role: 'frontend_developer' },
          { id: '2', name: 'Mike Chen', skills: ['node.js', 'mongodb'], availability: 4, role: 'backend_developer' },
          { id: '3', name: 'Alex Kim', skills: ['devops', 'aws'], availability: 8, role: 'devops_engineer' },
        ],
      };

      const response = await apiService.sendChatMessage(userMessage, null, context);
      
      setIsThinking(false);

      // Process the AI response to extract thinking sections
      const { displayText, thinkingProcess } = processAIResponse(response.response);

      // Convert backend response to frontend message format
      return {
        id: response.message_id || Date.now().toString(),
        text: displayText,
        sender: 'ai',
        timestamp: new Date(),
        type: (response.type as 'text' | 'task_creation' | 'risk_analysis' | 'recommendation') || 'text',
        thinking_process: thinkingProcess.length > 0 ? thinkingProcess : (response.thinking_process || []),
        metadata: response.metadata,
        actions: response.actions || [],
      };

    } catch (error) {
      setIsThinking(false);
      console.error('Error connecting to DeepSeek R1:', error);
      
      // Fallback to mock response if backend is not available
      return await simulateFallbackResponse(userMessage);
    }
  };

  // Fallback mock response when backend is unavailable
  const simulateFallbackResponse = async (userMessage: string): Promise<Message> => {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('create task') || lowerMessage.includes('new task')) {
      const mockResponse = "<think>User is asking to create a task. I need to analyze the request and provide a structured response with task details and recommendations.</think>\n\nI'll create a new task for you. Based on your request, I've identified the following:\n\n• Task: Frontend UI Implementation\n• Estimated effort: 8 hours\n• Recommended assignee: Sarah Wilson (Frontend specialist)\n• Priority: High\n• Dependencies: Design mockups completion\n\nShould I proceed with creating this task?";
      
      const { displayText, thinkingProcess } = processAIResponse(mockResponse);
      
      return {
        id: Date.now().toString(),
        text: displayText,
        sender: 'ai',
        timestamp: new Date(),
        type: 'task_creation',
        thinking_process: thinkingProcess,
        metadata: {
          suggested_task: {
            title: 'Frontend UI Implementation',
            description: 'Implement the new user interface components',
            estimated_hours: 8,
            priority: 'High',
            suggested_assignee: 'Sarah Wilson',
            skills_required: ['react', 'typescript', 'css']
          }
        },
        actions: [{
          type: 'create_task',
          data: {
            title: 'Frontend UI Implementation',
            assignee: 'sarah_wilson_id',
            priority: 'high'
          }
        }],
      };
    }
    
    if (lowerMessage.includes('risk') || lowerMessage.includes('analyze')) {
      const mockResponse = "<think>The user wants a risk analysis. I should evaluate current project status, identify potential issues, and provide actionable recommendations.</think>\n\nI've analyzed the current project risks:\n\n🔴 **High Risk**: Mobile App project is 15% behind schedule\n🟡 **Medium Risk**: Database migration complexity may cause delays\n🟢 **Low Risk**: API integration on track\n\n**Recommendations**:\n1. Allocate additional resources to Mobile App\n2. Break down database migration into smaller tasks\n3. Schedule daily check-ins for high-risk items";
      
      const { displayText, thinkingProcess } = processAIResponse(mockResponse);
      
      return {
        id: Date.now().toString(),
        text: displayText,
        sender: 'ai',
        timestamp: new Date(),
        type: 'risk_analysis',
        thinking_process: thinkingProcess,
      };
    }
    
    const mockResponse = "<think>The user sent a simple greeting. Since the backend isn't available, I should explain the fallback mode and offer basic assistance.</think>\n\nI understand your request. I'm currently running in fallback mode since the DeepSeek R1 backend isn't available. Please ensure your backend server is running at http://localhost:8000 for full AI capabilities.";
    
    const { displayText, thinkingProcess } = processAIResponse(mockResponse);
    
    return {
      id: Date.now().toString(),
      text: displayText,
      sender: 'ai',
      timestamp: new Date(),
      thinking_process: thinkingProcess,
    };
  };

  // Handle action button clicks
  const handleActionClick = async (action: { type: string; data: any }) => {
    try {
      let successMessage = '';
      
      switch (action.type) {
        case 'create_task':
          // Try to call the backend API
          try {
            await apiService.createTask(action.data);
            successMessage = `✅ Task "${action.data.title}" created successfully!`;
          } catch (error) {
            successMessage = `📋 Task creation initiated: "${action.data.title}" (Demo mode)`;
          }
          break;
          
        case 'assign_task':
          try {
            await apiService.assignTask(action.data.task_id, action.data.assignee_id);
            successMessage = `✅ Task assigned to ${action.data.assignee_name || 'team member'}!`;
          } catch (error) {
            successMessage = `👤 Task assignment initiated (Demo mode)`;
          }
          break;
          
        case 'update_project':
          try {
            await apiService.updateProject(action.data.project_id, action.data);
            successMessage = '✅ Project updated successfully!';
          } catch (error) {
            successMessage = '📊 Project update initiated (Demo mode)';
          }
          break;
          
        default:
          successMessage = `🔄 Action "${action.type}" initiated (Demo mode)`;
      }
      
      // Add success message to chat
      const actionMessage: Message = {
        id: Date.now().toString(),
        text: successMessage,
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
      };
      
      setMessages(prev => [...prev, actionMessage]);
      setLastMessageId(actionMessage.id);
      setAnimatedMessages(prev => new Set([...prev, actionMessage.id])); // Mark as animated
      
      // Also trigger the callback if provided
      if (action.type === 'create_task' && onTaskCreate) {
        onTaskCreate(action.data);
      }
      if (action.type === 'update_project' && onProjectUpdate) {
        onProjectUpdate(action.data);
      }
      
    } catch (error) {
      console.error('Error executing action:', error);
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: `❌ Failed to execute action: ${error instanceof Error ? error.message : 'Unknown error'}`,
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setLastMessageId(errorMessage.id);
      setAnimatedMessages(prev => new Set([...prev, errorMessage.id])); // Mark as animated
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setLastMessageId(userMessage.id);
    setAnimatedMessages(prev => new Set([...prev, userMessage.id])); // Mark as animated
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResponse = await sendToDeepSeekR1(inputValue);
      setMessages(prev => [...prev, aiResponse]);
      setLastMessageId(aiResponse.id);
      setAnimatedMessages(prev => new Set([...prev, aiResponse.id])); // Mark as animated
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage = {
        id: Date.now().toString(),
        text: "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment.",
        sender: 'ai' as const,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      setLastMessageId(errorMessage.id);
      setAnimatedMessages(prev => new Set([...prev, errorMessage.id])); // Mark as animated
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    const newMessage = {
      id: Date.now().toString(),
      text: "Chat cleared. How can I help you with your project management needs?",
      sender: 'ai' as const,
      timestamp: new Date(),
    };
    setMessages([newMessage]);
    setLastMessageId(newMessage.id);
    setAnimatedMessages(new Set([newMessage.id])); // Reset animated messages
  };

  const MessageBubble = ({ message, isNew = false }: { message: Message; isNew?: boolean }) => {
    const isAI = message.sender === 'ai';
    
    return (
      <motion.div
        initial={isNew ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: isAI ? 'flex-start' : 'flex-end',
            mb: 2,
            gap: 1,
          }}
        >
          {isAI && (
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                width: 32,
                height: 32,
              }}
            >
              <AIIcon sx={{ fontSize: 18 }} />
            </Avatar>
          )}
          
          <Box
            sx={{
              maxWidth: '70%',
              bgcolor: isAI 
                ? (mode === 'dark' ? 'rgba(41, 151, 255, 0.1)' : 'rgba(0, 102, 204, 0.1)')
                : (mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'),
              border: `1px solid ${isAI 
                ? (mode === 'dark' ? 'rgba(41, 151, 255, 0.3)' : 'rgba(0, 102, 204, 0.3)')
                : (mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)')}`,
              borderRadius: 3,
              p: 2,
            }}
          >
            {message.type && (
              <Box sx={{ mb: 1 }}>
                <Chip
                  size="small"
                  label={
                    message.type === 'task_creation' ? 'Task Creation' :
                    message.type === 'risk_analysis' ? 'Risk Analysis' :
                    message.type === 'recommendation' ? 'AI Recommendation' : 'Analysis'
                  }
                  color={
                    message.type === 'risk_analysis' ? 'warning' :
                    message.type === 'task_creation' ? 'success' : 'info'
                  }
                  variant="outlined"
                />
              </Box>
            )}
            
            <Typography
              variant="body2"
              sx={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {message.text}
            </Typography>

            {/* Toggle button for thinking process (only show if there is thinking process) */}
            {message.thinking_process && message.thinking_process.length > 0 && (
              <Button
                size="small"
                onClick={() => toggleThinkingProcess(message.id)}
                sx={{
                  mt: 1,
                  fontSize: '0.75rem',
                  textTransform: 'none',
                  color: 'text.secondary',
                  opacity: 0.7,
                  '&:hover': { opacity: 1 }
                }}
              >
                🧠 {showThinkingProcess[message.id] ? 'Hide' : 'Show'} AI Reasoning
              </Button>
            )}

            {/* DeepSeek R1 Thinking Process - Now Collapsible */}
            {message.thinking_process && message.thinking_process.length > 0 && showThinkingProcess[message.id] && (
              <Fade in={showThinkingProcess[message.id]}>
                <Box sx={{ 
                  mt: 2, 
                  p: 2, 
                  bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                  borderRadius: 2,
                  border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`
                }}>
                  <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, fontWeight: 600 }}>
                    🧠 AI Reasoning Process:
                  </Typography>
                  <Box component="ol" sx={{ margin: 0, paddingLeft: 2 }}>
                    {message.thinking_process.map((step, index) => (
                      <Typography key={index} component="li" variant="caption" sx={{ mb: 0.5, opacity: 0.8 }}>
                        {step}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              </Fade>
            )}

            {/* Action Buttons */}
            {message.actions && message.actions.length > 0 && (
              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {message.actions.map((action, index) => (
                  <Button
                    key={index}
                    variant="contained"
                    size="small"
                    onClick={() => handleActionClick(action)}
                    sx={{
                      bgcolor: action.type === 'create_task' ? 'success.main' : 
                                action.type === 'assign_task' ? 'warning.main' : 'primary.main',
                      '&:hover': {
                        bgcolor: action.type === 'create_task' ? 'success.dark' : 
                                  action.type === 'assign_task' ? 'warning.dark' : 'primary.dark',
                      }
                    }}
                  >
                    {action.type === 'create_task' && '📋 Create Task'}
                    {action.type === 'assign_task' && '👤 Assign Task'}
                    {action.type === 'update_project' && '📊 Update Project'}
                    {action.type === 'send_notification' && '📬 Notify Team'}
                  </Button>
                ))}
              </Box>
            )}
            
            {message.metadata && message.type === 'task_creation' && !message.actions && (
              <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => onTaskCreate?.(message.metadata)}
                  sx={{ mr: 1 }}
                >
                  Create Task
                </Button>
                <Button variant="outlined" size="small">
                  Modify
                </Button>
              </Box>
            )}
            
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', mt: 1, textAlign: isAI ? 'left' : 'right' }}
            >
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Typography>
          </Box>
          
          {!isAI && (
            <Avatar
              sx={{
                bgcolor: 'secondary.main',
                width: 32,
                height: 32,
              }}
            >
              <PersonIcon sx={{ fontSize: 18 }} />
            </Avatar>
          )}
        </Box>
      </motion.div>
    );
  };

  return (
    <Card
      sx={{
        height: isMobile ? '100vh' : '600px',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: mode === 'dark' ? 'rgba(17, 17, 17, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        borderRadius: isMobile ? 0 : 2,
      }}
    >
      {/* Chat Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <AIIcon />
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              AI Project Manager
            </Typography>
            <Typography variant="caption" color="text.secondary">
              DeepSeek R1 • Always online
            </Typography>
          </Box>
          {isThinking && (
            <Chip
              label="Thinking..."
              color="primary"
              size="small"
              icon={<CircularProgress size={12} sx={{ color: 'white' }} />}
            />
          )}
        </Box>
        
        <IconButton onClick={clearChat} size="small">
          <ClearIcon />
        </IconButton>
      </Box>

      {/* Messages Area */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
            borderRadius: '3px',
          },
        }}
      >
        {messages.map((message, index) => {
          // Check if this message should be animated (only if it's in the animatedMessages set)
          const isNew = !animatedMessages.has(message.id);
          
          // Add to animated messages if it's new
          if (isNew) {
            setAnimatedMessages(prev => new Set([...prev, message.id]));
          }
          
          return (
            <MessageBubble key={message.id} message={message} isNew={isNew} />
          );
        })}
        
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                <AIIcon sx={{ fontSize: 18 }} />
              </Avatar>
              <Box
                sx={{
                  bgcolor: mode === 'dark' ? 'rgba(41, 151, 255, 0.1)' : 'rgba(0, 102, 204, 0.1)',
                  border: `1px solid ${mode === 'dark' ? 'rgba(41, 151, 255, 0.3)' : 'rgba(0, 102, 204, 0.3)'}`,
                  borderRadius: 3,
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <CircularProgress size={16} />
                <Typography variant="body2">AI is thinking...</Typography>
              </Box>
            </Box>
          </Box>
        )}
        
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <TextField
            fullWidth
            multiline
            maxRows={3}
            placeholder="Ask AI to create tasks, analyze risks, or manage your projects..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
              },
            }}
          />
          <IconButton disabled>
            <AttachIcon />
          </IconButton>
          <IconButton disabled>
            <MicIcon />
          </IconButton>
          <IconButton
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
              '&:disabled': {
                bgcolor: 'action.disabled',
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
        
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', mt: 1, textAlign: 'center' }}
        >
          AI can help with task creation, risk analysis, team management, and project insights
        </Typography>
      </Box>
    </Card>
  );
};

export default AIChatInterface;
