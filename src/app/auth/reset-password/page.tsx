import React, { Suspense } from "react";
import ResetPasswordForm from "./_components/reset-password-form";

const Page = () => {
  return (
    <div>
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
};

export default Page;
