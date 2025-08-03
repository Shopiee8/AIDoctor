'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { DashboardLayout } from "@/components/dashboard-layout";
import { RoleGuard } from "@/components/role-guard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  SimpleBarChart, 
  SimpleLineChart, 
  SimpleDonutChart, 
  MetricCard, 
  ProgressRing, 
  Sparkline,
  ChartDataPoint,
  TimeSeriesData,
  ChartLoadingState
} from "@/components/charts/ai-dashboard-charts";
import { 
  Bot, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Settings, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Activity, 
  Clock, 
  Star, 
  MessageSquare, 
  BarChart3, 
  Key, 
  Bell,
  Calendar,
  Download,
  Filter,
  Search,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
  Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { 
  type AIAgent, 
  type ConsultationHistory, 
  getAgents, 
  getConsultations, 
  getAnalytics, 
  addAgent, 
  updateAgent, 
  deleteAgent,
  subscribeToAgents,
  subscribeToAnalytics
} from '@/services/aiProviderService';

export default function AiProviderDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isCreateAgentOpen, setIsCreateAgentOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);

  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [aiAgents, setAiAgents] = useState<AIAgent[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  const [consultationHistory, setConsultationHistory] = useState<ConsultationHistory[]>([]);

  interface AnalyticsData {
    totalConsultations: number;
    totalRevenue: number;
    averageRating: number;
    activeAgents: number;
    monthlyGrowth: number;
    topPerformingAgent: string;
    consultationTrends: Array<{ month: string; consultations: number; revenue: number }>;
    specialtyDistribution: Array<{ specialty: string; count: number; percentage: number }>;
  }

  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalConsultations: 0,
    totalRevenue: 0,
    averageRating: 0,
    activeAgents: 0,
    monthlyGrowth: 0,
    topPerformingAgent: 'N/A',
    consultationTrends: [],
    specialtyDistribution: []
  });

  const filteredAgents = aiAgents.filter(agent => {
    if (!agent) return false;
    const matchesSearch = agent.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.specialty?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || agent.status === filterStatus;
    return matchesSearch && matchesFilter;
  }) as AIAgent[];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-red-500';
      case 'training': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'inactive': return <XCircle className="h-4 w-4" />;
      case 'training': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  // Fetch data on component mount and when user changes
  useEffect(() => {
    if (!user?.uid) return;
    
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load agents
        const agents = await getAgents(user.uid);
        setAiAgents(agents);
        
        // Load recent consultations
        const consultations = await getConsultations(user.uid);
        setConsultationHistory(consultations);
        
        // Load analytics
        const analyticsData = await getAnalytics(user.uid);
        setAnalytics(analyticsData);
        
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    
    // Set up real-time subscriptions
    const unsubscribeAgents = subscribeToAgents(user.uid, (agents) => {
      setAiAgents(agents);
    });
    
    const unsubscribeAnalytics = subscribeToAnalytics(user.uid, (analyticsData) => {
      setAnalytics(analyticsData);
    });
    
    // Initial data load
    loadData();
    
    // Cleanup subscriptions on unmount
    return () => {
      unsubscribeAgents();
      unsubscribeAnalytics();
    };
  }, [user?.uid]);
  
  // Handle create new agent
  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const newAgent: Omit<AIAgent, 'id' | 'createdAt' | 'lastActive'> = {
      name: formData.get('name') as string,
      specialty: formData.get('specialty') as string,
      status: 'active',
      avatar: '/avatars/default-avatar.jpg',
      description: formData.get('description') as string || '',
      consultations: 0,
      rating: 0,
      responseTime: 0,
      successRate: 0,
      revenue: 0,
      apiKey: `sk-ai-${Math.random().toString(36).substring(2, 10)}`,
      settings: {
        maxConsultations: parseInt(formData.get('maxConsultations') as string) || 30,
        workingHours: formData.get('workingHours') as string || '9:00-17:00',
        languages: (formData.get('languages') as string).split(',').map(lang => lang.trim()),
        autoRespond: formData.get('autoRespond') === 'on'
      },
      providerId: user.uid,
    };
    
    try {
      await addAgent(newAgent);
      toast.success('AI agent created successfully');
      setIsCreateAgentOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error creating agent:', error);
      toast.error('Failed to create AI agent');
    }
  };
  
  // Handle delete agent
  const handleDeleteAgent = async (agentId: string) => {
    if (!confirm('Are you sure you want to delete this agent? This action cannot be undone.')) {
      return;
    }
    
    try {
      await deleteAgent(agentId);
      toast.success('AI agent deleted successfully');
    } catch (error) {
      console.error('Error deleting agent:', error);
      toast.error('Failed to delete AI agent');
    }
  };
  
  // Format date for display
  const formatDate = (date: Date | string | undefined | null): string => {
    if (!date) return 'N/A';
    
    try {
      const d = typeof date === 'string' ? new Date(date) : new Date(date);
      if (isNaN(d.getTime())) return 'Invalid date';
      
      return d.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };
  
  // Prepare chart data
  const prepareChartData = () => {
    // Prepare consultation trends data
    const consultationTrendsData: TimeSeriesData[] = [];
    const now = new Date();
    
    // Generate data for the selected time range
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Find consultations for this date (in a real app, you'd group by day)
      const dayConsultations = consultationHistory.filter(consult => {
        const consultDate = new Date(consult.date);
        return consultDate.toDateString() === date.toDateString();
      });
      
      consultationTrendsData.push({
        timestamp: date.toISOString(),
        value: dayConsultations.length || 0
      });
    }
    
    // Prepare specialty distribution data
    const specialtyData: Record<string, number> = {};
    aiAgents.forEach(agent => {
      if (!specialtyData[agent.specialty]) {
        specialtyData[agent.specialty] = 0;
      }
      specialtyData[agent.specialty] += agent.consultations || 0;
    });
    
    const specialtyDistribution: ChartDataPoint[] = Object.entries(specialtyData).map(([specialty, count]) => ({
      label: specialty,
      value: count,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`
    }));
    
    // Prepare agent performance data
    const agentPerformance: ChartDataPoint[] = aiAgents.slice(0, 5).map(agent => ({
      label: agent.name.split(' ').slice(-1)[0], // Last name only
      value: agent.consultations || 0,
      color: agent.status === 'active' ? '#10B981' : agent.status === 'inactive' ? '#EF4444' : '#F59E0B'
    }));
    
    return {
      consultationTrends: consultationTrendsData,
      specialtyDistribution,
      agentPerformance
    };
  };
  
  const { consultationTrends, specialtyDistribution, agentPerformance } = prepareChartData();

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={['AI Provider']}>
      <DashboardLayout userRole="AI Provider">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">AI Provider Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your AI agents, monitor performance, and track revenue
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Select value={timeRange} onValueChange={(value: '7d' | '30d' | '90d') => setTimeRange(value)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Dialog open={isCreateAgentOpen} onOpenChange={setIsCreateAgentOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create AI Agent
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New AI Agent</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateAgent} className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Agent Name</Label>
                        <Input 
                          id="name" 
                          name="name"
                          placeholder="Dr. AI Name" 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="specialty">Specialty</Label>
                        <Select name="specialty" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select specialty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Cardiology">Cardiology</SelectItem>
                            <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                            <SelectItem value="Dermatology">Dermatology</SelectItem>
                            <SelectItem value="Neurology">Neurology</SelectItem>
                            <SelectItem value="Oncology">Oncology</SelectItem>
                            <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                            <SelectItem value="Surgery">Surgery</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        name="description"
                        placeholder="Brief description of the agent's expertise and capabilities" 
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="maxConsultations">Max Daily Consultations</Label>
                        <Input 
                          type="number" 
                          id="maxConsultations" 
                          name="maxConsultations"
                          placeholder="30" 
                          min="1" 
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="workingHours">Working Hours</Label>
                        <Input 
                          id="workingHours" 
                          name="workingHours"
                          placeholder="9:00-17:00" 
                          required 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="languages">Languages (comma-separated)</Label>
                      <Input 
                        id="languages" 
                        name="languages"
                        placeholder="English, Spanish, French" 
                        required 
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="autoRespond" name="autoRespond" defaultChecked />
                      <Label htmlFor="autoRespond">Enable Auto-Response</Label>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsCreateAgentOpen(false)}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4 mr-2" />
                        )}
                        Create Agent
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${analytics.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +{analytics.monthlyGrowth}% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Consultations</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalConsultations.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Across all AI agents
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.averageRating}/5.0</div>
                <p className="text-xs text-muted-foreground">
                  Patient satisfaction
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
                <Bot className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.activeAgents}</div>
                <p className="text-xs text-muted-foreground">
                  Out of {aiAgents.length} total
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="agents">AI Agents</TabsTrigger>
              <TabsTrigger value="consultations">Consultations</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="api-keys">API Keys</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              {/* Metrics Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                  title="Total Agents"
                  value={aiAgents.length}
                  change={0}
                  changeLabel="from last month"
                  icon={<Users className="h-4 w-4" />}
                  color="blue"
                />
                <MetricCard
                  title="Active Agents"
                  value={aiAgents.filter(a => a.status === 'active').length}
                  change={5.2}
                  changeLabel="from last month"
                  icon={<Activity className="h-4 w-4" />}
                  color="green"
                />
                <MetricCard
                  title="Total Consultations"
                  value={analytics.totalConsultations}
                  change={analytics.monthlyGrowth}
                  changeLabel="from last month"
                  icon={<MessageSquare className="h-4 w-4" />}
                  color="yellow"
                />
                <MetricCard
                  title="Total Revenue"
                  value={`$${analytics.totalRevenue.toLocaleString()}`}
                  change={analytics.monthlyGrowth}
                  changeLabel="from last month"
                  icon={<DollarSign className="h-4 w-4" />}
                  color="green"
                />
              </div>
              
              {/* Charts Row 1 */}
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Consultation Trends</CardTitle>
                    <CardDescription>Number of consultations over time</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    {isLoading ? (
                      <ChartLoadingState />
                    ) : (
                      <SimpleLineChart
                        data={consultationTrends}
                        title=""
                        height={250}
                        showDots={consultationTrends.length <= 30}
                      />
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Specialty Distribution</CardTitle>
                    <CardDescription>Consultations by specialty</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    {isLoading ? (
                      <ChartLoadingState />
                    ) : specialtyDistribution.length > 0 ? (
                      <SimpleDonutChart
                        data={specialtyDistribution}
                        title=""
                        size={200}
                        showLegend={true}
                      />
                    ) : (
                      <div className="text-center text-muted-foreground">No data available</div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              {/* Charts Row 2 */}
              <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Agent Performance</CardTitle>
                    <CardDescription>Top performing agents by consultations</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    {isLoading ? (
                      <ChartLoadingState />
                    ) : agentPerformance.length > 0 ? (
                      <SimpleBarChart
                        data={agentPerformance}
                        title=""
                        height={250}
                        showValues={true}
                      />
                    ) : (
                      <div className="text-center text-muted-foreground">No agent data available</div>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Agent Status</CardTitle>
                    <CardDescription>Distribution of agent status</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] flex flex-col items-center justify-center">
                    {isLoading ? (
                      <ChartLoadingState />
                    ) : aiAgents.length > 0 ? (
                      <div className="flex items-center justify-center gap-8">
                        <ProgressRing
                          value={(aiAgents.filter(a => a.status === 'active').length / aiAgents.length) * 100}
                          label="Active"
                          color="#10B981"
                          size={120}
                        />
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-sm">Active: {aiAgents.filter(a => a.status === 'active').length}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <span className="text-sm">Training: {aiAgents.filter(a => a.status === 'training').length}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span className="text-sm">Inactive: {aiAgents.filter(a => a.status === 'inactive').length}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground">No agents found</div>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Response Time</CardTitle>
                    <CardDescription>Average response time (minutes)</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] flex flex-col items-center justify-center">
                    {isLoading ? (
                      <ChartLoadingState />
                    ) : aiAgents.length > 0 ? (
                      <div className="text-center">
                        <div className="text-5xl font-bold text-primary mb-2">
                          {(
                            aiAgents.reduce((sum, agent) => sum + (agent.responseTime || 0), 0) / 
                            aiAgents.filter(a => a.responseTime > 0).length || 0
                          ).toFixed(1)}
                        </div>
                        <p className="text-muted-foreground">minutes average</p>
                        <div className="mt-6">
                          <Sparkline 
                            data={aiAgents
                              .filter(a => a.responseTime > 0)
                              .slice(0, 10)
                              .map(a => a.responseTime)
                              .sort((a, b) => a - b)
                            } 
                            width={180} 
                            height={60}
                            color="#3B82F6"
                            showDots={true}
                          />
                          <p className="text-xs text-muted-foreground mt-2">Response times for top 10 agents</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground">No response data available</div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Main Content */}
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="agents">AI Agents ({aiAgents.length})</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Recent Activity</CardTitle>
                      <Button variant="ghost" size="sm" className="text-primary">
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                              <div className="space-y-2">
                                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-3 w-32 bg-gray-100 rounded animate-pulse"></div>
                              </div>
                            </div>
                            <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div>No recent activity</div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Performance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-end justify-between gap-2">
                    {analytics.consultationTrends.length > 0 ? (
                      analytics.consultationTrends.map((trend, index) => (
                        <div key={index} className="flex flex-col items-center gap-2 flex-1">
                          <div className="text-xs text-muted-foreground">${trend.revenue}</div>
                          <div 
                            className="bg-primary rounded-t w-full min-h-[20px]"
                            style={{ height: `${(trend.consultations / 500) * 200}px` }}
                          />
                          <div className="text-xs font-medium">{trend.month}</div>
                          <div className="text-xs text-muted-foreground">{trend.consultations}</div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        No data available
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* AI Agents Tab */}
            <TabsContent value="agents" className="space-y-4">
              {/* Filters */}
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <Input
                    placeholder="Search agents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Agents Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredAgents.map((agent) => (
                  <Card key={agent.id} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={agent.avatar} />
                            <AvatarFallback>{agent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{agent.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{agent.specialty}</p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Agent
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Settings className="h-4 w-4 mr-2" />
                              Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Agent
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={`w-fit ${getStatusColor(agent.status)} text-white`}
                      >
                        {getStatusIcon(agent.status)}
                        <span className="ml-1 capitalize">{agent.status}</span>
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{agent.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Consultations</p>
                          <p className="font-medium">{agent.consultations}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Revenue</p>
                          <p className="font-medium">${agent.revenue}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Rating</p>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{agent.rating}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Response Time</p>
                          <p className="font-medium">{agent.responseTime}s</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Success Rate</span>
                          <span>{agent.successRate}%</span>
                        </div>
                        <Progress value={agent.successRate} className="h-2" />
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button size="sm" className="flex-1">
                          <Settings className="h-4 w-4 mr-2" />
                          Manage
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Consultations Tab */}
            <TabsContent value="consultations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Consultations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {consultationHistory.map((consultation) => (
                      <div key={consultation.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col">
                            <p className="font-medium">{consultation.patientName}</p>
                            <p className="text-sm text-muted-foreground">{consultation.agentName}</p>
                          </div>
                          <div className="flex flex-col">
                            <p className="text-sm">{formatDate(consultation.date)}</p>
                            <p className="text-xs text-muted-foreground">{consultation.duration} min</p>
                          </div>
                          <div className="flex flex-col">
                            <p className="text-sm font-medium">{consultation.diagnosis}</p>
                            <p className="text-xs text-muted-foreground">
                              {consultation.symptoms.join(', ')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{consultation.rating}</span>
                          </div>
                          <Badge 
                            variant={consultation.status === 'completed' ? 'default' : 'secondary'}
                          >
                            {consultation.status}
                          </Badge>
                          <p className="font-medium">${consultation.revenue}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Specialty Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analytics.specialtyDistribution.map((specialty, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{specialty.specialty}</span>
                          <span>{specialty.count} ({specialty.percentage}%)</span>
                        </div>
                        <Progress value={specialty.percentage} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <p className="text-2xl font-bold text-green-600">94.2%</p>
                        <p className="text-sm text-muted-foreground">Avg Success Rate</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">2.1s</p>
                        <p className="text-sm text-muted-foreground">Avg Response Time</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">18.3</p>
                        <p className="text-sm text-muted-foreground">Avg Revenue/Consultation</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <p className="text-2xl font-bold text-orange-600">97%</p>
                        <p className="text-sm text-muted-foreground">Patient Satisfaction</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* API Keys Tab */}
            <TabsContent value="api-keys" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    API Key Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {aiAgents.map((agent) => (
                    <div key={agent.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{agent.name}</p>
                        <p className="text-sm text-muted-foreground font-mono">{agent.apiKey}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Copy
                        </Button>
                        <Button size="sm" variant="outline">
                          Regenerate
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Provider Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications about consultations and revenue
                        </p>
                      </div>
                      <Switch checked={false} onCheckedChange={() => {}} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Auto-Accept Consultations</p>
                        <p className="text-sm text-muted-foreground">
                          Automatically accept consultation requests
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Performance Analytics</p>
                        <p className="text-sm text-muted-foreground">
                          Share anonymous performance data for improvements
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Billing Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Revenue Share</Label>
                        <p className="text-sm text-muted-foreground">85% (You keep 85% of consultation fees)</p>
                      </div>
                      <div className="space-y-2">
                        <Label>Payment Method</Label>
                        <p className="text-sm text-muted-foreground">Bank Transfer (Monthly)</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </RoleGuard>
  );
}