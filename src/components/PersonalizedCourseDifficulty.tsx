import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { CheckCircle2, AlertCircle, TrendingUp, TrendingDown, BookOpen, Lightbulb, Users, Target } from 'lucide-react';

// Course difficulty mapping based on learning styles
const courseDifficultyMapping = {
  'The Interactor': {
    easier: [
      { 
        name: 'Applied Derivatives', 
        code: 'MH1810-Module4', 
        reason: 'Interactive problem-solving and group discussion of real-world applications',
        tips: ['Participate actively in optimization discussions', 'Leverage group problem-solving sessions'],
        currentGrade: 'B+',
        confidence: 85
      },
      { 
        name: 'Complex Numbers', 
        code: 'MH1810-Module1', 
        reason: 'Visual learning through polar representations and collaborative exploration',
        tips: ['Engage with geometric interpretation groups', 'Present polar form concepts regularly'],
        currentGrade: 'A-',
        confidence: 90
      }
    ],
    harder: [
      { 
        name: 'Integration Techniques', 
        code: 'MH1810-Module7', 
        reason: 'Requires extensive individual practice with various methods',
        tips: ['Join integration study groups', 'Discuss solution strategies with peers after practice'],
        currentGrade: 'B-',
        confidence: 65
      },
      { 
        name: 'Limits and Continuity', 
        code: 'MH1810-Module3', 
        reason: 'Abstract concepts requiring individual reflection and practice',
        tips: ['Schedule regular tutorial sessions', 'Present limit concepts to study groups'],
        currentGrade: 'B',
        confidence: 70
      }
    ]
  },
  'The Architect': {
    easier: [
      { 
        name: 'Vector and Matrix Operations', 
        code: 'MH1810-Module2', 
        reason: 'Systematic approach to linear algebra and structured calculations',
        tips: ['Create detailed operation reference sheets', 'Build comprehensive formula documentation'],
        currentGrade: 'A',
        confidence: 92
      },
      { 
        name: 'Limits and Continuity', 
        code: 'MH1810-Module3', 
        reason: 'Deep theoretical understanding and methodical limit evaluation',
        tips: ['Create limit technique comparison charts', 'Build personal theorem reference materials'],
        currentGrade: 'A-',
        confidence: 88
      },
      { 
        name: 'Integration Theory', 
        code: 'MH1810-Module6', 
        reason: 'Requires careful analysis of integration principles and systematic approach',
        tips: ['Document integration rules thoroughly', 'Create method selection flowcharts'],
        currentGrade: 'B+',
        confidence: 85
      }
    ],
    harder: [
      { 
        name: 'Applied Optimization', 
        code: 'MH1810-Module5', 
        reason: 'Fast-paced problem solving with unpredictable real-world applications',
        tips: ['Prepare detailed solution templates in advance', 'Set structured problem-solving frameworks'],
        currentGrade: 'B',
        confidence: 68
      },
      { 
        name: 'Complex Number Applications', 
        code: 'MH1810-Module1', 
        reason: 'Time-pressured geometric interpretations and visual problem solving',
        tips: ['Prepare structured visualization tools beforehand', 'Focus on your analytical calculation strengths'],
        currentGrade: 'B-',
        confidence: 62
      }
    ]
  },
  'The Problem Solver': {
    easier: [
      { 
        name: 'Applied Derivatives', 
        code: 'MH1810-Module5', 
        reason: 'Hands-on optimization problems and practical calculus applications',
        tips: ['Solve multiple real-world optimization problems', 'Test with various constraint scenarios'],
        currentGrade: 'A',
        confidence: 90
      },
      { 
        name: 'Integration Applications', 
        code: 'MH1810-Module8', 
        reason: 'Practical area and volume calculations with immediate visual feedback',
        tips: ['Build visual models to reinforce learning', 'Solve and verify solutions continuously'],
        currentGrade: 'A-',
        confidence: 87
      },
      { 
        name: 'Complex Number Problems', 
        code: 'MH1810-Module1', 
        reason: 'Applied complex analysis with measurable computational outcomes',
        tips: ['Work on engineering applications', 'Implement polar conversions from scratch'],
        currentGrade: 'B+',
        confidence: 82
      }
    ],
    harder: [
      { 
        name: 'Theoretical Limits', 
        code: 'MH1810-Module3', 
        reason: 'Abstract mathematical concepts without clear practical applications',
        tips: ['Find practical examples for limit concepts', 'Connect theory to real-world problems'],
        currentGrade: 'B-',
        confidence: 58
      },
      { 
        name: 'Pure Mathematical Proofs', 
        code: 'MH1810-Theory', 
        reason: 'Open-ended proof discussions without concrete computational solving',
        tips: ['Frame proof questions as problems to solve', 'Seek computational examples'],
        currentGrade: 'C+',
        confidence: 55
      }
    ]
  },
  'The Adventurer': {
    easier: [
      { 
        name: 'Mathematical Modeling Projects', 
        code: 'MH1810-Applied', 
        reason: 'Collaborative team environment with hands-on calculus applications',
        tips: ['Lead modeling brainstorming sessions', 'Organize problem-solving workshops'],
        currentGrade: 'A',
        confidence: 92
      },
      { 
        name: 'Interactive Calculus Visualization', 
        code: 'MH1810-Module5', 
        reason: 'Creative problem solving with interactive graphical elements',
        tips: ['Create visual prototypes early and often', 'Get feedback from multiple study groups'],
        currentGrade: 'A-',
        confidence: 89
      },
      { 
        name: 'Integration Applications Workshop', 
        code: 'MH1810-Module8', 
        reason: 'Hands-on creative collaboration with immediate computational results',
        tips: ['Form diverse problem-solving teams', 'Participate in math competitions and challenges'],
        currentGrade: 'A-',
        confidence: 86
      }
    ],
    harder: [
      { 
        name: 'Theoretical Calculus Proofs', 
        code: 'MH1810-Theory', 
        reason: 'Long passive lectures with dense theoretical limit content',
        tips: ['Form study groups for proof practice', 'Use visual aids and interactive graphing tools'],
        currentGrade: 'B-',
        confidence: 64
      },
      { 
        name: 'Independent Integration Study', 
        code: 'MH1810-Module7', 
        reason: 'Solitary work with extensive formula memorization requirements',
        tips: ['Break formula practice into interactive sessions', 'Present techniques to peer groups'],
        currentGrade: 'B',
        confidence: 67
      }
    ]
  }
};

interface PersonalizedCourseDifficultyProps {
  learningStyle: string;
}

export default function PersonalizedCourseDifficulty({ learningStyle }: PersonalizedCourseDifficultyProps) {
  const [selectedView, setSelectedView] = useState<'overview' | 'easier' | 'harder'>('overview');
  
  const courseData = courseDifficultyMapping[learningStyle as keyof typeof courseDifficultyMapping];
  
  if (!courseData) return null;

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 65) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'bg-green-100 text-green-800';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-800';
    return 'bg-orange-100 text-orange-800';
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700">Easier Courses</p>
                <p className="text-2xl font-bold text-green-900">{courseData.easier.length}</p>
                <p className="text-xs text-green-600">Based on your learning style</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-700">Challenging Courses</p>
                <p className="text-2xl font-bold text-orange-900">{courseData.harder.length}</p>
                <p className="text-xs text-orange-600">Need extra support</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingDown className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700">Avg Confidence</p>
                <p className="text-2xl font-bold text-blue-900">
                  {Math.round([...courseData.easier, ...courseData.harder].reduce((sum, course) => sum + course.confidence, 0) / (courseData.easier.length + courseData.harder.length))}%
                </p>
                <p className="text-xs text-blue-600">Across all courses</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Difficulty Analysis */}
      <Card className="bg-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Personalized Course Difficulty
              </CardTitle>
              <CardDescription>
                Course difficulty tailored to your learning style: <strong>{learningStyle}</strong>
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={selectedView} onValueChange={(value: any) => setSelectedView(value)} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="easier" className="text-green-700">Easier for You</TabsTrigger>
              <TabsTrigger value="harder" className="text-orange-700">More Challenging</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Easier Courses */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <h3 className="font-medium text-green-900">Your Strengths</h3>
                    <Badge className="bg-green-100 text-green-800">{courseData.easier.length} courses</Badge>
                  </div>
                  <div className="space-y-3">
                    {courseData.easier.slice(0, 3).map((course, index) => (
                      <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{course.code}</Badge>
                            <Badge className={getGradeColor(course.currentGrade)}>{course.currentGrade}</Badge>
                          </div>
                          <span className={`text-sm font-medium ${getConfidenceColor(course.confidence)}`}>
                            {course.confidence}% confident
                          </span>
                        </div>
                        <h4 className="font-medium text-gray-900 text-sm mb-1">{course.name}</h4>
                        <p className="text-xs text-gray-600">{course.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Harder Courses */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    <h3 className="font-medium text-orange-900">Areas for Growth</h3>
                    <Badge className="bg-orange-100 text-orange-800">{courseData.harder.length} courses</Badge>
                  </div>
                  <div className="space-y-3">
                    {courseData.harder.slice(0, 3).map((course, index) => (
                      <div key={index} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{course.code}</Badge>
                            <Badge className={getGradeColor(course.currentGrade)}>{course.currentGrade}</Badge>
                          </div>
                          <span className={`text-sm font-medium ${getConfidenceColor(course.confidence)}`}>
                            {course.confidence}% confident
                          </span>
                        </div>
                        <h4 className="font-medium text-gray-900 text-sm mb-1">{course.name}</h4>
                        <p className="text-xs text-gray-600">{course.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="easier" className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-green-900 mb-1">Why These Courses Work Well for You</h4>
                      <p className="text-sm text-green-700">
                        As {learningStyle}, these courses align with your preferred learning approach and natural strengths.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {courseData.easier.map((course, index) => (
                    <Card key={index} className="border-green-200">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div>
                                <h4 className="font-medium text-gray-900">{course.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">{course.code}</Badge>
                                  <Badge className={getGradeColor(course.currentGrade)}>{course.currentGrade}</Badge>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1">
                                <span className={`text-sm font-medium ${getConfidenceColor(course.confidence)}`}>
                                  {course.confidence}%
                                </span>
                              </div>
                              <Progress value={course.confidence} className="w-24 h-2 mt-1" />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                              <strong>Why it works:</strong> {course.reason}
                            </p>
                            <div>
                              <h5 className="text-sm font-medium text-gray-900 mb-1">Personalized Tips:</h5>
                              <ul className="space-y-1">
                                {course.tips.map((tip, tipIndex) => (
                                  <li key={tipIndex} className="text-sm text-gray-600 flex items-start gap-2">
                                    <span className="text-green-500 mt-1">•</span>
                                    <span>{tip}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="harder" className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-orange-900 mb-1">Courses That Need Extra Attention</h4>
                      <p className="text-sm text-orange-700">
                        These courses may not align perfectly with your learning style, but with the right strategies, you can excel!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {courseData.harder.map((course, index) => (
                    <Card key={index} className="border-orange-200">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div>
                                <h4 className="font-medium text-gray-900">{course.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">{course.code}</Badge>
                                  <Badge className={getGradeColor(course.currentGrade)}>{course.currentGrade}</Badge>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1">
                                <span className={`text-sm font-medium ${getConfidenceColor(course.confidence)}`}>
                                  {course.confidence}%
                                </span>
                              </div>
                              <Progress value={course.confidence} className="w-24 h-2 mt-1" />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                              <strong>Challenge:</strong> {course.reason}
                            </p>
                            <div>
                              <h5 className="text-sm font-medium text-gray-900 mb-1 flex items-center gap-1">
                                <Lightbulb className="h-4 w-4 text-orange-600" />
                                Strategies to Succeed:
                              </h5>
                              <ul className="space-y-1">
                                {course.tips.map((tip, tipIndex) => (
                                  <li key={tipIndex} className="text-sm text-gray-600 flex items-start gap-2">
                                    <span className="text-orange-500 mt-1">•</span>
                                    <span>{tip}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
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