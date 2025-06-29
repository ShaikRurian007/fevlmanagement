import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Drawer,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assignment as TaskIcon,
  TrendingUp as AnalyticsIcon,
  Chat as ChatIcon,
  Settings as SettingsIcon,
  Notifications as NotificationIcon,
  Add as AddIcon,
  MoreVert as MoreIcon,
  CheckCircle as CompleteIcon,
  Schedule as PendingIcon,
  Warning as RiskIcon,
  Group as TeamIcon,
  Psychology as AIIcon,
  Hub as IntegrationIcon,
  Person as PersonIcon,
  ExitToApp as ExitToAppIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import AIChatInterface from './AIChatInterface';

interface DashboardProps {
  mode: 'light' | 'dark';
  user: {
    name: string;
    email: string;
    role: string;
    avatar: string;
  };
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ mode, user, onLogout }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  // Mock data - replace with real API calls
  const dashboardData = {
    overview: {
      totalProjects: 12,
      activeTasks: 34,
      completedThisWeek: 18,
      teamMembers: 8,
      aiRecommendations: 5,
    },
    recentActivity: [
      { id: 1, action: "AI created new task", project: "Web Redesign", time: "2 minutes ago", type: "ai" },
      { id: 2, action: "Sprint planning completed", project: "Mobile App", time: "1 hour ago", type: "milestone" },
      { id: 3, action: "Risk detected in Database migration", project: "Backend Upgrade", time: "3 hours ago", type: "risk" },
    ],
    activeProjects: [
      { id: 1, name: "Web Redesign", progress: 75, status: "On Track", priority: "High", dueDate: "Dec 15", team: 5 },
      { id: 2, name: "Mobile App", progress: 45, status: "At Risk", priority: "Critical", dueDate: "Dec 20", team: 3 },
      { id: 3, name: "API Integration", progress: 90, status: "Ahead", priority: "Medium", dueDate: "Dec 10", team: 4 },
    ],
    upcomingTasks: [
      { id: 1, title: "Review UI mockups", assignee: "Sarah Wilson", priority: "High", dueDate: "Today" },
      { id: 2, title: "Database optimization", assignee: "Mike Chen", priority: "Medium", dueDate: "Tomorrow" },
      { id: 3, title: "API testing", assignee: "Alex Johnson", priority: "Low", dueDate: "Dec 12" },
    ],
    aiInsights: [
      { type: "recommendation", message: "Consider allocating more resources to Mobile App project to meet deadline" },
      { type: "risk", message: "Database migration may face delays due to complexity. Recommend breaking into smaller tasks" },
      { type: "optimization", message: "Team productivity has increased 23% this week with AI task assignments" },
    ],
  };

  const StatusChip = ({ status }: { status: string }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'On Track': return 'success';
        case 'At Risk': return 'warning';
        case 'Ahead': return 'info';
        default: return 'default';
      }
    };
    return <Chip label={status} color={getStatusColor(status) as any} size="small" />;
  };

  const PriorityChip = ({ priority }: { priority: string }) => {
    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case 'Critical': return 'error';
        case 'High': return 'warning';
        case 'Medium': return 'info';
        case 'Low': return 'success';
        default: return 'default';
      }
    };
    return <Chip label={priority} color={getPriorityColor(priority) as any} size="small" variant="outlined" />;
  };

  const handleChatOpen = () => {
    setChatOpen(true);
  };

  const handleChatClose = () => {
    setChatOpen(false);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleUserMenuClose();
    onLogout();
  };

  const handleMobileDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const sidebarContent = (
    <Box sx={{ width: isMobile ? 280 : 280, pt: 1, px: 2 }}>
      <List sx={{ p: 0 }}>
        {[
          { icon: <DashboardIcon />, label: 'Overview', active: true },
          { icon: <TaskIcon />, label: 'Tasks & Projects' },
          { icon: <AnalyticsIcon />, label: 'Analytics' },
          { icon: <ChatIcon />, label: 'AI Assistant' },
          { icon: <TeamIcon />, label: 'Team Management' },
          { icon: <IntegrationIcon />, label: 'Integrations' },
          { icon: <SettingsIcon />, label: 'Settings' },
        ].map((item, index) => (
          <ListItem
            key={index}
            component="div"
            disablePadding
            sx={{ mb: 0.5 }}
          >
            <Box
              sx={{
                width: '100%',
                borderRadius: 2,
                bgcolor: item.active ? 'primary.main' : 'transparent',
                color: item.active ? 'white' : 'inherit',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                px: 2,
                py: 1.5,
                mx: 2, // Add small margin to prevent touching sidebar borders
                '&:hover': {
                  bgcolor: item.active ? 'primary.dark' : 'action.hover',
                  transform: 'translateX(2px)',
                },
              }}
              onClick={() => {
                if (isMobile) {
                  setMobileDrawerOpen(false);
                }
              }}
            >
              <Box sx={{ color: 'inherit', minWidth: 36, mr: 2, display: 'flex' }}>
                {item.icon}
              </Box>
              <Typography variant="body2" sx={{ fontWeight: item.active ? 600 : 500 }}>
                {item.label}
              </Typography>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Top Navigation Bar */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          bgcolor: mode === 'dark' ? 'rgba(17, 17, 17, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          px: { xs: 2, sm: 3 },
          py: 2,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isMobile && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleMobileDrawerToggle}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography
              variant={isMobile ? "h6" : "h5"}
              sx={{
                fontWeight: 'bold',
                background: mode === 'dark'
                  ? 'linear-gradient(90deg, #2997FF, #5AC8FA)'
                  : 'linear-gradient(90deg, #0066CC, #AF52DE)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {isMobile ? 'Fevl AI' : 'Fevl AI Manager'}
            </Typography>
            {!isMobile && <Chip label="AI Active" color="success" size="small" icon={<AIIcon />} />}
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
            <IconButton size={isMobile ? 'small' : 'medium'}>
              <Badge badgeContent={3} color="error">
                <NotificationIcon />
              </Badge>
            </IconButton>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                cursor: 'pointer',
                p: 1,
                borderRadius: 2,
                '&:hover': {
                  bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                },
              }}
              onClick={handleUserMenuOpen}
            >
              <Avatar 
                src={user.avatar} 
                alt={user.name} 
                sx={{ 
                  width: isMobile ? 32 : 40, 
                  height: isMobile ? 32 : 40 
                }}
              />
              {!isMobile && (
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {user.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user.role}
                  </Typography>
                </Box>
              )}
            </Box>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleUserMenuClose}
              PaperProps={{
                sx: {
                  bgcolor: mode === 'dark' ? 'rgba(17, 17, 17, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                  borderRadius: 2,
                  mt: 1,
                  minWidth: 160,
                },
              }}
            >
              <MenuItem onClick={handleUserMenuClose}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon sx={{ fontSize: 18 }} />
                  Profile
                </Box>
              </MenuItem>
              <MenuItem onClick={handleUserMenuClose}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SettingsIcon sx={{ fontSize: 18 }} />
                  Settings
                </Box>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
                  <ExitToAppIcon sx={{ fontSize: 18 }} />
                  Logout
                </Box>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex' }}>
        {/* Desktop Sidebar */}
        {!isMobile && (
          <Box
            sx={{
              width: 280,
              bgcolor: mode === 'dark' ? 'rgba(17, 17, 17, 0.8)' : 'rgba(249, 250, 251, 0.8)',
              borderRight: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              minHeight: 'calc(100vh - 80px)',
              p: 2,
            }}
          >
            {sidebarContent}
          </Box>
        )}

        {/* Mobile Sidebar Drawer */}
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileDrawerOpen}
          onClose={handleMobileDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          PaperProps={{
            sx: {
              bgcolor: mode === 'dark' ? 'rgba(17, 17, 17, 0.95)' : 'rgba(249, 250, 251, 0.95)',
              backdropFilter: 'blur(10px)',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}>
            <Typography variant="h6" sx={{ flex: 1, fontWeight: 600 }}>
              Menu
            </Typography>
            <IconButton onClick={handleMobileDrawerToggle}>
              <CloseIcon />
            </IconButton>
          </Box>
          {sidebarContent}
        </Drawer>

        {/* Main Content Area */}
        <Box sx={{ flex: 1, p: { xs: 2, sm: 3 }, width: { xs: '100%', md: 'calc(100% - 280px)' } }}>
          {/* Quick Stats Overview */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: '1fr', 
              sm: 'repeat(2, 1fr)', 
              md: 'repeat(2, 1fr)',
              lg: 'repeat(4, 1fr)' 
            }, 
            gap: { xs: 2, sm: 3 }, 
            mb: { xs: 3, sm: 4 } 
          }}>
            {[
              { title: 'Active Projects', value: dashboardData.overview.totalProjects, icon: <TaskIcon />, color: 'primary' },
              { title: 'Tasks in Progress', value: dashboardData.overview.activeTasks, icon: <PendingIcon />, color: 'warning' },
              { title: 'Completed This Week', value: dashboardData.overview.completedThisWeek, icon: <CompleteIcon />, color: 'success' },
              { title: 'AI Recommendations', value: dashboardData.overview.aiRecommendations, icon: <AIIcon />, color: 'info' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                    border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: mode === 'dark' ? '0 8px 25px rgba(0,0,0,0.3)' : '0 8px 25px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography 
                          color="text.secondary" 
                          gutterBottom 
                          variant={isMobile ? "body2" : "body1"}
                        >
                          {stat.title}
                        </Typography>
                        <Typography 
                          variant={isMobile ? "h5" : "h4"} 
                          sx={{ fontWeight: 'bold' }}
                        >
                          {stat.value}
                        </Typography>
                      </Box>
                      <Avatar
                        sx={{
                          bgcolor: `${stat.color}.main`,
                          width: isMobile ? 48 : 56,
                          height: isMobile ? 48 : 56,
                        }}
                      >
                        {stat.icon}
                      </Avatar>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>

          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, 
            gap: { xs: 2, sm: 3 } 
          }}>
            {/* Active Projects */}
            <Box>
              <Card
                sx={{
                  bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                  border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 3,
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 2, sm: 0 }
                  }}>
                    <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: 600 }}>
                      Active Projects
                    </Typography>
                    <Button 
                      startIcon={<AddIcon />} 
                      variant="outlined" 
                      size={isMobile ? "small" : "medium"}
                      fullWidth={isMobile}
                    >
                      New Project
                    </Button>
                  </Box>
                  {dashboardData.activeProjects.map((project) => (
                    <Box key={project.id} sx={{ 
                      mb: 3, 
                      p: { xs: 1.5, sm: 2 }, 
                      border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, 
                      borderRadius: 2 
                    }}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start', 
                        mb: 2,
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: { xs: 1, sm: 0 }
                      }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography 
                            variant={isMobile ? "body1" : "subtitle1"} 
                            sx={{ fontWeight: 600 }}
                          >
                            {project.name}
                          </Typography>
                          <Typography 
                            variant={isMobile ? "caption" : "body2"} 
                            color="text.secondary"
                          >
                            Due: {project.dueDate} • Team: {project.team} members
                          </Typography>
                        </Box>
                        <Box sx={{ 
                          display: 'flex', 
                          gap: 1, 
                          alignItems: 'center',
                          flexWrap: 'wrap'
                        }}>
                          <StatusChip status={project.status} />
                          <PriorityChip priority={project.priority} />
                          <IconButton size="small">
                            <MoreIcon />
                          </IconButton>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <LinearProgress
                          variant="determinate"
                          value={project.progress}
                          sx={{ flex: 1, height: { xs: 6, sm: 8 }, borderRadius: 4 }}
                        />
                        <Typography 
                          variant={isMobile ? "caption" : "body2"} 
                          sx={{ fontWeight: 600, minWidth: 'fit-content' }}
                        >
                          {project.progress}%
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Box>

            {/* AI Insights & Upcoming Tasks */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
              {/* AI Insights */}
              <Card
                sx={{
                  bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                  border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Typography 
                    variant={isMobile ? "subtitle1" : "h6"} 
                    sx={{ 
                      fontWeight: 600, 
                      mb: 2, 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1 
                    }}
                  >
                    <AIIcon color="primary" />
                    AI Insights
                  </Typography>
                  {dashboardData.aiInsights.map((insight, index) => (
                    <Box key={index} sx={{ 
                      mb: 2, 
                      p: { xs: 1.5, sm: 2 }, 
                      bgcolor: 'action.hover', 
                      borderRadius: 2 
                    }}>
                      <Typography 
                        variant={isMobile ? "caption" : "body2"} 
                        sx={{ fontWeight: 500, mb: 1 }}
                      >
                        {insight.type === 'recommendation' && '💡 Recommendation'}
                        {insight.type === 'risk' && '⚠️ Risk Alert'}
                        {insight.type === 'optimization' && '🚀 Optimization'}
                      </Typography>
                      <Typography 
                        variant={isMobile ? "caption" : "body2"} 
                        color="text.secondary"
                        sx={{ lineHeight: 1.4 }}
                      >
                        {insight.message}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>

              {/* Upcoming Tasks */}
              <Card
                sx={{
                  bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                  border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Typography 
                    variant={isMobile ? "subtitle1" : "h6"} 
                    sx={{ fontWeight: 600, mb: 2 }}
                  >
                    Upcoming Tasks
                  </Typography>
                  {dashboardData.upcomingTasks.map((task) => (
                    <Box key={task.id} sx={{ 
                      display: 'flex', 
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      justifyContent: 'space-between', 
                      mb: 2, 
                      p: { xs: 1, sm: 1.5 }, 
                      border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, 
                      borderRadius: 1,
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: { xs: 1, sm: 0 }
                    }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography 
                          variant={isMobile ? "caption" : "body2"} 
                          sx={{ fontWeight: 500 }}
                        >
                          {task.title}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ display: 'block' }}
                        >
                          {task.assignee} • {task.dueDate}
                        </Typography>
                      </Box>
                      <PriorityChip priority={task.priority} />
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Box>
          </Box>

          {/* Recent Activity Feed */}
          <Card
            sx={{
              mt: { xs: 2, sm: 3 },
              bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
              border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography 
                variant={isMobile ? "subtitle1" : "h6"} 
                sx={{ fontWeight: 600, mb: 2 }}
              >
                Recent Activity
              </Typography>
              {dashboardData.recentActivity.map((activity) => (
                <Box key={activity.id} sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: { xs: 1.5, sm: 2 }, 
                  mb: 2, 
                  p: { xs: 1.5, sm: 2 }, 
                  bgcolor: 'action.hover', 
                  borderRadius: 2 
                }}>
                  <Avatar
                    sx={{
                      width: isMobile ? 28 : 32,
                      height: isMobile ? 28 : 32,
                      bgcolor: activity.type === 'ai' ? 'primary.main' : activity.type === 'risk' ? 'error.main' : 'success.main',
                    }}
                  >
                    {activity.type === 'ai' && <AIIcon sx={{ fontSize: isMobile ? 14 : 16 }} />}
                    {activity.type === 'risk' && <RiskIcon sx={{ fontSize: isMobile ? 14 : 16 }} />}
                    {activity.type === 'milestone' && <CompleteIcon sx={{ fontSize: isMobile ? 14 : 16 }} />}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography 
                      variant={isMobile ? "caption" : "body2"} 
                      sx={{ 
                        fontWeight: 500,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {activity.action}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ 
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {activity.project} • {activity.time}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>

          {/* AI Chat Floating Button */}
          <Fab
            color="primary"
            aria-label="chat"
            sx={{
              position: 'fixed',
              bottom: { xs: 80, sm: 16 }, // Higher on mobile to avoid overlapping with browser UI
              right: { xs: 16, sm: 16 },
              zIndex: 200,
              width: isMobile ? 48 : 56,
              height: isMobile ? 48 : 56,
            }}
            onClick={handleChatOpen}
          >
            <ChatIcon sx={{ fontSize: isMobile ? 20 : 24 }} />
          </Fab>

          {/* AI Chat Interface Dialog */}
          <Dialog
            open={chatOpen}
            onClose={handleChatClose}
            maxWidth="sm"
            fullWidth
            fullScreen={isMobile} // Full screen on mobile
            PaperProps={{
              sx: {
                ...(isMobile && {
                  m: 0,
                  borderRadius: 0,
                  height: '100%',
                }),
              },
            }}
          >
            <DialogTitle sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              p: { xs: 2, sm: 3 }
            }}>
              <Typography variant={isMobile ? "h6" : "h5"}>
                AI Chat Assistant
              </Typography>
              {isMobile && (
                <IconButton
                  edge="end"
                  color="inherit"
                  onClick={handleChatClose}
                  aria-label="close"
                >
                  <CloseIcon />
                </IconButton>
              )}
            </DialogTitle>
            <DialogContent sx={{ p: { xs: 1, sm: 2 } }}>
              <AIChatInterface 
                mode={mode}
                onTaskCreate={(task) => {
                  // Handle task creation
                  console.log('Task created:', task);
                }}
                onProjectUpdate={(project) => {
                  // Handle project update
                  console.log('Project updated:', project);
                }}
              />
            </DialogContent>
            {!isMobile && (
              <DialogActions>
                <Button onClick={handleChatClose} color="primary">
                  Close
                </Button>
              </DialogActions>
            )}
          </Dialog>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
