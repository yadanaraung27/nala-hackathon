import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Calendar, Clock, BookOpen, Users, Target, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import CourseOverview from '../CourseOverview';

export default function CoursesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-semibold text-gray-900">Courses</h1>
        <p className="text-sm text-gray-500 mt-1">Track your course progress and upcoming deadlines</p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upcoming Deadlines */}
        <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-white" />
                <span className="font-semibold text-lg">Upcoming Deadlines</span>
              </div>
              <Badge className="bg-white text-orange-600 font-bold text-lg px-3 py-1">8</Badge>
            </div>
            
            <div className="space-y-2">
              <div className="text-white/90 text-sm">Next deadline in:</div>
              <div className="text-2xl font-bold">2 days</div>
              <div className="text-white/75 text-xs">Topic 1 Quiz - Monday 9:00 AM</div>
            </div>
            
            <Button variant="outline" className="mt-4 w-full bg-white text-orange-600 border-white hover:bg-orange-50">
              View All Deadlines
            </Button>
          </CardContent>
        </Card>

        {/* Completion Rate */}
        <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Target className="h-6 w-6 text-white" />
                <span className="font-semibold text-lg">Completion Rate</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-3xl font-bold mb-1">73%</div>
                <div className="text-green-100 text-sm">Overall Progress</div>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-white h-2 rounded-full" style={{ width: '73%' }}></div>
              </div>
              <div className="text-green-100 text-xs">8 of 11 modules completed</div>
            </div>
          </CardContent>
        </Card>

        {/* Current Focus */}
        <Card className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-white" />
                <span className="font-semibold text-lg">Current Focus</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-xl font-bold">Predicate Logic</div>
              <div className="text-blue-100 text-sm">Topic 3 • Module 3</div>
              <div className="flex items-center gap-2 mt-3">
                <div className="w-full bg-white/20 rounded-full h-1.5">
                  <div className="bg-white h-1.5 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <span className="text-blue-100 text-xs">45%</span>
              </div>
            </div>
            
            <Button variant="outline" className="mt-4 w-full bg-white text-blue-600 border-white hover:bg-blue-50">
              Continue Learning
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Course Schedule and Deadlines - Full Component */}
      <CourseOverview />

      {/* Detailed Course Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Course Modules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[
              {
                module: 'Module 1',
                title: 'Elementary Number Theory',
                topics: ['Prime Numbers', 'Divisibility', 'GCD & LCM', 'Modular Arithmetic'],
                progress: 100,
                status: 'completed',
                deadline: 'Completed',
                grade: 'A-'
              },
              {
                module: 'Module 2', 
                title: 'Propositional Logic',
                topics: ['Truth Tables', 'Logical Operators', 'Equivalences', 'Proof Techniques'],
                progress: 100,
                status: 'completed',
                deadline: 'Completed',
                grade: 'B+'
              },
              {
                module: 'Module 3',
                title: 'Predicate Logic',
                topics: ['Quantifiers', 'Domain & Range', 'Logical Inference', 'Proof by Contradiction'],
                progress: 45,
                status: 'in-progress',
                deadline: 'Due in 5 days',
                grade: null
              },
              {
                module: 'Module 4',
                title: 'Set Theory',
                topics: ['Set Operations', 'Cardinality', 'Relations', 'Functions'],
                progress: 0,
                status: 'upcoming',
                deadline: 'Starts in 12 days',
                grade: null
              }
            ].map((course, index) => (
              <div key={index} className="border rounded-lg p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge 
                        variant={course.status === 'completed' ? 'default' : course.status === 'in-progress' ? 'secondary' : 'outline'}
                        className={
                          course.status === 'completed' ? 'bg-green-100 text-green-800' :
                          course.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }
                      >
                        {course.module}
                      </Badge>
                      {course.status === 'completed' && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                      {course.status === 'in-progress' && <Clock className="h-4 w-4 text-blue-600" />}
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">{course.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {course.topics.map((topic, topicIndex) => (
                        <Badge key={topicIndex} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 mb-1">{course.deadline}</div>
                    {course.grade && (
                      <Badge className="bg-purple-100 text-purple-800">
                        Grade: {course.grade}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>

                <div className="flex gap-2">
                  {course.status === 'in-progress' && (
                    <Button size="sm">Continue Learning</Button>
                  )}
                  {course.status === 'upcoming' && (
                    <Button size="sm" variant="outline">Preview Content</Button>
                  )}
                  {course.status === 'completed' && (
                    <Button size="sm" variant="outline">Review Material</Button>
                  )}
                  <Button size="sm" variant="outline">
                    <FileText className="h-3 w-3 mr-1" />
                    Syllabus
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}