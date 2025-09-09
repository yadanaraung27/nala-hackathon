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
        name: 'Software Engineering', 
        code: 'CS3203', 
        reason: 'Heavy emphasis on team collaboration and group discussions',
        tips: ['Participate actively in team meetings', 'Leverage peer programming sessions'],
        currentGrade: 'B+',
        confidence: 85
      },
      { 
        name: 'Human Computer Interaction', 
        code: 'CS3240', 
        reason: 'Interactive design processes and user feedback sessions',
        tips: ['Engage with user testing groups', 'Present design concepts regularly'],
        currentGrade: 'A-',
        confidence: 90
      },
      { 
        name: 'Database Systems', 
        code: 'CS2102', 
        reason: 'Collaborative project work and discussion-based learning',
        tips: ['Form study groups for complex queries', 'Explain concepts to teammates'],
        currentGrade: 'B',
        confidence: 78
      }
    ],
    harder: [
      { 
        name: 'Algorithms', 
        code: 'CS3230', 
        reason: 'Requires extensive individual problem-solving practice',
        tips: ['Join algorithm study groups', 'Discuss solutions with peers after practice'],
        currentGrade: 'B-',
        confidence: 65
      },
      { 
        name: 'Independent Research Project', 
        code: 'CS4199', 
        reason: 'Minimal peer interaction and self-directed learning',
        tips: ['Schedule regular advisor meetings', 'Present progress to research groups'],
        currentGrade: 'B',
        confidence: 60
      }
    ]
  },
  'The Architect': {
    easier: [
      { 
        name: 'Database Systems', 
        code: 'CS2102', 
        reason: 'Systematic approach to data modeling and structured analysis',
        tips: ['Create detailed ER diagrams', 'Build comprehensive query documentation'],
        currentGrade: 'A',
        confidence: 92
      },
      { 
        name: 'Algorithm Analysis', 
        code: 'CS3230', 
        reason: 'Deep theoretical understanding and methodical problem solving',
        tips: ['Create algorithm complexity comparison charts', 'Build personal reference materials'],
        currentGrade: 'A-',
        confidence: 88
      },
      { 
        name: 'Computer Security', 
        code: 'CS2107', 
        reason: 'Requires careful analysis of security protocols and systems',
        tips: ['Document security frameworks thoroughly', 'Create threat analysis models'],
        currentGrade: 'B+',
        confidence: 85
      }
    ],
    harder: [
      { 
        name: 'Software Engineering Project', 
        code: 'CS3203', 
        reason: 'Fast-paced group dynamics and unpredictable collaboration',
        tips: ['Prepare detailed project plans in advance', 'Set structured meeting agendas'],
        currentGrade: 'B',
        confidence: 68
      },
      { 
        name: 'Rapid Prototyping Workshop', 
        code: 'CS3216', 
        reason: 'Time-pressured environment with chaotic brainstorming',
        tips: ['Prepare structured templates beforehand', 'Focus on your analytical strengths'],
        currentGrade: 'B-',
        confidence: 62
      }
    ]
  },
  'The Problem Solver': {
    easier: [
      { 
        name: 'Data Structures', 
        code: 'CS2040S', 
        reason: 'Hands-on implementation and practical problem solving',
        tips: ['Code multiple implementations', 'Test with real-world data sets'],
        currentGrade: 'A',
        confidence: 90
      },
      { 
        name: 'Web Development', 
        code: 'CS3216', 
        reason: 'Practical application building with immediate feedback',
        tips: ['Build side projects to reinforce learning', 'Debug and optimize continuously'],
        currentGrade: 'A-',
        confidence: 87
      },
      { 
        name: 'Machine Learning Applications', 
        code: 'CS3244', 
        reason: 'Applied ML with real datasets and measurable outcomes',
        tips: ['Work on Kaggle competitions', 'Implement algorithms from scratch'],
        currentGrade: 'B+',
        confidence: 82
      }
    ],
    harder: [
      { 
        name: 'Theoretical Computer Science', 
        code: 'CS3236', 
        reason: 'Abstract mathematical concepts without clear practical applications',
        tips: ['Find practical examples for abstract concepts', 'Connect theory to coding problems'],
        currentGrade: 'B-',
        confidence: 58
      },
      { 
        name: 'Philosophy of Computing', 
        code: 'CS4268', 
        reason: 'Open-ended discussions without concrete problem-solving',
        tips: ['Frame philosophical questions as problems to solve', 'Seek concrete examples'],
        currentGrade: 'C+',
        confidence: 55
      }
    ]
  },
  'The Adventurer': {
    easier: [
      { 
        name: 'Software Engineering Projects', 
        code: 'CS3203', 
        reason: 'Collaborative team environment with hands-on development',
        tips: ['Lead team brainstorming sessions', 'Organize coding workshops'],
        currentGrade: 'A',
        confidence: 92
      },
      { 
        name: 'Interactive Web Development', 
        code: 'CS3216', 
        reason: 'Creative group projects with interactive elements',
        tips: ['Prototype early and often', 'Get feedback from multiple user groups'],
        currentGrade: 'A-',
        confidence: 89
      },
      { 
        name: 'Game Development Workshop', 
        code: 'CS4350', 
        reason: 'Hands-on creative collaboration with immediate results',
        tips: ['Form diverse teams', 'Participate in game jams and hackathons'],
        currentGrade: 'A-',
        confidence: 86
      }
    ],
    harder: [
      { 
        name: 'Theoretical Mathematics', 
        code: 'MA1521', 
        reason: 'Long passive lectures with dense theoretical content',
        tips: ['Form study groups for practice problems', 'Use visual aids and interactive tools'],
        currentGrade: 'B-',
        confidence: 64
      },
      { 
        name: 'Independent Study', 
        code: 'CS4199', 
        reason: 'Solitary work with extensive reading requirements',
        tips: ['Break readings into interactive sessions', 'Present findings to peer groups'],
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