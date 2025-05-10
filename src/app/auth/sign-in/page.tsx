"use client";
import React from "react";
import { authClient } from "@/lib/auth-client";

const SignInPage = () => {
  const signIn = async () => {
    await authClient.signIn.social({
      provider: "google",
    });
  };

  return <div onClick={signIn}>Signin With Google</div>;
};

export default SignInPage;
