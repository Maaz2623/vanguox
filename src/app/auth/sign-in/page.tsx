"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";
import React, { useState } from "react";

const SignInPage = () => {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    await signIn.social({
      provider: "google",
    });
  };

  return (
    <div>
      <Button disabled={loading} onClick={handleSignIn} variant={`outline`}>
        Sign in with Google
      </Button>
    </div>
  );
};

export default SignInPage;
