import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "../lib/api";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";

const useSignUp = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      toast.success("Account created successfully!");
      queryClient.setQueryData(["authUser"], data);
      navigate("/onboarding");
    },
  });

  return { isPending, error, signupMutation: mutate };
};

export default useSignUp;
