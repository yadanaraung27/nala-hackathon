import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Brain, Info, X } from 'lucide-react';
import ImprovedQuestionOfTheDay from '../ImprovedQuestionOfTheDay';
import MasteryLevel from '../MasteryLevel';

// Mock data for learning activity
const engagementData = [
  { day: 'Mon', questions: 320, students: 45 },
  { day: 'Tue', questions: 285, students: 52 },
  { day: 'Wed', questions: 398, students: 67 },
  { day: 'Thu', questions: 423, students: 71 },
  { day: 'Fri', questions: 367, students: 58 },
  { day: 'Sat', questions: 189, students: 23 },
  { day: 'Sun', questions: 156, students: 19 }
];

interface HomepageProps {
  learningPreference: string | null;
  currentDate: string;
  onShowLearningStyleDetails: () => void;
  onShowQuiz: () => void;
  onStartChallenge: () => void;
}

export default function Homepage({ 
  learningPreference, 
  currentDate, 
  onShowLearningStyleDetails, 
  onShowQuiz,
  onStartChallenge 
}: HomepageProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-semibold text-gray-900">Learning Analytics Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">{currentDate}</p>
      </div>

      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 border-none text-white relative overflow-hidden">
        <CardContent className="p-6 relative z-10">
          {/* Subtle overlay for better text readability */}
          <div className="absolute inset-0 bg-black/10 rounded-lg"></div>
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 flex items-center justify-center text-8xl drop-shadow-lg">
                👨‍💻
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2 text-white drop-shadow-md">Welcome back, Student 👋</h2>
                <p className="text-base text-white mb-1 drop-shadow-sm">Your learning preference: <span className="font-semibold text-yellow-300">{learningPreference || 'Not set'}</span></p>
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 text-yellow-300 drop-shadow-sm" />
                  <button 
                    className="text-sm underline hover:no-underline text-yellow-300 drop-shadow-sm font-medium"
                    onClick={onShowLearningStyleDetails}
                  >
                    Learn more about your preference
                  </button>
                </div>
                <p className="text-sm text-white/95 drop-shadow-sm">Your chatbot interactions and daily questions are personalised to match your learning preference.</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white/95 text-gray-700 border-white hover:bg-white shadow-lg font-medium"
              onClick={onShowQuiz}
            >
              {learningPreference ? 'Retake Quiz' : 'Take Quiz'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Daily Challenge Section */}
      <div>
        <ImprovedQuestionOfTheDay 
          learningStyle={learningPreference} 
          onStartChallenge={onStartChallenge}
        />
      </div>

      {/* Course Overview Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Overview</h2>
      
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Deadlines */}
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-6 w-6 text-white" />
                  <span className="font-semibold text-lg">Upcoming Deadlines</span>
                </div>
                <Badge className="bg-white text-blue-600 font-bold text-lg px-3 py-1">5</Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                  <div className="w-8 h-8 bg-orange-400 rounded-md flex items-center justify-center">
                    <span className="text-white text-xs font-bold">T</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">Topic 1 Quiz</p>
                    <p className="text-blue-100 text-xs">09:00AM</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                  <div className="w-8 h-8 bg-orange-400 rounded-md flex items-center justify-center">
                    <span className="text-white text-xs font-bold">A</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">Assignment</p>
                    <p className="text-blue-100 text-xs">11:00AM</p>
                    <p className="text-red-300 text-xs">Due Soon</p>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" className="mt-4 w-full bg-white text-blue-600 border-white hover:bg-blue-50">
                View All
              </Button>
            </CardContent>
          </Card>

          {/* Topics */}
          <Card className="bg-white border-gray-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-4">Topics</h3>
              
              <div className="space-y-4">
                {[
                  { name: 'Elementary Number Theory', topic: 'Topic 1', level: 'Excellent', color: 'bg-yellow-400', button: 'Start Chat' },
                  { name: 'Proportional Logic', topic: 'Topic 2', level: 'Beginner (basic)', color: 'bg-green-400', button: 'Start Chat' },
                  { name: 'Predicate Logic', topic: 'Topic 3', level: 'Insufficient', color: 'bg-red-400', button: 'Start Chat' }
                ].map((topic, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Button variant="outline" size="sm" className="text-xs px-3 py-1">
                          {topic.button}
                        </Button>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{topic.name}</p>
                          <p className="text-xs text-gray-500">{topic.topic}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-20 ${topic.color} rounded-full`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Your Learning Analytics Section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Learning Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Conversation Sessions</p>
              <p className="text-3xl font-bold text-gray-900">100</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Topics Discussed</p>
              <p className="text-3xl font-bold text-gray-900">6</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Streaming</p>
              <p className="text-3xl font-bold text-gray-900">91</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Learning Activity Chart */}
            <div>
              <h4 className="font-medium mb-3">Learning Activity</h4>
              <p className="text-xs text-gray-500 mb-4">Track how you are doing compared to your industry average</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="questions" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="students" fill="#34d399" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Mastery Level Radar */}
            <div>
              <h4 className="font-medium mb-3">Mastery Level</h4>
              <div className="flex justify-center">
                <MasteryLevel />
              </div>
              <div className="flex justify-center mt-4">
                <Button variant="outline" size="sm">
                  View full report
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}