import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Users, Settings, Lock, ArrowLeft } from 'lucide-react';

interface ProfilePageProps {
  onChangePassword: () => void;
  onEditProfile: () => void;
}

export default function ProfilePage({ onChangePassword, onEditProfile }: ProfilePageProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-semibold text-gray-900">Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account settings and preferences</p>
      </div>

      {/* Profile Information Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-blue-600">
              Profile
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={onChangePassword}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                Change Password
              </Button>
              <Button 
                onClick={onEditProfile}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Edit Profile
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Profile Information */}
          <div className="max-w-md mx-auto space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Username:</label>
              <p className="text-base text-gray-900">yada007</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email:</label>
              <p className="text-base text-gray-900">yada007@e.ntu.edu.sg</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}