import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from 'recharts';
import { TrendingUp, Eye, Info, BarChart3 } from 'lucide-react';

interface CourseData {
  name: string;
  code: string;
  color: string;
  data: {
    tier: string;
    mastery: number;
    fullMark: 100;
  }[];
}

const masteryData: CourseData[] = [
  {
    name: 'Mathematics I',
    code: 'MH1810',
    color: '#8884d8',
    data: [
      { tier: 'Tier 1', mastery: 85, fullMark: 100 },
      { tier: 'Tier 2', mastery: 78, fullMark: 100 },
      { tier: 'Tier 3', mastery: 72, fullMark: 100 },
      { tier: 'Tier 4', mastery: 65, fullMark: 100 },
      { tier: 'Tier 5', mastery: 58, fullMark: 100 },
      { tier: 'Tier 6', mastery: 45, fullMark: 100 },
      { tier: 'Tier 7', mastery: 35, fullMark: 100 }
    ]
  }
];

const mathTopicsData: CourseData[] = [
  {
    name: 'Mathematics I Topics',
    code: 'MH1810-Topics',
    color: '#8884d8',
    data: [
      { tier: 'Complex Numbers', mastery: 78, fullMark: 100 },
      { tier: 'Vectors & Matrices', mastery: 85, fullMark: 100 },
      { tier: 'Limits & Continuity', mastery: 72, fullMark: 100 },
      { tier: 'Derivatives', mastery: 65, fullMark: 100 },
      { tier: 'Applications of Derivatives', mastery: 45, fullMark: 100 },
      { tier: 'Integration', mastery: 35, fullMark: 100 },
      { tier: 'Integration Methods', mastery: 28, fullMark: 100 },
      { tier: 'Applications of Integration', mastery: 15, fullMark: 100 }
    ]
  }
];

const tierDescriptions = {
  'Tier 1': 'Basic Understanding - Fundamental concepts and terminology',
  'Tier 2': 'Comprehension - Able to explain concepts in own words',
  'Tier 3': 'Application - Can apply concepts to simple problems',
  'Tier 4': 'Analysis - Can break down complex problems',
  'Tier 5': 'Synthesis - Can combine concepts creatively',
  'Tier 6': 'Evaluation - Can assess and critique solutions',
  'Tier 7': 'Innovation - Can create novel solutions and approaches'
};

// Combine all data for the radar chart
const combinedData = masteryData[0].data.map((_, index) => {
  const tierData: any = { tier: masteryData[0].data[index].tier };
  masteryData.forEach(course => {
    tierData[course.code] = course.data[index].mastery;
  });
  return tierData;
});

// Combine math topics data for the second radar chart
const mathTopicsCombinedData = mathTopicsData[0].data.map((_, index) => {
  const tierData: any = { tier: mathTopicsData[0].data[index].tier };
  mathTopicsData.forEach(course => {
    tierData[course.code] = course.data[index].mastery;
  });
  return tierData;
});

export default function MasteryLevel() {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const getAverageMastery = (course: CourseData) => {
    const total = course.data.reduce((sum, tier) => sum + tier.mastery, 0);
    return Math.round(total / course.data.length);
  };

  const getMasteryLevel = (average: number) => {
    if (average >= 80) return { level: 'Advanced', color: 'bg-green-100 text-green-800' };
    if (average >= 60) return { level: 'Intermediate', color: 'bg-yellow-100 text-yellow-800' };
    if (average >= 40) return { level: 'Beginner', color: 'bg-blue-100 text-blue-800' };
    return { level: 'Foundation', color: 'bg-gray-100 text-gray-800' };
  };

  // Calculate average mastery for display
  const mathTopicsAverageMastery = Math.round(mathTopicsData[0].data.reduce((sum, tier) => sum + tier.mastery, 0) / mathTopicsData[0].data.length);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          <p className="text-xs text-gray-600 mb-2">{tierDescriptions[label as keyof typeof tierDescriptions]}</p>
          {payload.map((entry: any, index: number) => {
            const course = masteryData.find(c => c.code === entry.dataKey);
            return (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="font-medium">{course?.name}:</span>
                <span>{entry.value}%</span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Learning Competency Tiers */}
        <Card className="bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Learning Competency Tiers
                </CardTitle>
                <CardDescription className="mt-2">
                  Progress across competency levels
                </CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
              >
                <Info className="h-4 w-4 mr-2" />
                {showDetails ? 'Hide' : 'Show'} Details
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="space-y-4">
              {/* Competency Tiers Radar Chart */}
              <div className="h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={combinedData} margin={{ top: 60, right: 60, bottom: 60, left: 60 }}>
                    <PolarGrid gridType="polygon" stroke="#e5e7eb" strokeWidth={1.5} />
                    <PolarAngleAxis 
                      dataKey="tier" 
                      tick={{ fontSize: 12, fill: '#374151', fontWeight: 600 }}
                      tickFormatter={(value) => value.replace('Tier ', 'T')}
                    />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 100]} 
                      tick={{ fontSize: 10, fill: '#6B7280' }}
                      tickCount={6}
                      axisLine={false}
                    />
                    {masteryData.map((course, index) => (
                      <Radar
                        key={index}
                        name={course.code}
                        dataKey={course.code}
                        stroke={course.color}
                        fill={course.color}
                        fillOpacity={0.2}
                        strokeWidth={3}
                        dot={{ r: 6, fill: course.color, stroke: '#fff', strokeWidth: 2 }}
                      />
                    ))}
                    <RechartsTooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Legend - Removed as requested */}

              {/* Summary */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                  <Info className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Assessment Summary</span>
                </div>
                <p className="text-sm text-blue-800">
                  You're performing well in foundational tiers (1-3) but need focus on advanced competencies (Tiers 6-7). 
                  Consider practicing more complex problems to improve evaluation and innovation skills.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mathematics I Topic Mastery */}
        <Card className="bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Mathematics I Topic Mastery
                </CardTitle>
                <CardDescription className="mt-2">
                  Overall mastery: {mathTopicsAverageMastery}%
                </CardDescription>
              </div>
              <div className="flex items-center gap-1">
                <Info className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="space-y-4">
              {/* Math Topics Radar Chart */}
              <div className="h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={mathTopicsCombinedData} margin={{ top: 60, right: 60, bottom: 60, left: 60 }}>
                    <PolarGrid gridType="polygon" stroke="#e5e7eb" strokeWidth={1.5} />
                    <PolarAngleAxis 
                      dataKey="tier" 
                      tick={{ fontSize: 11, fill: '#374151', fontWeight: 600 }}
                      tickFormatter={(value) => {
                        const words = value.split(' ');
                        if (words.length > 2) {
                          return words.slice(0, 2).join(' ') + '...';
                        }
                        return value;
                      }}
                    />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 100]} 
                      tick={{ fontSize: 10, fill: '#6B7280' }}
                      tickCount={6}
                      axisLine={false}
                    />
                    {mathTopicsData.map((course, index) => (
                      <Radar
                        key={index}
                        name={course.code}
                        dataKey={course.code}
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.2}
                        strokeWidth={3}
                        dot={{ r: 6, fill: '#8884d8', stroke: '#fff', strokeWidth: 2 }}
                      />
                    ))}
                    <RechartsTooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Summary and Action */}
              <div className="space-y-3">
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Info className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-800">Focus Areas</span>
                  </div>
                  <p className="text-sm text-amber-800">
                    Integration topics need attention. Your strongest areas are Vectors & Matrices (85%) and Complex Numbers (78%). 
                    Consider reviewing fundamental integration concepts before moving to applications.
                  </p>
                </div>

              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tier Descriptions - Full Width Below */}
      {showDetails && (
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-6">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Info className="h-4 w-4" />
              Learning Tier Descriptions
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(tierDescriptions).map(([tier, description]) => (
                <div key={tier} className="bg-white p-4 rounded-lg border border-gray-200">
                  <h5 className="font-medium text-gray-900 mb-2">{tier}</h5>
                  <p className="text-sm text-gray-600">{description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}