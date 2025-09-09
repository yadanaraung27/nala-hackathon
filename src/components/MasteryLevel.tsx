import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend, Tooltip } from 'recharts';
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
    name: 'Data Structures & Algorithms',
    code: 'CS2040S',
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
  },
  {
    name: 'Web Development',
    code: 'CS3216',
    color: '#82ca9d',
    data: [
      { tier: 'Tier 1', mastery: 92, fullMark: 100 },
      { tier: 'Tier 2', mastery: 88, fullMark: 100 },
      { tier: 'Tier 3', mastery: 85, fullMark: 100 },
      { tier: 'Tier 4', mastery: 80, fullMark: 100 },
      { tier: 'Tier 5', mastery: 75, fullMark: 100 },
      { tier: 'Tier 6', mastery: 68, fullMark: 100 },
      { tier: 'Tier 7', mastery: 55, fullMark: 100 }
    ]
  },
  {
    name: 'Machine Learning',
    code: 'CS3244',
    color: '#ffc658',
    data: [
      { tier: 'Tier 1', mastery: 70, fullMark: 100 },
      { tier: 'Tier 2', mastery: 65, fullMark: 100 },
      { tier: 'Tier 3', mastery: 60, fullMark: 100 },
      { tier: 'Tier 4', mastery: 50, fullMark: 100 },
      { tier: 'Tier 5', mastery: 45, fullMark: 100 },
      { tier: 'Tier 6', mastery: 40, fullMark: 100 },
      { tier: 'Tier 7', mastery: 30, fullMark: 100 }
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
      {/* Course Mastery Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {masteryData.map((course, index) => {
          const averageMastery = getAverageMastery(course);
          const masteryInfo = getMasteryLevel(averageMastery);
          
          return (
            <Card key={index} className="bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: course.color }}
                    />
                    <Badge variant="outline" className="text-xs">
                      {course.code}
                    </Badge>
                  </div>
                  <Badge className={masteryInfo.color}>
                    {masteryInfo.level}
                  </Badge>
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">{course.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Overall Mastery</span>
                  <span className="text-lg font-bold text-gray-900">{averageMastery}%</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Mastery Level Radar Chart */}
      <Card className="bg-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Mastery Level
              </CardTitle>
              <CardDescription>
                Your learning progress across different competency tiers for each course
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
        
        <CardContent>
          <div className="space-y-4">
            {/* Radar Chart */}
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={combinedData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                  <PolarGrid gridType="polygon" />
                  <PolarAngleAxis 
                    dataKey="tier" 
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    className="text-xs"
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]} 
                    tick={{ fontSize: 10, fill: '#9CA3AF' }}
                    tickCount={6}
                  />
                  {masteryData.map((course, index) => (
                    <Radar
                      key={index}
                      name={course.code}
                      dataKey={course.code}
                      stroke={course.color}
                      fill={course.color}
                      fillOpacity={0.1}
                      strokeWidth={2}
                      dot={{ r: 4, fill: course.color }}
                    />
                  ))}
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4 pt-4 border-t border-gray-100">
              {masteryData.map((course, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: course.color }}
                  />
                  <span className="text-sm text-gray-700">{course.name}</span>
                </div>
              ))}
            </div>

            {/* Tier Descriptions */}
            {showDetails && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Learning Tier Descriptions:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(tierDescriptions).map(([tier, description]) => (
                    <div key={tier} className="text-xs">
                      <span className="font-medium text-gray-700">{tier}:</span>
                      <span className="text-gray-600 ml-2">{description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="flex justify-center pt-4">
              <Button variant="outline" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                View full report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}