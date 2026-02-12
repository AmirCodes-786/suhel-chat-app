import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../lib/api";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";

const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      toast.success("Login successful!");
      queryClient.setQueryData(["authUser"], data);
      
      // Explicitly navigate based on onboarding status
      if (data?.user?.isOnboarded) {
        navigate("/");
      } else {
        navigate("/onboarding");
      }
    },
  });

  return { error, isPending, loginMutation: mutate };
};

export default useLogin;
