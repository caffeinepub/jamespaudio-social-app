import type { Principal } from "@dfinity/principal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { GroupId } from "../backend";
import { useAddGroupMember, useCreateGroup } from "./useQueries";

interface StartGroupChatParams {
  userId: Principal;
  username: string;
}

export function useStartGroupChat() {
  const createGroup = useCreateGroup();
  const addGroupMember = useAddGroupMember();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      username,
    }: StartGroupChatParams): Promise<GroupId> => {
      // Create a new group with the user's name
      const groupId = await createGroup.mutateAsync({
        name: `Chat with ${username}`,
        description: "Direct group chat",
      });

      // Add the user as a member
      await addGroupMember.mutateAsync({
        groupId,
        userId,
      });

      return groupId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userGroups"] });
    },
  });
}
