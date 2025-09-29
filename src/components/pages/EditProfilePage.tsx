import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ArrowLeft, Edit } from 'lucide-react';

interface EditProfilePageProps {
  onBack: () => void;
}

export default function EditProfilePage({ onBack }: EditProfilePageProps) {
  const [username, setUsername] = useState('yada007');
  const [email, setEmail] = useState('yada007@e.ntu.edu.sg');

  const handleSave = () => {
    // Handle profile update logic here
    console.log('Profile update requested', { username, email });
    onBack(); // Return to profile page after save
  };

  const handleCancel = () => {
    // Reset to original values and return to profile
    setUsername('yada007');
    setEmail('yada007@e.ntu.edu.sg');
    onBack();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-semibold text-gray-900 text-blue-600">Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Update your account information</p>
      </div>

      {/* Edit Profile Form */}
      <Card>
        <CardContent className="p-8">
          <div className="max-w-md mx-auto space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <Input 
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pr-10"
                />
                <Edit className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-600" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email"
                value={email}
                disabled
                className="w-full bg-gray-100 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500">Email cannot be changed</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                Save
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}