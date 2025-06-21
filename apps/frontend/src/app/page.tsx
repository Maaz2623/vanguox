"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const HomePage = () => {
  const handleGet = async () => {
    await authClient.signOut();
  };

  return (
    <div>
      HomePage
      <Button onClick={handleGet}>Get</Button>
    </div>
  );
};

export default HomePage;
