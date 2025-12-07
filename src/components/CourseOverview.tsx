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
    title: 'Online Assignment 3',
    type: 'assignment',
    date: '2025-10-13',
    daysUntil: 12,
    course: 'MH1810',
    priority: 'medium',
    description: 'Derivatives and applications problems'
  },
  {
    id: '2',
    title: 'Midterm Exam',
    type: 'exam',
    date: '2025-10-11',
    daysUntil: 10,
    course: 'MH1810',
    priority: 'high',
    description: 'Complex numbers, vectors, matrices, limits, derivatives - 15% weightage'
  },
  {
    id: '3',
    title: 'Take-home Test',
    type: 'assignment',
    date: '2025-11-11',
    daysUntil: 41,
    course: 'MH1810',
    priority: 'high',
    description: 'Differentiation and Integration - Submit by 11th Nov - 9% weightage'
  },
  {
    id: '4',
    title: 'Final Exam',
    type: 'exam',
    date: '2025-11-24',
    daysUntil: 54,
    course: 'MH1810',
    priority: 'high',
    description: 'Comprehensive exam 9am-11am - 60% weightage'
  },
  {
    id: '5',
    title: 'Online Assignment 2',
    type: 'assignment',
    date: '2025-09-29',
    daysUntil: -2,
    course: 'MH1810',
    priority: 'medium',
    completed: true,
    description: 'Limits and continuity problems'
  },
  {
    id: '6',
    title: 'Online Assignment 1',
    type: 'assignment',
    date: '2025-09-15',
    daysUntil: -16,
    course: 'MH1810',
    priority: 'medium',
    completed: true,
    description: 'Complex numbers and vector problems'
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
  const [completedEvents, setCompletedEvents] = useState<Set<string>>(new Set());
  
  const handleMarkComplete = (eventId: string) => {
    setCompletedEvents(prev => new Set([...prev, eventId]));
  };

  const handleToggleComplete = (eventId: string) => {
    setCompletedEvents(prev => {
      const newSet = new Set([...prev]);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  const isEventCompleted = (event: CourseEvent) => {
    return event.completed || completedEvents.has(event.id);
  };

  const filteredEvents = mockCourseEvents
    .filter(event => {
      const completed = isEventCompleted(event);
      if (selectedFilter === 'upcoming') return event.daysUntil >= 0 && !completed;
      if (selectedFilter === 'completed') return completed;
      return true;
    })
    .sort((a, b) => a.daysUntil - b.daysUntil);

  const upcomingEvents = mockCourseEvents.filter(event => event.daysUntil >= 0 && !event.completed);
  const completedCount = mockCourseEvents.filter(event => event.completed).length;
  const totalEvents = mockCourseEvents.length;
  const completionRate = Math.round((completedCount / totalEvents) * 100);

  return (
    <div className="space-y-6">


      {/* Course Events */}
      <Card className="bg-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Course Schedule
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
                  isEventCompleted(event) 
                    ? 'bg-gray-50 border-gray-200' 
                    : event.daysUntil <= 3 
                    ? 'bg-red-50 border-red-200' 
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className={`p-2 rounded-lg ${
                    isEventCompleted(event) ? 'bg-gray-100' : 
                    event.type === 'exam' ? 'bg-red-100' :
                    event.type === 'assignment' ? 'bg-blue-100' :
                    event.type === 'project' ? 'bg-purple-100' :
                    'bg-gray-100'
                  }`}>
                    {isEventCompleted(event) ? (
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
                      <h3 className={`font-medium ${isEventCompleted(event) ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                        {event.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{event.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                      {!isEventCompleted(event) && (
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

                {!isEventCompleted(event) && event.daysUntil >= 0 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleMarkComplete(event.id)}
                  >
                    Mark Complete
                  </Button>
                )}
                {isEventCompleted(event) && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="flex items-center gap-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                    onClick={() => handleToggleComplete(event.id)}
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Completed</span>
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