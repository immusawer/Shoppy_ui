import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar, Mail, User, Camera } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { UserProfile } from "./client_profile";
import { fetchUserProfile, updateUserProfile } from "./client_profile";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (open) {
      console.log('Profile dialog opened, loading profile...');
      loadProfile();
    }
  }, [open]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      console.log('=== Profile Component Debug ===');
      console.log('Loading profile...');
      const userProfile = await fetchUserProfile();
      console.log('Profile loaded successfully');
      console.log('Profile Image URL:', userProfile.profileImage);
      console.log('Full Profile Data:', userProfile);
      setProfile(userProfile);
    } catch (error: any) {
      console.error('=== Profile Component Error ===');
      console.error('Error loading profile:', error);
      console.error('Error message:', error.message);
      console.error('========================');
      toast.error('Failed to load profile', {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfile = async () => {
    setIsEditing(true);
    try {
      // Here you would typically open a form or modal for editing
      // For now, we'll just toggle the state
      toast.success('Profile edit mode enabled');
    } catch (error: any) {
      toast.error('Failed to edit profile', {
        description: error.message,
      });
    } finally {
      setIsEditing(false);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-slate-950/80 backdrop-blur-sm border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">Loading Profile</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!profile) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-slate-950/80 backdrop-blur-sm border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">Profile</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center h-40">
            <p className="text-white">No profile data available</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-950/80 backdrop-blur-sm border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-white">Profile</DialogTitle>
        </DialogHeader>
        
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-6">
              {/* Avatar Section */}
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage 
                    src={profile.profileImage 
                      ? profile.profileImage.startsWith('data:') || profile.profileImage.startsWith('blob:')
                        ? profile.profileImage
                        : `http://localhost:3001${profile.profileImage}`
                      : "/avatars/01.png"} 
                    alt={`${profile.name || profile.username}'s avatar`} 
                    onError={(e) => {
                      console.error('=== Avatar Image Error ===');
                      console.error('Error loading profile image:', e);
                      console.error('Failed image URL:', e.currentTarget.src);
                      console.error('Profile Image Path:', profile.profileImage);
                      console.error('========================');
                      e.currentTarget.src = "/avatars/01.png";
                    }}
                  />
                  <AvatarFallback className="bg-slate-800 text-white text-2xl">
                    {(profile.name || profile.username).charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-slate-800 border-slate-700 hover:bg-slate-700"
                  onClick={handleEditProfile}
                  disabled={isEditing}
                >
                  <Camera className="h-4 w-4 text-white" />
                </Button>
              </div>

              {/* User Info Section */}
              <div className="text-center space-y-1">
                <h3 className="text-xl font-semibold text-white">
                  {profile.name || profile.username}
                </h3>
                <div className="flex items-center justify-center space-x-2 text-gray-400">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{profile.email}</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-gray-400">
                  <User className="h-4 w-4" />
                  <span className="text-sm">@{profile.username}</span>
                </div>
              </div>

              <Separator className="bg-slate-800" />

              {/* Stats Section */}
              <div className="w-full space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <Label className="text-gray-400">Member since</Label>
                  </div>
                  <span className="text-white">
                    {new Date(profile.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long'
                    })}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <Label className="text-gray-400">Last updated</Label>
                  </div>
                  <span className="text-white">
                    {new Date(profile.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long'
                    })}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 w-full">
                <Button 
                  variant="outline" 
                  className="flex-1 bg-slate-800 border-slate-700 hover:bg-slate-700 text-white"
                  onClick={handleEditProfile}
                  disabled={isEditing}
                >
                  Edit Profile
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 bg-slate-800 border-slate-700 hover:bg-slate-700 text-white"
                >
                  Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
} 