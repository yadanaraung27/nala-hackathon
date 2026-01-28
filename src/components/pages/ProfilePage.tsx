import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Users, Settings, Lock, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ProfilePageProps {
  onChangePassword: () => void;
  onEditProfile: () => void;
}

interface UserProfile {
  id: number;
  username: string;
  email: string;
  createdAt?: string;
}

export default function ProfilePage({ onChangePassword, onEditProfile }: ProfilePageProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5001/api/user/1');
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Unable to load profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

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
          {loading ? (
            <div className="max-w-md mx-auto text-center py-8">
              <p className="text-gray-500">Loading profile...</p>
            </div>
          ) : error ? (
            <div className="max-w-md mx-auto text-center py-8">
              <p className="text-red-600">{error}</p>
            </div>
          ) : profile ? (
            <div className="max-w-md mx-auto space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Username:</label>
                <p className="text-base text-gray-900">{profile.username}</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email:</label>
                <p className="text-base text-gray-900">{profile.email}</p>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}