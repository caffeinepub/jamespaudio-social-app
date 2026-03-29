import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import type { Principal } from "@dfinity/principal";
import { Loader2, UserPlus, X } from "lucide-react";
import { useState } from "react";
import { useSearchProfiles } from "../../hooks/useQueries";

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    name: string,
    description: string,
    initialMembers: Principal[],
  ) => void;
  isSubmitting: boolean;
  error?: string;
}

export default function CreateGroupDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  error,
}: CreateGroupDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [validationError, setValidationError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<Principal[]>([]);

  const { data: searchResults = [] } = useSearchProfiles(searchTerm);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setValidationError("Group name is required");
      return;
    }
    setValidationError("");
    onSubmit(name.trim(), description.trim(), selectedMembers);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isSubmitting) {
      if (!newOpen) {
        setName("");
        setDescription("");
        setValidationError("");
        setSearchTerm("");
        setSelectedMembers([]);
      }
      onOpenChange(newOpen);
    }
  };

  const handleAddMember = (userId: Principal) => {
    if (!selectedMembers.find((m) => m.toString() === userId.toString())) {
      setSelectedMembers([...selectedMembers, userId]);
    }
  };

  const handleRemoveMember = (userId: Principal) => {
    setSelectedMembers(
      selectedMembers.filter((m) => m.toString() !== userId.toString()),
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
            <DialogDescription>
              Create a new group and add members to start conversations.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4 flex-1 overflow-hidden flex flex-col">
            <div className="space-y-2">
              <Label htmlFor="group-name">
                Group Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="group-name"
                placeholder="Enter group name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                className={validationError ? "border-destructive" : ""}
              />
              {validationError && (
                <p className="text-sm text-destructive">{validationError}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="group-description">Description</Label>
              <Textarea
                id="group-description"
                placeholder="Enter group description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
                rows={2}
              />
            </div>

            <div className="space-y-2 flex-1 overflow-hidden flex flex-col">
              <Label htmlFor="member-search">Add Members (Optional)</Label>
              <Input
                id="member-search"
                placeholder="Search users by username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isSubmitting}
              />

              {selectedMembers.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2 bg-muted rounded">
                  {selectedMembers.map((memberId) => {
                    const memberResult = searchResults.find(
                      (r) => r.userId.toString() === memberId.toString(),
                    );
                    return (
                      <Badge
                        key={memberId.toString()}
                        variant="secondary"
                        className="gap-1"
                      >
                        {memberResult?.username || "User"}
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(memberId)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              )}

              {searchTerm.trim() && (
                <ScrollArea className="flex-1 border rounded-md">
                  <div className="p-2 space-y-2">
                    {searchResults.length > 0 ? (
                      searchResults.map((user) => {
                        const isSelected = selectedMembers.find(
                          (m) => m.toString() === user.userId.toString(),
                        );
                        return (
                          <div
                            key={user.userId.toString()}
                            className="flex items-center gap-3 p-2 rounded hover:bg-muted cursor-pointer"
                            onClick={() =>
                              !isSelected && handleAddMember(user.userId)
                            }
                            onKeyUp={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                if (!isSelected) handleAddMember(user.userId);
                              }
                            }}
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.profilePicture.url} />
                              <AvatarFallback>
                                {getInitials(user.username)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {user.username}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {user.bio}
                              </p>
                            </div>
                            {isSelected ? (
                              <Badge variant="secondary">Added</Badge>
                            ) : (
                              <Button type="button" size="sm" variant="ghost">
                                <UserPlus className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No users found
                      </p>
                    )}
                  </div>
                </ScrollArea>
              )}
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Group"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
