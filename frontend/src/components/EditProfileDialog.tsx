import { useState, useEffect } from 'react';
import { useUpdateProfile } from '../hooks/useQueries';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { UserProfile } from '../backend';

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentProfile: UserProfile;
}

export default function EditProfileDialog({ open, onOpenChange, currentProfile }: EditProfileDialogProps) {
  const [bio, setBio] = useState(currentProfile.bio);
  const [status, setStatus] = useState(currentProfile.status);
  const updateProfile = useUpdateProfile();

  useEffect(() => {
    if (open) {
      setBio(currentProfile.bio);
      setStatus(currentProfile.status);
    }
  }, [open, currentProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateProfile.mutateAsync({
        bio: bio.trim(),
        profilePicture: currentProfile.profilePicture,
      });
      toast.success('Profile updated successfully!');
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={updateProfile.isPending}
              rows={4}
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={updateProfile.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={updateProfile.isPending}>
              {updateProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
