// API Service for DeepSeek R1 Integration

export interface TeamMember {
  id: string;
  name: string;
  skills: string[];
  availability: number;
  role: string;
}

export interface ChatContext {
  user_role?: string;
  current_project?: string | null;
  timestamp?: string;
  available_team?: TeamMember[];
}

export interface ChatRequest {
  message: string;
  conversation_id?: string | null;
  context?: ChatContext;
}

export interface ChatResponse {
  message_id: string;
  response: string;
  type?: 'text' | 'task_creation' | 'risk_analysis' | 'recommendation';
  thinking_process?: string[];
  metadata?: any;
  actions?: Array<{ type: string; data: any }>;
}

class ApiService {
  private baseURL: string;
  private token: string | null;

  constructor() {
    // Auto-detect the appropriate API URL for mobile/desktop access
    const getApiUrl = () => {
      // If environment variable is set, use it
      if (process.env.REACT_APP_API_URL) {
        return process.env.REACT_APP_API_URL;
      }
      
      // Check if we're on mobile or remote device
      const hostname = window.location.hostname;
      
      // If accessing via IP address (mobile/remote), use the same IP for API
      if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        return `http://${hostname}:8000`;
      }
      
      // Default to localhost for local development
      return 'http://localhost:8000';
    };

    this.baseURL = getApiUrl();
    this.token = localStorage.getItem('authToken');
    
    console.log('API Service initialized with baseURL:', this.baseURL);
  }

  // Set auth token
  setAuthToken(token: string): void {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  // Get auth headers
  getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Generic API call method
  async apiCall(endpoint: string, method: string = 'GET', data: any = null): Promise<any> {
    const url = `${this.baseURL}${endpoint}`;
    
    console.log(`Making API call: ${method} ${url}`);
    if (data) {
      console.log('Request data:', data);
    }
    
    const config: RequestInit = {
      method,
      headers: this.getHeaders(),
      mode: 'cors', // Explicitly set CORS mode
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      config.body = JSON.stringify(data);
    }

    try {
      console.log('Sending request with config:', config);
      const response = await fetch(url, config);
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('API Response:', result);
      return result;
    } catch (error) {
      console.error('API call failed:', error);
      console.error('URL:', url);
      console.error('Method:', method);
      console.error('Data:', data);
      throw error;
    }
  }

  // AI Chat API - Main DeepSeek R1 Integration
  async sendChatMessage(message: string, conversationId: string | null = null, context: ChatContext | null = null): Promise<ChatResponse> {
    const requestData: ChatRequest = {
      message,
      conversation_id: conversationId,
      context: context || this.getDefaultContext()
    };
    
    return this.apiCall('/api/v1/ai/chat', 'POST', requestData);
  }

  // Get default context for AI
  getDefaultContext(): ChatContext {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const currentProject = localStorage.getItem('currentProject');
    
    return {
      user_role: user.role || 'developer',
      current_project: currentProject || undefined,
      timestamp: new Date().toISOString(),
      available_team: this.getTeamData()
    };
  }

  // Mock team data (replace with real API call)
  getTeamData(): TeamMember[] {
    return [
      {
        id: '1',
        name: 'Sarah Wilson',
        skills: ['react', 'typescript', 'design'],
        availability: 6,
        role: 'frontend_developer'
      },
      {
        id: '2', 
        name: 'Mike Chen',
        skills: ['node.js', 'mongodb', 'apis'],
        availability: 4,
        role: 'backend_developer'
      },
      {
        id: '3',
        name: 'Alex Kim',
        skills: ['devops', 'aws', 'docker'],
        availability: 8,
        role: 'devops_engineer'
      }
    ];
  }

  // Task Management APIs
  async createTask(taskData: any): Promise<any> {
    return this.apiCall('/api/v1/tasks', 'POST', taskData);
  }

  async updateTask(taskId: string, taskData: any): Promise<any> {
    return this.apiCall(`/api/v1/tasks/${taskId}`, 'PUT', taskData);
  }

  async assignTask(taskId: string, assigneeId: string): Promise<any> {
    return this.apiCall(`/api/v1/tasks/${taskId}/assign`, 'POST', {
      assignee_id: assigneeId
    });
  }

  // Project Management APIs
  async updateProject(projectId: string, projectData: any): Promise<any> {
    return this.apiCall(`/api/v1/projects/${projectId}`, 'PUT', projectData);
  }
}

export default new ApiService();
