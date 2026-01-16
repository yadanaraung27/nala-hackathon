import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { BarChart3, TrendingUp, Clock, Brain, Target, Info, Calendar, MessageCircle } from 'lucide-react';
import { formatCurrentWeekRange } from '../../utils/academicWeek';

// Focused analytics data - key metrics only
const weeklyLearningPattern = [
  { day: 'Mon', sessions: 12, accuracy: 85, focus_time: 2.5 },
  { day: 'Tue', sessions: 15, accuracy: 78, focus_time: 3.2 },
  { day: 'Wed', sessions: 18, accuracy: 92, focus_time: 4.1 },
  { day: 'Thu', sessions: 20, accuracy: 88, focus_time: 3.8 },
  { day: 'Fri', sessions: 16, accuracy: 81, focus_time: 2.9 },
  { day: 'Sat', sessions: 8, accuracy: 89, focus_time: 1.5 },
  { day: 'Sun', sessions: 6, accuracy: 91, focus_time: 1.2 }
];

const topicMasteryData = [
  { topic: 'Complex Numbers', mastery: 95, questions: 45 },
  { topic: 'Vectors & Matrices', mastery: 88, questions: 52 },
  { topic: 'Limits & Continuity', mastery: 82, questions: 38 },
  { topic: 'Derivatives', mastery: 45, questions: 67 }, // Current focus
  { topic: 'Integration', mastery: 0, questions: 0 },
  { topic: 'Applications', mastery: 0, questions: 0 }
];

// Stacked bar chart data for Bloom's Taxonomy by topic
const bloomsTaxonomyData = {
  'past7days': [
    { topic: 'Complex Numbers', Remembering: 8, Understanding: 12, Applying: 15, Analyzing: 8, Evaluating: 2, Creating: 0 },
    { topic: 'Vectors & Matrices', Remembering: 10, Understanding: 18, Applying: 20, Analyzing: 12, Evaluating: 4, Creating: 2 },
    { topic: 'Limits & Continuity', Remembering: 6, Understanding: 14, Applying: 16, Analyzing: 10, Evaluating: 3, Creating: 1 },
    { topic: 'Derivatives', Remembering: 15, Understanding: 25, Applying: 35, Analyzing: 20, Evaluating: 8, Creating: 4 },
    // { topic: 'Integration', Remembering: 0, Understanding: 0, Applying: 0, Analyzing: 0, Evaluating: 0, Creating: 0 }
  ],
  'past14days': [
    { topic: 'Complex Numbers', Remembering: 15, Understanding: 22, Applying: 28, Analyzing: 15, Evaluating: 5, Creating: 2 },
    { topic: 'Vectors & Matrices', Remembering: 18, Understanding: 32, Applying: 38, Analyzing: 22, Evaluating: 8, Creating: 4 },
    { topic: 'Limits & Continuity', Remembering: 12, Understanding: 26, Applying: 30, Analyzing: 18, Evaluating: 6, Creating: 2 },
    { topic: 'Derivatives', Remembering: 28, Understanding: 45, Applying: 65, Analyzing: 35, Evaluating: 15, Creating: 7 },
    // { topic: 'Integration', Remembering: 0, Understanding: 0, Applying: 0, Analyzing: 0, Evaluating: 0, Creating: 0 }
  ],
  'past30days': [
    { topic: 'Complex Numbers', Remembering: 25, Understanding: 35, Applying: 45, Analyzing: 25, Evaluating: 8, Creating: 4 },
    { topic: 'Vectors & Matrices', Remembering: 32, Understanding: 52, Applying: 62, Analyzing: 35, Evaluating: 15, Creating: 8 },
    { topic: 'Limits & Continuity', Remembering: 20, Understanding: 38, Applying: 48, Analyzing: 28, Evaluating: 10, Creating: 4 },
    { topic: 'Derivatives', Remembering: 45, Understanding: 75, Applying: 95, Analyzing: 55, Evaluating: 25, Creating: 12 },
    // { topic: 'Integration', Remembering: 5, Understanding: 8, Applying: 3, Analyzing: 1, Evaluating: 0, Creating: 0 }
  ],
  'alltime': [
    { topic: 'Complex Numbers', Remembering: 35, Understanding: 48, Applying: 65, Analyzing: 38, Evaluating: 12, Creating: 6 },
    { topic: 'Vectors & Matrices', Remembering: 42, Understanding: 68, Applying: 85, Analyzing: 48, Evaluating: 22, Creating: 12 },
    { topic: 'Limits & Continuity', Remembering: 28, Understanding: 52, Applying: 68, Analyzing: 38, Evaluating: 15, Creating: 6 },
    { topic: 'Derivatives', Remembering: 58, Understanding: 95, Applying: 125, Analyzing: 75, Evaluating: 35, Creating: 18 },
    // { topic: 'Integration', Remembering: 8, Understanding: 15, Applying: 8, Analyzing: 3, Evaluating: 1, Creating: 0 }
  ]
};

// Conversation trend data for different time periods
const conversationTrendData = {
  'past7days': [
    { date: 'Tue 27', conversations: 14 },
    { date: 'Wed 28', conversations: 18 },
    { date: 'Thu 29', conversations: 15 },
    { date: 'Fri 30', conversations: 12 },
    { date: 'Sat 31', conversations: 7 },
    { date: 'Sun 1', conversations: 5 },
    { date: 'Mon 2', conversations: 22 }
  ],
  'past14days': [
    { date: 'Tue 20', conversations: 11 },
    { date: 'Wed 21', conversations: 14 },
    { date: 'Thu 22', conversations: 13 },
    { date: 'Fri 23', conversations: 10 },
    { date: 'Sat 24', conversations: 6 },
    { date: 'Sun 25', conversations: 4 },
    { date: 'Mon 26', conversations: 16 },
    { date: 'Tue 27', conversations: 14 },
    { date: 'Wed 28', conversations: 18 },
    { date: 'Thu 29', conversations: 15 },
    { date: 'Fri 30', conversations: 12 },
    { date: 'Sat 31', conversations: 7 },
    { date: 'Sun 1', conversations: 5 },
    { date: 'Mon 2', conversations: 22 }
  ],
  'past30days': [
    { date: 'Jan 5', conversations: 2 },  
    { date: 'Jan 8', conversations: 5 },
    { date: 'Jan 12', conversations: 12 }, // Teaching Week 1 Start
    { date: 'Jan 14', conversations: 15 },
    { date: 'Jan 17', conversations: 8 },
    { date: 'Jan 19', conversations: 18 }, // Teaching Week 2 Start
    { date: 'Jan 21', conversations: 20 },
    { date: 'Jan 24', conversations: 9 },
    { date: 'Jan 26', conversations: 22 }, // Teaching Week 3 Start
    { date: 'Jan 28', conversations: 19 },
    { date: 'Jan 30', conversations: 14 },
    { date: 'Feb 1', conversations: 6 },
    { date: 'Feb 2', conversations: 25 }  
  ],
  'alltime': [
    { date: 'Jan', conversations: 245 },
    { date: 'Feb', conversations: 31 }
  ]
};

const dayColors = {
  Monday: '#3b82f6',    // Blue
  Tuesday: '#10b981',   // Green  
  Wednesday: '#f59e0b', // Orange
  Thursday: '#ef4444',  // Red
  Friday: '#8b5cf6',    // Purple
  Saturday: '#06b6d4',  // Cyan
  Sunday: '#f97316'     // Orange-red
};

export default function AnalyticsPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('past7days');
  const [activityTimeframe, setActivityTimeframe] = useState('past7days');

  const currentBloomsData = bloomsTaxonomyData[selectedTimeframe as keyof typeof bloomsTaxonomyData];
  const currentConversationData = conversationTrendData[activityTimeframe as keyof typeof conversationTrendData];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">Learning Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Deep insights into your learning patterns • {formatCurrentWeekRange()}</p>
        
        {/* Subtle Learning Science Banner */}
        <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-600" />
              <p className="text-sm text-purple-700">
                <strong>Active Learning:</strong> Your daily challenges create feedback loops that adapt to optimize retention and understanding.
              </p>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-purple-400 hover:text-purple-600 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p className="mb-2"><strong>Evidence-Based Learning:</strong></p>
                  <p>This platform uses spaced repetition, retrieval practice, and adaptive difficulty based on cognitive science research to maximize your learning efficiency.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Key Performance Indicators - Updated design matching the image */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500 rounded-lg">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-purple-400 hover:text-purple-600" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Total number of learning conversations this week</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-gray-900">47</p>
              <p className="text-sm font-medium text-gray-700">Chat Sessions</p>
              <p className="text-sm text-green-600">↑ 12% vs last week</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-blue-400 hover:text-blue-600" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Average accuracy on daily challenges this week, calculated from your performance across all challenge question types and difficulty levels</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-gray-900">84%</p>
              <p className="text-sm font-medium text-gray-700">Challenge Accuracy</p>
              <p className="text-sm text-green-600">Above class avg (78%)</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-500 rounded-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-orange-400 hover:text-orange-600" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Total active learning time this week</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-gray-900">18h</p>
              <p className="text-sm font-medium text-gray-700">Study Time</p>
              <div className="space-y-1">
                <p className="text-sm text-blue-600">1.8h avg/session</p>
                <p className="text-sm text-green-600">↑ 3h vs last week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Recommendations - Moved up to replace removed charts */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Target className="h-5 w-5" />
            Personalized Learning Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-blue-800">Focus Areas This Week</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Derivatives: Practice chain rule applications</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Integration: Start with basic techniques</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Problem-solving: Increase analyzing-level questions</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-blue-800">Optimal Study Schedule</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span>Best time: Wednesday-Thursday 2-4 PM</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span>Target: 4-5 sessions per week</span>
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-blue-600" />
                  <span>Focus: 45-90 minute sessions for optimal retention</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-blue-200">
            <p className="text-sm text-blue-700">
              <strong>Weekly Goal:</strong> Increase Derivatives mastery from 45% to 65% by practicing 
              chain rule and product rule applications during your peak performance hours.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Bloom's Taxonomy Stacked Bar Chart with Date Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              Question Types by Module (Bloom's Taxonomy)
            </div>
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="past7days">Past 7 days</SelectItem>
                <SelectItem value="past14days">Past 14 days</SelectItem>
                <SelectItem value="past30days">Past 30 days</SelectItem>
                <SelectItem value="alltime">All time</SelectItem>
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={currentBloomsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="topic" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <RechartsTooltip />
              <Bar dataKey="Remembering" stackId="a" fill="#3b82f6" />
              <Bar dataKey="Understanding" stackId="a" fill="#f59e0b" />
              <Bar dataKey="Applying" stackId="a" fill="#8b5cf6" />
              <Bar dataKey="Analyzing" stackId="a" fill="#06b6d4" />
              <Bar dataKey="Evaluating" stackId="a" fill="#ec4899" />
              <Bar dataKey="Creating" stackId="a" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
          
          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-4 justify-center">
            {[
              { name: 'Remembering', color: '#3b82f6' },
              { name: 'Understanding', color: '#f59e0b' },
              { name: 'Applying', color: '#8b5cf6' },
              { name: 'Analyzing', color: '#06b6d4' },
              { name: 'Evaluating', color: '#ec4899' },
              { name: 'Creating', color: '#f97316' }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-xs text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            {/* Question Complexity Insight */}
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h5 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Question Complexity Analysis
              </h5>
              <p className="text-sm text-purple-700 leading-relaxed">
                Your question complexity is progressively increasing across modules. In <strong>Derivatives</strong>, 
                you're successfully moving from basic remembering (15%) to higher-order thinking with 
                applying (28% total questions) and analyzing (16%).
              </p>
              <div className="mt-2 p-2 bg-purple-100 rounded border border-purple-300">
                <p className="text-xs text-purple-600">
                  <strong>Growth Pattern:</strong> 57% of your questions are now at applying-level or higher, 
                  indicating strong conceptual understanding progression.
                </p>
              </div>
            </div>

            {/* Topic Mastery Insight */}
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h5 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Topic Mastery Assessment
              </h5>
              <p className="text-sm text-green-700 leading-relaxed">
                <strong>Complex Numbers:</strong> 92% daily challenge accuracy with strong long-term retention - ready for advanced applications.<br/>
                <strong>Derivatives:</strong> 78% accuracy improving (+12% this week) as challenges adapt to your learning pace.<br/>
                <strong>Integration:</strong> Starting phase - daily challenges will introduce concepts gradually based on your readiness.
              </p>
              <div className="mt-2 p-2 bg-green-100 rounded border border-green-300">
                <p className="text-xs text-green-600">
                  <strong>Mastery Metric:</strong> Based on accuracy rate × retention × higher-order thinking success.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Challenge Performance Feedback Loop */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Daily Challenge Performance Trends
          </CardTitle>
          <p className="text-sm text-gray-500">How your challenge accuracy creates active learning feedback loops</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Trend Chart */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                Accuracy Improvement Over Time
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      <p>Shows how your daily challenge performance creates a feedback loop - better accuracy leads to more challenging questions, driving continuous improvement</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </h4>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={[
                  { week: 'Week 1', accuracy: 72, difficulty: 'Basic' },
                  { week: 'Week 2', accuracy: 78, difficulty: 'Basic' },
                  { week: 'Week 3', accuracy: 81, difficulty: 'Medium' },
                  { week: 'Week 4', accuracy: 79, difficulty: 'Medium' },
                  // { week: 'Week 7', accuracy: 84, difficulty: 'Medium' }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis domain={[70, 90]} />
                  <RechartsTooltip 
                    formatter={(value, name) => [value + '%', 'Challenge Accuracy']}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Adaptive Learning Insights */}
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Active Learning Feedback Loop
                </h5>
                <div className="space-y-2 text-sm text-green-700">
                  <p>• <strong>Week 3:</strong> 81% accuracy triggered difficulty increase to Medium level</p>
                  <p>• <strong>Week 4:</strong> Slight dip (79%) as system adapted to your improved skills</p>
                  {/* <p>• <strong>Week 7:</strong> Strong recovery (84%) shows successful adaptation</p> */}
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h6 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Retrieval Strength Building
                </h6>
                <p className="text-sm text-blue-700">
                  Your consistent daily practice is building <strong>retrieval strength</strong> - the ability to recall information under pressure. 
                  This week's performance shows 40% improvement in complex problem-solving speed.
                </p>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="w-full">
                      <div className="text-left">
                        <h6 className="font-medium text-amber-800 mb-1 flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Forgetting Curve Optimization
                        </h6>
                        <p className="text-sm text-amber-700">
                          Next review of Limits & Continuity concepts in 2 days for optimal retention
                        </p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      <p><strong>Spaced Repetition:</strong> Based on Ebbinghaus's forgetting curve, reviewing Derivatives in 2 days will maximize long-term retention and prevent the typical 50% memory loss within 24 hours.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Activity Pattern - Conversation Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-orange-600" />
              Learning Activity Pattern
            </div>
            <Select value={activityTimeframe} onValueChange={setActivityTimeframe}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="past7days">Past 7 days</SelectItem>
                <SelectItem value="past14days">Past 14 days</SelectItem>
                <SelectItem value="past30days">Past 30 days</SelectItem>
                <SelectItem value="alltime">All time</SelectItem>
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Conversation Trends</h4>
            <p className="text-sm text-gray-600">Track your learning engagement over time through chat interactions</p>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={currentConversationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <RechartsTooltip 
                formatter={(value) => [value, 'Conversations']}
                labelFormatter={(label) => `${label}`}
              />
              <Area
                type="monotone"
                dataKey="conversations"
                stroke="#f97316"
                fill="#f97316"
                fillOpacity={0.3}
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
          
          <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <h5 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Activity Pattern Insights
            </h5>
            <p className="text-sm text-orange-700 leading-relaxed mb-3">
              {
                activityTimeframe === 'past7days' ? 'Your learning activity peaks on Wednesday-Thursday with the highest conversation counts. This aligns with optimal mid-week concentration levels when cognitive performance is typically strongest.' :
                activityTimeframe === 'past14days' ? 'Two-week pattern shows consistent mid-week peaks, with notable improvement in overall engagement frequency during the recent week.' :
                activityTimeframe === 'past30days' ? 'Monthly analysis reveals steady learning progression with strategic increases around key topic transitions, following natural cognitive performance cycles.' :
                'Your engagement has surged significantly since the start of Semester 2 on 12 January 2026, averaging over 55 conversations per week during the first three teaching weeks.'
              }
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="p-2 bg-orange-100 rounded border border-orange-300">
                <p className="text-sm text-orange-800">
                  <strong>Peak Performance:</strong> {
                    activityTimeframe === 'past7days' ? 'Wednesday (15 conversations)' :
                    activityTimeframe === 'past14days' ? 'Mid-week consistency' :
                    activityTimeframe === 'past30days' ? 'Steady monthly growth' :
                    'Sustained improvement'
                  }
                </p>
              </div>
              <div className="p-2 bg-orange-100 rounded border border-orange-300">
                <p className="text-sm text-orange-800">
                  <strong>Goal:</strong> {
                    activityTimeframe === 'past7days' ? 'Maintain weekend engagement' :
                    activityTimeframe === 'past14days' ? 'Continue upward trend' :
                    activityTimeframe === 'past30days' ? 'Even distribution' :
                    'Build on foundation'
                  }
                </p>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="p-2 bg-orange-100 rounded border border-orange-300 cursor-help">
                      <p className="text-sm text-orange-800">
                        <strong>Optimal Spacing:</strong> 2-3 day gaps for retention
                      </p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p><strong>Distributed Practice:</strong> Research shows 2-3 day gaps between learning sessions improve retention by 60% compared to daily practice, allowing memory consolidation.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardContent>
      </Card>



    </div>
  );
}