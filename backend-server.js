const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8000;

// Enable CORS for all origins (for development only)
app.use(cors({
  origin: '*', // Allow all origins for development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: false
}));

// Add middleware for logging requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} from ${req.ip}`);
  next();
});

app.use(express.json());

// Mock AI Chat endpoint
app.post('/api/v1/ai/chat', (req, res) => {
  const { message, conversation_id, context } = req.body;
  
  console.log('=== AI Chat Request ===');
  console.log('From IP:', req.ip);
  console.log('Headers:', req.headers);
  console.log('Body:', { message, context });
  console.log('======================');
  
  // Mock AI response based on message content
  let mockResponse = '';
  let responseType = 'text';
  let mockActions = [];
  
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('create task') || lowerMessage.includes('new task')) {
    mockResponse = `I'll create a new task for you based on your request: "${message}"\n\n• Task: Frontend Development\n• Estimated effort: 6 hours\n• Recommended assignee: Sarah Wilson\n• Priority: High\n• Status: Ready to start\n\nShould I proceed with creating this task?`;
    responseType = 'task_creation';
    mockActions = [{
      type: 'create_task',
      data: {
        title: 'Frontend Development Task',
        description: `Task created from: ${message}`,
        assignee: 'sarah_wilson',
        priority: 'high',
        estimated_hours: 6
      }
    }];
  } else if (lowerMessage.includes('risk') || lowerMessage.includes('analyze')) {
    mockResponse = `I've analyzed the current project status:\n\n🔴 **High Risk**: Database migration complexity\n🟡 **Medium Risk**: API integration timeline\n🟢 **Low Risk**: Frontend components on track\n\n**Recommendations**:\n1. Break down database tasks into smaller chunks\n2. Schedule additional testing time for API\n3. Consider parallel development approach`;
    responseType = 'risk_analysis';
  } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    mockResponse = `Hello! 👋 I'm your AI Project Manager assistant. I can help you with:\n\n• Creating and managing tasks\n• Risk analysis and recommendations\n• Team workload optimization\n• Project timeline planning\n• Resource allocation suggestions\n\nWhat would you like to work on today?`;
  } else {
    mockResponse = `I understand you're asking about: "${message}"\n\nAs your AI assistant, I can help you with project management tasks like:\n• Task creation and assignment\n• Risk assessment and mitigation\n• Resource planning and optimization\n• Timeline management\n• Team coordination\n\nHow can I assist you with your project needs?`;
  }
  
  // Simulate AI processing delay
  setTimeout(() => {
    res.json({
      message_id: `msg_${Date.now()}`,
      response: mockResponse,
      type: responseType,
      thinking_process: [
        'Analyzing user request and project context',
        'Evaluating available team resources and capacity',
        'Generating appropriate response and recommendations',
        'Formatting output for optimal user experience'
      ],
      metadata: {
        project: context?.current_project || 'web-redesign',
        user_role: context?.user_role || 'team_lead',
        timestamp: new Date().toISOString()
      },
      actions: mockActions
    });
  }, 1000);
});

// Task management endpoints
app.post('/api/v1/tasks', (req, res) => {
  console.log('Creating task:', req.body);
  res.json({
    id: `task_${Date.now()}`,
    ...req.body,
    status: 'created',
    created_at: new Date().toISOString()
  });
});

app.put('/api/v1/tasks/:id', (req, res) => {
  console.log('Updating task:', req.params.id, req.body);
  res.json({
    id: req.params.id,
    ...req.body,
    status: 'updated',
    updated_at: new Date().toISOString()
  });
});

app.post('/api/v1/tasks/:id/assign', (req, res) => {
  console.log('Assigning task:', req.params.id, 'to:', req.body.assignee_id);
  res.json({
    id: req.params.id,
    assignee_id: req.body.assignee_id,
    status: 'assigned',
    assigned_at: new Date().toISOString()
  });
});

// Project management endpoints
app.put('/api/v1/projects/:id', (req, res) => {
  console.log('Updating project:', req.params.id, req.body);
  res.json({
    id: req.params.id,
    ...req.body,
    status: 'updated',
    updated_at: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Mock Backend Server running on http://0.0.0.0:${PORT}`);
  console.log(`📱 Mobile access: http://YOUR_IP_ADDRESS:${PORT}`);
  console.log(`💻 Local access: http://localhost:${PORT}`);
  console.log('');
  console.log('Available endpoints:');
  console.log('- POST /api/v1/ai/chat - AI Chat interface');
  console.log('- POST /api/v1/tasks - Create task');
  console.log('- PUT /api/v1/tasks/:id - Update task');
  console.log('- POST /api/v1/tasks/:id/assign - Assign task');
  console.log('- PUT /api/v1/projects/:id - Update project');
  console.log('- GET /health - Health check');
});
