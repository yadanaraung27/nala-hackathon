import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ArrowLeft } from 'lucide-react';

interface ChangePasswordPageProps {
  onBack: () => void;
}

export default function ChangePasswordPage({ onBack }: ChangePasswordPageProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = () => {
    // Handle password change logic here
    console.log('Password change requested');
    onBack(); // Return to profile page after save
  };

  const handleCancel = () => {
    // Clear form and return to profile
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    onBack();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-semibold text-gray-900 text-blue-600">Change Password</h1>
        <p className="text-sm text-gray-500 mt-1">Update your account password</p>
      </div>

      {/* Change Password Form */}
      <Card>
        <CardContent className="p-8">
          <div className="max-w-md mx-auto space-y-6">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input 
                id="current-password"
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input 
                id="new-password"
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input 
                id="confirm-password"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Password Requirements */}
            <div className="space-y-1 text-sm text-red-600">
              <p>• At least 8 characters</p>
              <p>• At least 1 uppercase and 1 lowercase letter</p>
              <p>• At least 1 number digit and 1 special character</p>
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