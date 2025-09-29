import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
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
    { topic: 'Integration', Remembering: 0, Understanding: 0, Applying: 0, Analyzing: 0, Evaluating: 0, Creating: 0 }
  ],
  'past14days': [
    { topic: 'Complex Numbers', Remembering: 15, Understanding: 22, Applying: 28, Analyzing: 15, Evaluating: 5, Creating: 2 },
    { topic: 'Vectors & Matrices', Remembering: 18, Understanding: 32, Applying: 38, Analyzing: 22, Evaluating: 8, Creating: 4 },
    { topic: 'Limits & Continuity', Remembering: 12, Understanding: 26, Applying: 30, Analyzing: 18, Evaluating: 6, Creating: 2 },
    { topic: 'Derivatives', Remembering: 28, Understanding: 45, Applying: 65, Analyzing: 35, Evaluating: 15, Creating: 7 },
    { topic: 'Integration', Remembering: 0, Understanding: 0, Applying: 0, Analyzing: 0, Evaluating: 0, Creating: 0 }
  ],
  'past30days': [
    { topic: 'Complex Numbers', Remembering: 25, Understanding: 35, Applying: 45, Analyzing: 25, Evaluating: 8, Creating: 4 },
    { topic: 'Vectors & Matrices', Remembering: 32, Understanding: 52, Applying: 62, Analyzing: 35, Evaluating: 15, Creating: 8 },
    { topic: 'Limits & Continuity', Remembering: 20, Understanding: 38, Applying: 48, Analyzing: 28, Evaluating: 10, Creating: 4 },
    { topic: 'Derivatives', Remembering: 45, Understanding: 75, Applying: 95, Analyzing: 55, Evaluating: 25, Creating: 12 },
    { topic: 'Integration', Remembering: 5, Understanding: 8, Applying: 3, Analyzing: 1, Evaluating: 0, Creating: 0 }
  ],
  'alltime': [
    { topic: 'Complex Numbers', Remembering: 35, Understanding: 48, Applying: 65, Analyzing: 38, Evaluating: 12, Creating: 6 },
    { topic: 'Vectors & Matrices', Remembering: 42, Understanding: 68, Applying: 85, Analyzing: 48, Evaluating: 22, Creating: 12 },
    { topic: 'Limits & Continuity', Remembering: 28, Understanding: 52, Applying: 68, Analyzing: 38, Evaluating: 15, Creating: 6 },
    { topic: 'Derivatives', Remembering: 58, Understanding: 95, Applying: 125, Analyzing: 75, Evaluating: 35, Creating: 18 },
    { topic: 'Integration', Remembering: 8, Understanding: 15, Applying: 8, Analyzing: 3, Evaluating: 1, Creating: 0 }
  ]
};

// Conversation trend data for different time periods
const conversationTrendData = {
  'past7days': [
    { date: 'Mon 22', conversations: 12 },
    { date: 'Tue 23', conversations: 8 },
    { date: 'Wed 24', conversations: 15 },
    { date: 'Thu 25', conversations: 11 },
    { date: 'Fri 26', conversations: 9 },
    { date: 'Sat 27', conversations: 6 },
    { date: 'Sun 28', conversations: 4 }
  ],
  'past14days': [
    { date: 'Mon 15', conversations: 10 },
    { date: 'Tue 16', conversations: 14 },
    { date: 'Wed 17', conversations: 18 },
    { date: 'Thu 18', conversations: 16 },
    { date: 'Fri 19', conversations: 12 },
    { date: 'Sat 20', conversations: 8 },
    { date: 'Sun 21', conversations: 5 },
    { date: 'Mon 22', conversations: 12 },
    { date: 'Tue 23', conversations: 8 },
    { date: 'Wed 24', conversations: 15 },
    { date: 'Thu 25', conversations: 11 },
    { date: 'Fri 26', conversations: 9 },
    { date: 'Sat 27', conversations: 6 },
    { date: 'Sun 28', conversations: 4 }
  ],
  'past30days': [
    { date: 'Sep 1', conversations: 8 },
    { date: 'Sep 3', conversations: 12 },
    { date: 'Sep 5', conversations: 16 },
    { date: 'Sep 7', conversations: 14 },
    { date: 'Sep 9', conversations: 18 },
    { date: 'Sep 11', conversations: 15 },
    { date: 'Sep 13', conversations: 20 },
    { date: 'Sep 15', conversations: 10 },
    { date: 'Sep 17', conversations: 18 },
    { date: 'Sep 19', conversations: 12 },
    { date: 'Sep 21', conversations: 5 },
    { date: 'Sep 23', conversations: 8 },
    { date: 'Sep 25', conversations: 15 },
    { date: 'Sep 27', conversations: 6 },
    { date: 'Sep 28', conversations: 4 }
  ],
  'alltime': [
    { date: 'Jul', conversations: 45 },
    { date: 'Aug', conversations: 78 },
    { date: 'Sep', conversations: 95 }
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
                    <p>Average accuracy across all question types this week</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-gray-900">84%</p>
              <p className="text-sm font-medium text-gray-700">Avg Accuracy</p>
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
                <strong>Complex Numbers:</strong> 92% accuracy rate with 85% retention over 2 weeks.<br/>
                <strong>Derivatives:</strong> 78% accuracy, improving consistency (+12% this week).<br/>
                <strong>Integration:</strong> Early exploration phase - foundation building needed.
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
          
          <div className="mt-4 p-3 bg-orange-50 rounded-lg">
            <p className="text-sm text-orange-800 mb-2">
              <strong>Activity Insights:</strong> {
                activityTimeframe === 'past7days' ? 'Peak activity on Wednesday with 15 conversations. Your engagement follows a typical weekly pattern with higher activity mid-week.' :
                activityTimeframe === 'past14days' ? 'Consistent engagement pattern over two weeks. Notice the improvement in conversation frequency in the recent week.' :
                activityTimeframe === 'past30days' ? 'Monthly view shows steady learning progression with notable increases around key topic transitions.' :
                'Long-term trend reveals steady growth in engagement from 45 to 95 conversations per month, indicating developing learning habits.'
              }
            </p>
            <p className="text-sm text-orange-700">
              <strong>Recommendation:</strong> {
                activityTimeframe === 'past7days' ? 'Maintain your Wednesday peak performance and try to increase weekend engagement for better consistency.' :
                activityTimeframe === 'past14days' ? 'Your recent week shows improvement. Focus on maintaining this upward trend.' :
                activityTimeframe === 'past30days' ? 'Consider spacing out your conversations more evenly to optimize retention and understanding.' :
                'Excellent long-term progress! Continue building on this foundation for sustained learning success.'
              }
            </p>
          </div>
        </CardContent>
      </Card>


    </div>
  );
}