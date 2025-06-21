"use client";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  const handleGet = async () => {
    const res = await fetch("https://vanguox.onrender.com/", {
      method: "GET",
    });

    const data = await res.json();
    console.log(data);
  };

  return (
    <div>
      HomePage
      <Button onClick={handleGet}>Get</Button>
    </div>
  );
};

export default HomePage;
