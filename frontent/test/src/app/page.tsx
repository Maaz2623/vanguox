"use client";
import axios from "axios";
import React, { useState } from "react";

const HomePage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      await axios.post("http://localhost:3000/api/insert-user", {
        name,
        email,
      });
    } catch (error) {
      console.log(error);
    }
    console.log({ name, email });
  };

  return (
    <div className="p-20 flex flex-col space-y-4">
      <form onSubmit={handleSubmit}>
        <div className="border flex flex-col space-y-2">
          <label>Name</label>
          <input
            type="text"
            className="border h-14"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="border flex flex-col space-y-2">
          <label>Email</label>
          <input
            type="text"
            className="border"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button className="bg-green-500 p-2">Submit</button>
      </form>
    </div>
  );
};

export default HomePage;
