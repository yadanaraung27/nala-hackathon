import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { BarChart3, TrendingUp, Clock, Brain, Target, Activity, Users, BookOpen, MessageCircle } from 'lucide-react';
import MasteryLevel from '../MasteryLevel';

// Mock data for analytics
const learningActivityData = [
  { day: 'Mon', questions: 320, sessions: 12, hours: 2.5 },
  { day: 'Tue', questions: 285, sessions: 15, hours: 3.2 },
  { day: 'Wed', questions: 398, sessions: 18, hours: 4.1 },
  { day: 'Thu', questions: 423, sessions: 20, hours: 3.8 },
  { day: 'Fri', questions: 367, sessions: 16, hours: 2.9 },
  { day: 'Sat', questions: 189, sessions: 8, hours: 1.5 },
  { day: 'Sun', questions: 156, sessions: 6, hours: 1.2 }
];

const topicsDiscussedData = [
  { name: 'Data Structures', value: 35, color: '#8884d8' },
  { name: 'Algorithms', value: 28, color: '#82ca9d' },
  { name: 'Web Development', value: 22, color: '#ffc658' },
  { name: 'Database Systems', value: 15, color: '#ff7300' }
];

const learningPatternsData = [
  { time: '06:00', morning: 15, evening: 2 },
  { time: '08:00', morning: 45, evening: 5 },
  { time: '10:00', morning: 78, evening: 8 },
  { time: '12:00', morning: 92, evening: 12 },
  { time: '14:00', morning: 67, evening: 15 },
  { time: '16:00', morning: 45, evening: 25 },
  { time: '18:00', morning: 23, evening: 45 },
  { time: '20:00', morning: 12, evening: 78 },
  { time: '22:00', morning: 8, evening: 65 },
  { time: '24:00', morning: 3, evening: 25 }
];

const performanceMetrics = [
  { metric: 'Question Resolution Rate', current: 94, target: 95, trend: '+2%' },
  { metric: 'Learning Consistency', current: 87, target: 90, trend: '+5%' },
  { metric: 'Response Accuracy', current: 92, target: 95, trend: '+1%' },
  { metric: 'Topic Coverage', current: 78, target: 80, trend: '+3%' }
];

const weeklyProgressData = [
  { week: 'Week 1', completed: 12, target: 15 },
  { week: 'Week 2', completed: 18, target: 15 },
  { week: 'Week 3', completed: 14, target: 15 },
  { week: 'Week 4', completed: 20, target: 15 }
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-semibold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Comprehensive insights into your learning journey</p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-700">Conversation Sessions</h3>
              </div>
            </div>
            <div className="mb-2">
              <span className="text-3xl font-bold text-gray-900">142</span>
            </div>
            <p className="text-blue-600 text-sm font-medium">+12% this week</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-green-700">Topics Discussed</h3>
              </div>
            </div>
            <div className="mb-2">
              <span className="text-3xl font-bold text-gray-900">28</span>
            </div>
            <p className="text-green-600 text-sm font-medium">+3 new topics</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-purple-700">Learning Streak</h3>
              </div>
            </div>
            <div className="mb-2">
              <span className="text-3xl font-bold text-gray-900">23</span>
              <span className="text-lg text-gray-600 ml-1">days</span>
            </div>
            <p className="text-purple-600 text-sm font-medium">Personal best!</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <h3 className="font-semibold text-orange-700">Study Time</h3>
              </div>
            </div>
            <div className="mb-2">
              <span className="text-3xl font-bold text-gray-900">47</span>
              <span className="text-lg text-gray-600 ml-1">hours</span>
            </div>
            <p className="text-orange-600 text-sm font-medium">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Learning Activity Dashboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Learning Activity Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <h4 className="font-medium mb-3">Weekly Learning Sessions</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={learningActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sessions" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Mastery Level */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Mastery Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-4">
              <MasteryLevel />
            </div>
            <div className="text-center">
              <Button variant="outline" size="sm">
                View Detailed Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Topics Discussed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Topics Discussed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={topicsDiscussedData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {topicsDiscussedData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {topicsDiscussedData.map((topic, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: topic.color }}
                    ></div>
                    <span>{topic.name}</span>
                  </div>
                  <span className="font-medium">{topic.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Learning Patterns */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Learning Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <h4 className="font-medium mb-3">Daily Activity Pattern</h4>
              <p className="text-xs text-gray-500 mb-4">Your learning activity throughout the day</p>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={learningPatternsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="morning" stackId="1" stroke="#60a5fa" fill="#60a5fa" />
                  <Area type="monotone" dataKey="evening" stackId="1" stroke="#f59e0b" fill="#f59e0b" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span>Morning Learning</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Evening Learning</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{metric.metric}</h4>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      metric.current >= metric.target ? 'text-green-600' : 'text-yellow-600'
                    }`}
                  >
                    {metric.trend}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Current</span>
                    <span className="font-medium">{metric.current}%</span>
                  </div>
                  <Progress value={metric.current} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Target: {metric.target}%</span>
                    <span>{metric.current >= metric.target ? '✅ Met' : '🎯 In Progress'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Weekly Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyProgressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="target" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" fill="#60a5fa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <span>Target</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span>Completed</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}