import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Calendar, Clock, BookOpen, Target, CheckCircle2, AlertCircle, ChevronDown, ChevronRight, Video, FileText, Users, Play } from 'lucide-react';

interface CoursesPageProps {
  onNavigateToChatbot?: () => void;
}

// Calculate days until deadline from date string (DD/MM/YYYY format)
const calculateDaysUntil = (dateString: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset to start of day
  
  // Parse DD/MM/YYYY format
  const [day, month, year] = dateString.split('/').map(Number);
  const deadline = new Date(year, month - 1, day); // month is 0-indexed in JavaScript
  deadline.setHours(0, 0, 0, 0); // Reset to start of day
  
  const timeDiff = deadline.getTime() - today.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  
  return daysDiff;
};

// Determine assessment status based on due date
const getAssessmentStatus = (dateString: string): 'completed' | 'upcoming' => {
  return calculateDaysUntil(dateString) <= 0 ? 'completed' : 'upcoming';
};

export default function CoursesPage({ onNavigateToChatbot }: CoursesPageProps = {}) {
  const [expandedTopics, setExpandedTopics] = useState<Set<number>>(new Set([3])); // Current topic expanded by default
  const [assessmentFilter, setAssessmentFilter] = useState<'upcoming' | 'completed' | 'all'>('upcoming');
  const [completedAssessments, setCompletedAssessments] = useState<Set<number>>(new Set()); // Track completed assessments

  // MH1810 Assessment data provided by Faculty Staff
  const courseworkAssessments = [
    {
      id: 1,
      type: 'assignment',
      title: 'Online Assignment 1',
      description: 'Complex numbers and vector problems',
      dueDate: '08/02/2026', // Sunday of Week 4
      weightage: 'Part of 16%'
    },
    {
      id: 2,
      type: 'assignment',
      title: 'Online Assignment 2',
      description: 'Matrices and limits problems',
      dueDate: '22/02/2026', // Sunday of Week 6
      weightage: 'Part of 16%'
    },
    {
      id: 3,
      type: 'assignment',
      title: 'Online Assignment 3',
      description: 'Derivatives and applications problems',
      dueDate: '15/03/2026', // Sunday of Week 8
      weightage: 'Part of 16%'
    },
    {
      id: 4,
      type: 'exam',
      title: 'Midterm Exam',
      description: 'Complex numbers, vectors, matrices, limits, derivatives',
      dueDate: '14/03/2026', // Saturday of Week 8
      weightage: '15% weightage'
    },
    {
      id: 5,
      type: 'assignment',
      title: 'Take-home Test',
      description: 'Differentiation and Integration',
      dueDate: '14/04/2026', // Tuesday of Week 13
      weightage: '9% weightage'
    },
    {
      id: 6,
      type: 'exam',
      title: 'Final Exam',
      description: 'Comprehensive exam',
      dueDate: '27/04/2026', // Monday of Exam Week 1
      weightage: '60% weightage'
    }
  ];

  // Load completed assessments from localStorage on component mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('completedAssessments');
      if (saved) {
        const parsedCompleted = JSON.parse(saved);
        setCompletedAssessments(new Set(parsedCompleted));
      }
    } catch (error) {
      console.error('Error loading completed assessments:', error);
    }
  }, []);

  // Auto-complete overdue assessments
  useEffect(() => {
    const overdueAssessments = courseworkAssessments.filter(assessment => calculateDaysUntil(assessment.dueDate) <= 0);
    const newCompleted = new Set(completedAssessments);
    let hasChanges = false;
    
    overdueAssessments.forEach(assessment => {
      if (!newCompleted.has(assessment.id)) {
        newCompleted.add(assessment.id);
        hasChanges = true;
      }
    });
    
    if (hasChanges) {
      setCompletedAssessments(newCompleted);
      try {
        localStorage.setItem('completedAssessments', JSON.stringify(Array.from(newCompleted)));
      } catch (error) {
        console.error('Error saving auto-completed assessments:', error);
      }
    }
  }, []); // Only run once on mount

  const toggleTopic = (index: number) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedTopics(newExpanded);
  };

  const toggleAssessmentComplete = (assessmentId: number) => {
    const newCompleted = new Set(completedAssessments);
    if (newCompleted.has(assessmentId)) {
      newCompleted.delete(assessmentId);
    } else {
      newCompleted.add(assessmentId);
    }
    setCompletedAssessments(newCompleted);
    
    // Save to localStorage
    try {
      localStorage.setItem('completedAssessments', JSON.stringify(Array.from(newCompleted)));
    } catch (error) {
      console.error('Error saving completed assessments:', error);
    }
  };

  // MH1810 Course Topic data provided by Faculty Staff
  const courseTopics = [
    {
      topic: 'Topic 1',
      title: 'Complex Numbers',
      subtopics: ['Complex Plane', 'Polar Coordinates', 'Powers & Roots', 'Fundamental Theorem'],
      progress: 100,
      status: 'completed',
      deadline: 'Completed Jan 16',
      resources: { videos: 4, tutorials: 3, exercises: 12 }
    },
    {
      topic: 'Topic 2', 
      title: 'Vectors and Matrices',
      subtopics: ['Vector Algebra', 'Dot & Cross Product', 'Lines & Planes', 'Matrix Operations'],
      progress: 100,
      status: 'completed',
      deadline: 'Completed Jan 23',
      resources: { videos: 5, tutorials: 4, exercises: 15 }
    },
    {
      topic: 'Topic 3',
      title: 'Limits and Continuity',
      subtopics: ['Types of Limits', 'Sandwich Theorem', 'Evaluation of Limits', 'Continuity Properties'],
      progress: 100,
      status: 'completed',
      deadline: 'Completed Jan 30',
      resources: { videos: 6, tutorials: 3, exercises: 18 }
    },
    {
      topic: 'Topic 4',
      title: 'Derivatives',
      subtopics: ['Differentiability', 'Rules & Properties', 'Transcendental Functions', 'Implicit Differentiation'],
      progress: 10,
      status: 'in-progress',
      deadline: 'Started Feb 2',
      resources: { videos: 7, tutorials: 5, exercises: 20 }
    },
    {
      topic: 'Topic 5',
      title: 'Applications of Derivatives',
      subtopics: ['Extreme Values', 'Curve Sketching', 'Optimization', 'L\'Hopital\'s Rule'],
      progress: 0,
      status: 'upcoming',
      deadline: 'Starts Feb 9',
      resources: { videos: 6, tutorials: 4, exercises: 16 }
    },
    {
      topic: 'Topic 6',
      title: 'Integration',
      subtopics: ['Anti-derivatives', 'Riemann Sum', 'Definite Integration', 'Fundamental Theorem'],
      progress: 0,
      status: 'upcoming',
      deadline: 'Starts Feb 16',
      resources: { videos: 8, tutorials: 6, exercises: 22 }
    },
    {
      topic: 'Topic 7',
      title: 'Integration Methods',
      subtopics: ['Integration by Parts', 'Trigonometric Substitution', 'Partial Fractions', 'Improper Integrals'],
      progress: 0,
      status: 'upcoming',
      deadline: 'Starts Feb 23',
      resources: { videos: 9, tutorials: 7, exercises: 25 }
    },
    {
      topic: 'Topic 8',
      title: 'Applications of Integration',
      subtopics: ['Area Between Curves', 'Volume of Solids', 'Length of Curves', 'Surface Area'],
      progress: 0,
      status: 'upcoming',
      deadline: 'Starts Mar 9',
      resources: { videos: 7, tutorials: 5, exercises: 19 }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">Course Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Mathematics I • AY 2024/25 Semester 1</p>
      </div>

      {/* Consolidated Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Overall Progress */}
        <Card className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <BookOpen className="h-6 w-6" />
                <span className="font-semibold">This Week's Content</span>
              </div>
            </div>
            <div className="space-y-4">
              {/* Lectures Section */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Video className="h-4 w-4 text-blue-100" />
                  <span className="text-sm font-medium text-blue-100">Lectures</span>
                </div>
                <div className="space-y-2 ml-6">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-2 border-white/40 bg-transparent checked:bg-white checked:border-white focus:ring-2 focus:ring-white/30"
                      onChange={(e) => {
                        // This will be replaced with proper state management
                        const span = e.target.nextElementSibling;
                        if (span) {
                          span.style.textDecoration = e.target.checked ? 'line-through' : 'none';
                          span.style.opacity = e.target.checked ? '0.6' : '1';
                        }
                      }}
                    />
                    <span className="text-sm text-white transition-all duration-200">Lecture 4: Derivatives</span>
                  </div>
                </div>
              </div>
              
              {/* Tutorials Section */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-blue-100" />
                  <span className="text-sm font-medium text-blue-100">Tutorials</span>
                </div>
                <div className="space-y-2 ml-6">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-2 border-white/40 bg-transparent checked:bg-white checked:border-white focus:ring-2 focus:ring-white/30"
                      onChange={(e) => {
                        // This will be replaced with proper state management
                        const span = e.target.nextElementSibling;
                        if (span) {
                          span.style.textDecoration = e.target.checked ? 'line-through' : 'none';
                          span.style.opacity = e.target.checked ? '0.6' : '1';
                        }
                      }}
                    />
                    <span className="text-sm text-white transition-all duration-200">Tutorial 3: Limits and Continuity</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Focus */}
        <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <BookOpen className="h-6 w-6" />
                <span className="font-semibold">Current Focus</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-xl font-bold">Derivatives</div>
              <div className="text-green-100 text-sm">Topic 4 • 10% complete</div>
              <div className="flex items-center gap-2 mt-3">
                <div className="w-full bg-white/20 rounded-full h-1.5">
                  <div className="bg-white h-1.5 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="mt-4 w-full bg-white text-green-600 border-white hover:bg-green-50"
              onClick={() => onNavigateToChatbot?.()}
            >
              Continue Learning
            </Button>
          </CardContent>
        </Card>

        {/* Key Deadlines - Single unified view */}
        <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6" />
                <span className="font-semibold">Key Deadlines</span>
              </div>
            </div>
            <div className="space-y-3">
              {courseworkAssessments
                .filter(assessment => !completedAssessments.has(assessment.id) && calculateDaysUntil(assessment.dueDate) > 0)
                .sort((a, b) => calculateDaysUntil(a.dueDate) - calculateDaysUntil(b.dueDate))
                .slice(0, 2)
                .map((assessment, index) => (
                  <div key={assessment.id}>
                    {index > 0 && <hr className="border-white/20" />}
                    <div>
                      <div className="text-lg font-bold">{assessment.title}</div>
                      <div className="text-orange-100 text-sm">{assessment.dueDate} • {assessment.weightage}</div>
                      <div className="text-orange-200 text-xs">{calculateDaysUntil(assessment.dueDate)} days remaining</div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Topics & Coursework - Tabbed Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Course Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="topics" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="topics">Topics</TabsTrigger>
              <TabsTrigger value="coursework">Coursework & Assessments</TabsTrigger>
            </TabsList>
            
            <TabsContent value="topics" className="mt-6">
              {/* Topics Content */}
              <div className="space-y-4">
                <p className="text-sm text-gray-500">Click on any topic to view detailed resources and progress</p>
                <div className="space-y-3">
                  {courseTopics.map((course, index) => (
                    <Card key={index} className={`transition-all duration-200 ${
                      course.status === 'in-progress' ? 'border-blue-300 bg-blue-50' : 
                      course.status === 'completed' ? 'border-green-300 bg-green-50' : 
                      'border-gray-200'
                    }`}>
                      <Collapsible>
                        <CollapsibleTrigger 
                          className="w-full"
                          onClick={() => toggleTopic(index)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 flex-1">
                                {/* Status Indicator */}
                                <div className="flex items-center gap-2">
                                  {course.status === 'completed' && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                                  {course.status === 'in-progress' && <Clock className="h-5 w-5 text-blue-600" />}
                                  {course.status === 'upcoming' && <Calendar className="h-5 w-5 text-gray-400" />}
                                </div>

                                {/* Topic Info */}
                                <div className="flex-1 text-left">
                                  <div className="flex items-center gap-3 mb-1">
                                    <Badge 
                                      variant={course.status === 'completed' ? 'default' : course.status === 'in-progress' ? 'secondary' : 'outline'}
                                      className={
                                        course.status === 'completed' ? 'bg-green-100 text-green-800' :
                                        course.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                        'bg-gray-100 text-gray-600'
                                      }
                                    >
                                      {course.topic}
                                    </Badge>

                                  </div>
                                  <h3 className="font-semibold text-lg text-gray-900">{course.title}</h3>
                                  <p className="text-sm text-gray-600">{course.deadline}</p>
                                </div>

                                {/* Progress */}
                                <div className="text-right min-w-[120px]">
                                  <div className="text-sm font-medium text-gray-900 mb-1">{course.progress}%</div>
                                  <div className="w-24 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className={`h-2 rounded-full ${
                                        course.status === 'completed' ? 'bg-green-500' : 
                                        course.status === 'in-progress' ? 'bg-blue-500' : 
                                        'bg-gray-300'
                                      }`}
                                      style={{ width: `${course.progress}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>

                              {/* Expand Icon */}
                              <div className="ml-4">
                                {expandedTopics.has(index) ? 
                                  <ChevronDown className="h-5 w-5 text-gray-400" /> : 
                                  <ChevronRight className="h-5 w-5 text-gray-400" />
                                }
                              </div>
                            </div>
                          </CardContent>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          <CardContent className="pt-0 pb-4 px-4">
                            <div className="border-t pt-4 space-y-4">
                              {/* Subtopics */}
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">Subtopics</h4>
                                <div className="flex flex-wrap gap-2">
                                  {course.subtopics.map((subtopic, subtopicIndex) => (
                                    <Badge key={subtopicIndex} variant="outline" className="text-xs bg-gray-50">
                                      {subtopic}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              {/* Resources */}
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">Available Resources</h4>
                                <div className="flex items-center gap-6 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Video className="h-4 w-4" />
                                    <span>{course.resources.videos} Videos</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    <span>{course.resources.tutorials} Tutorials</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <FileText className="h-4 w-4" />
                                    <span>{course.resources.exercises} Exercises</span>
                                  </div>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-2 pt-2">
                                {course.status === 'in-progress' && (
                                  <Button size="sm" className="flex items-center gap-2">
                                    <Play className="h-4 w-4" />
                                    Continue Learning
                                  </Button>
                                )}
                                {course.status === 'upcoming' && (
                                  <Button size="sm" variant="outline">
                                    Preview Content
                                  </Button>
                                )}
                                {course.status === 'completed' && (
                                  <Button size="sm" variant="outline">
                                    Review Material
                                  </Button>
                                )}
                                <Button size="sm" variant="outline">
                                  <FileText className="h-3 w-3 mr-1" />
                                  Syllabus
                                </Button>
                                {course.status === 'in-progress' && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => onNavigateToChatbot?.()}
                                  >
                                    Ask Questions
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </CollapsibleContent>
                      </Collapsible>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="coursework" className="mt-6">
              {/* Coursework & Assessments Content */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Course Schedule
                    </h3>
                    <p className="text-sm text-gray-500">Important dates and assignments for your modules</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={assessmentFilter === 'upcoming' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setAssessmentFilter('upcoming')}
                      className={assessmentFilter === 'upcoming' ? 'bg-black text-white' : ''}
                    >
                      Upcoming
                    </Button>
                    <Button
                      variant={assessmentFilter === 'completed' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setAssessmentFilter('completed')}
                      className={assessmentFilter === 'completed' ? 'bg-black text-white' : ''}
                    >
                      Completed
                    </Button>
                    <Button
                      variant={assessmentFilter === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setAssessmentFilter('all')}
                      className={assessmentFilter === 'all' ? 'bg-black text-white' : ''}
                    >
                      All
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {courseworkAssessments
                    .filter(item => {
                      const isMarkedCompleted = completedAssessments.has(item.id);
                      
                      if (assessmentFilter === 'all') return true;
                      if (assessmentFilter === 'upcoming') return !isMarkedCompleted;
                      if (assessmentFilter === 'completed') return isMarkedCompleted;
                      
                      return true;
                    })
                    .sort((a, b) => {
                      // Sort by daysLeft (ascending) - closest deadlines first
                      // For completed items or when viewing all, maintain original order by using id as secondary sort
                      const aDaysLeft = calculateDaysUntil(a.dueDate);
                      const bDaysLeft = calculateDaysUntil(b.dueDate);
                      
                      if (assessmentFilter === 'upcoming') {
                        return aDaysLeft - bDaysLeft;
                      }
                      // For 'all' and 'completed' views, sort by daysLeft but keep negative values at the end
                      if (aDaysLeft <= 0 && bDaysLeft <= 0) {
                        return a.id - b.id; // Original order for completed/overdue items
                      }
                      if (aDaysLeft <= 0) return 1; // Move completed to end
                      if (bDaysLeft <= 0) return -1; // Move completed to end
                      return aDaysLeft - bDaysLeft; // Sort upcoming by days left
                    })
                    .map((assessment) => (
                    <Card 
                      key={assessment.id} 
                      className={`border transition-all duration-200 ${
                        completedAssessments.has(assessment.id) 
                          ? 'border-green-200 bg-green-50/50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className={`flex items-center gap-4 flex-1 transition-opacity duration-200 ${
                            completedAssessments.has(assessment.id) ? 'opacity-75' : 'opacity-100'
                          }`}>
                            {/* Icon */}
                            <div className="flex-shrink-0">
                              {assessment.type === 'assignment' ? (
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <FileText className="h-5 w-5 text-blue-600" />
                                </div>
                              ) : (
                                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                  <AlertCircle className="h-5 w-5 text-red-600" />
                                </div>
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                              <h4 className={`font-semibold mb-1 transition-all duration-200 ${
                                completedAssessments.has(assessment.id) 
                                  ? 'text-gray-500 line-through' 
                                  : 'text-gray-900'
                              }`}>
                                {assessment.title}
                              </h4>
                              <p className={`text-sm mb-2 transition-all duration-200 ${
                                completedAssessments.has(assessment.id) 
                                  ? 'text-gray-400' 
                                  : 'text-gray-600'
                              }`}>
                                {assessment.description}
                              </p>
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1 text-gray-500">
                                  <Calendar className="h-4 w-4" />
                                  <span>{assessment.dueDate}</span>
                                </div>
                                {calculateDaysUntil(assessment.dueDate) > 0 && (
                                  <div className="flex items-center gap-1 text-gray-500">
                                    <Clock className="h-4 w-4" />
                                    <span>{calculateDaysUntil(assessment.dueDate)} days left</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Mark Complete Button */}
                            <Button 
                              variant={completedAssessments.has(assessment.id) ? "default" : "outline"} 
                              size="sm"
                              onClick={() => toggleAssessmentComplete(assessment.id)}
                              className={completedAssessments.has(assessment.id) ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
                            >
                              {completedAssessments.has(assessment.id) ? (
                                <div className="flex items-center gap-1">
                                  <CheckCircle2 className="h-4 w-4" />
                                  Mark Completed
                                </div>
                              ) : (
                                'Mark Complete'
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}