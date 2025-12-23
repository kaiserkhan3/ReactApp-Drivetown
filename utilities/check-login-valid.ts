import { useUserData } from "@/hooks/useUserData";

export const checkLoginValid = () => {
  const { userId } = useUserData();
  if (!userId) return false;
  return true;
};
