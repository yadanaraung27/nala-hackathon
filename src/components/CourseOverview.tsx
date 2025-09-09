import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Calendar, Clock, AlertTriangle, CheckCircle, BookOpen, Users, FileText } from 'lucide-react';

interface CourseEvent {
  id: string;
  title: string;
  type: 'assignment' | 'exam' | 'project' | 'quiz' | 'lecture';
  date: string;
  daysUntil: number;
  course: string;
  priority: 'high' | 'medium' | 'low';
  completed?: boolean;
  description?: string;
}

const mockCourseEvents: CourseEvent[] = [
  {
    id: '1',
    title: 'Data Structures Assignment 2',
    type: 'assignment',
    date: '2025-08-20',
    daysUntil: 8,
    course: 'CS2040S',
    priority: 'high',
    description: 'Implement binary search tree with deletion'
  },
  {
    id: '2',
    title: 'Midterm Exam',
    type: 'exam',
    date: '2025-08-25',
    daysUntil: 13,
    course: 'CS2106',
    priority: 'high',
    description: 'Operating Systems concepts'
  },
  {
    id: '3',
    title: 'Group Project Presentation',
    type: 'project',
    date: '2025-08-22',
    daysUntil: 10,
    course: 'CS3219',
    priority: 'medium',
    description: 'Software Engineering project demo'
  },
  {
    id: '4',
    title: 'Weekly Quiz 5',
    type: 'quiz',
    date: '2025-08-18',
    daysUntil: 6,
    course: 'CS3230',
    priority: 'medium',
    description: 'Algorithm analysis and design'
  },
  {
    id: '5',
    title: 'Machine Learning Assignment 1',
    type: 'assignment',
    date: '2025-08-15',
    daysUntil: 3,
    course: 'CS3244',
    priority: 'high',
    description: 'Linear regression implementation'
  },
  {
    id: '6',
    title: 'Database Lab Report',
    type: 'assignment',
    date: '2025-08-10',
    daysUntil: -2,
    course: 'CS2102',
    priority: 'high',
    completed: true,
    description: 'SQL query optimization analysis'
  }
];

const getEventTypeIcon = (type: string) => {
  switch (type) {
    case 'assignment': return <FileText className="h-4 w-4" />;
    case 'exam': return <AlertTriangle className="h-4 w-4" />;
    case 'project': return <Users className="h-4 w-4" />;
    case 'quiz': return <Clock className="h-4 w-4" />;
    case 'lecture': return <BookOpen className="h-4 w-4" />;
    default: return <Calendar className="h-4 w-4" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800 border-red-200';
    case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getDaysUntilColor = (daysUntil: number) => {
  if (daysUntil < 0) return 'text-gray-500';
  if (daysUntil <= 3) return 'text-red-600';
  if (daysUntil <= 7) return 'text-orange-600';
  return 'text-gray-600';
};

export default function CourseOverview() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'upcoming' | 'completed'>('upcoming');
  
  const filteredEvents = mockCourseEvents
    .filter(event => {
      if (selectedFilter === 'upcoming') return event.daysUntil >= 0 && !event.completed;
      if (selectedFilter === 'completed') return event.completed;
      return true;
    })
    .sort((a, b) => a.daysUntil - b.daysUntil);

  const upcomingEvents = mockCourseEvents.filter(event => event.daysUntil >= 0 && !event.completed);
  const completedCount = mockCourseEvents.filter(event => event.completed).length;
  const totalEvents = mockCourseEvents.length;
  const completionRate = Math.round((completedCount / totalEvents) * 100);

  return (
    <div className="space-y-6">
      {/* Course Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Upcoming Deadlines</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingEvents.length}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{completionRate}%</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Courses</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <BookOpen className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Events */}
      <Card className="bg-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Course Schedule & Deadlines
              </CardTitle>
              <CardDescription>Important dates and assignments for your modules</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedFilter === 'upcoming' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('upcoming')}
              >
                Upcoming
              </Button>
              <Button
                variant={selectedFilter === 'completed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('completed')}
              >
                Completed
              </Button>
              <Button
                variant={selectedFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('all')}
              >
                All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                  event.completed 
                    ? 'bg-gray-50 border-gray-200' 
                    : event.daysUntil <= 3 
                    ? 'bg-red-50 border-red-200' 
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className={`p-2 rounded-lg ${
                    event.completed ? 'bg-gray-100' : 
                    event.type === 'exam' ? 'bg-red-100' :
                    event.type === 'assignment' ? 'bg-blue-100' :
                    event.type === 'project' ? 'bg-purple-100' :
                    'bg-gray-100'
                  }`}>
                    {event.completed ? (
                      <CheckCircle className="h-4 w-4 text-gray-600" />
                    ) : (
                      <div className={
                        event.type === 'exam' ? 'text-red-600' :
                        event.type === 'assignment' ? 'text-blue-600' :
                        event.type === 'project' ? 'text-purple-600' :
                        'text-gray-600'
                      }>
                        {getEventTypeIcon(event.type)}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-medium ${event.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                        {event.title}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {event.course}
                      </Badge>
                      <Badge className={`text-xs ${getPriorityColor(event.priority)}`}>
                        {event.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{event.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                      {!event.completed && (
                        <span className={`flex items-center gap-1 font-medium ${getDaysUntilColor(event.daysUntil)}`}>
                          <Clock className="h-3 w-3" />
                          {event.daysUntil === 0 ? 'Due today' :
                           event.daysUntil === 1 ? 'Due tomorrow' :
                           event.daysUntil > 0 ? `${event.daysUntil} days left` :
                           `${Math.abs(event.daysUntil)} days overdue`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {!event.completed && event.daysUntil >= 0 && (
                  <Button variant="outline" size="sm">
                    Mark Complete
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}