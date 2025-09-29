import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Send, ExternalLink, Github, Users, MessageSquare } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const contributors = [
  { name: 'yadanaraung27', url: 'https://github.com/yadanaraung27' },
  { name: 'nigelyeap', url: 'https://github.com/nigelyeap' },
  { name: 'AngBryan', url: 'https://github.com/AngBryan' }
];

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    email: '',
    title: '',
    type: 'Bug Report',
    details: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const feedbackTypes = [
    'Bug Report',
    'Feature Request', 
    'Improvement Suggestion',
    'Request Assistance',
    'Others'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.details.trim()) {
      toast.error('Please fill in the title and details fields');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Thank you for your feedback! We\'ll review it soon.');
      
      // Reset form
      setFormData({
        email: '',
        title: '',
        type: 'Bug Report',
        details: ''
      });
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <MessageSquare className="h-8 w-8 text-purple-600" />
          <h1 className="text-4xl font-semibold text-gray-900">Help us to be better! 🙏</h1>
        </div>
        <p className="text-gray-600">
          Your feedback helps us improve LearnUs and create a better learning experience for everyone. 
          We value every suggestion, bug report, and feature request.
        </p>
      </div>

      {/* Feedback Form */}
      <Card className="shadow-sm border border-gray-200">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Send className="h-5 w-5" />
            Submit Feedback
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Your email (optional, for follow-up purposes only if needed)"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-gray-50 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            {/* Title Field */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-700 font-medium">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Feedback title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="bg-gray-50 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>

            {/* Type Selection */}
            <div className="space-y-3">
              <Label className="text-gray-700 font-medium">
                Type <span className="text-red-500">*</span>
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {feedbackTypes.map((type) => (
                  <label
                    key={type}
                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                      formData.type === type
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={type}
                      checked={formData.type === type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Details Field */}
            <div className="space-y-2">
              <Label htmlFor="details" className="text-gray-700 font-medium">
                Details <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="details"
                placeholder="Feedback details"
                value={formData.details}
                onChange={(e) => handleInputChange('details', e.target.value)}
                className="bg-gray-50 border-gray-300 focus:border-purple-500 focus:ring-purple-500 min-h-[120px] resize-y"
                required
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-base font-medium shadow-sm"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Submit Feedback
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Contributors Section */}
      <Card className="shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="text-center space-y-6">
            <h2 className="text-xl font-bold text-gray-900">
              Special thanks to our Contributors
            </h2>
            
            <div className="flex items-center justify-center gap-2 text-gray-700">
              <Users className="h-5 w-5" />
              <span className="font-medium">Developers</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              {contributors.map((contributor, index) => (
                <a
                  key={index}
                  href={contributor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <Badge
                    variant="outline"
                    className="px-4 py-2 text-sm bg-white hover:bg-gray-50 border-gray-300 hover:border-gray-400 transition-all cursor-pointer group-hover:shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <Github className="h-4 w-4 text-gray-600 group-hover:text-gray-800" />
                      <span className="text-gray-700 group-hover:text-gray-900 font-medium">
                        {contributor.name}
                      </span>
                      <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-gray-600" />
                    </div>
                  </Badge>
                </a>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}