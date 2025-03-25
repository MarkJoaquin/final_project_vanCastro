"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import styles from '../LetUsKnow/LetUsKnow.module.css'; // Importing the CSS module

export default function AdminLogin() {
  const [adminLogin, setAdminLogin] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(adminLogin);

    try {
      const response = await fetch("/api/login-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminLogin),
        cache: "no-store",
      });

      if (response.ok) {
        console.log("Login OK",await response.json());
        alert("Login");
        setAdminLogin({
          email: "",
          password: "",
        });
      } else {
        const errorData = await response.json();
        console.error("Failed to send email:", errorData);
        alert("Failed to send email: " + (errorData.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Email or Password is wrong");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`${styles.formSection} [w-full max-w-md space-y-4 rounded-lg p-6 lg:w-[25rem] h-[27rem] flex flex-col justify-around]`} // Applying the new class
    >
      <Input
        placeholder="Email"
        type="email"
        value={adminLogin.email}
        onChange={(e) => setAdminLogin({ ...adminLogin, email: e.target.value })}
        className="bg-white py-5"
        required
      />
      <Input
        placeholder="password"
        type="password"
        value={adminLogin.password}
        onChange={(e) => setAdminLogin({ ...adminLogin, password: e.target.value })}
        className="bg-white py-5"
        required
      />
      <Button
        type="submit"
        className={styles.button} // Applying the new button styles
      >
        Login
      </Button>
    </form>
  );
}