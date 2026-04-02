import { RegisterForm } from "@/features/auth/components/register-form";
import { requireUnAuth } from "@/lib/auth-utils";

const SignUpPage = async () => {
  await requireUnAuth();
  return <RegisterForm />;
};

export default SignUpPage;
