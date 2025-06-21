"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import React from "react";

const SignUpPage = () => {
  return (
    <div>
      <Button
        onClick={() =>
          authClient.signIn.social({
            provider: "google",
            callbackURL: "https://vanguox.com",
          })
        }
      >
        Sign In
      </Button>
    </div>
  );
};

export default SignUpPage;
