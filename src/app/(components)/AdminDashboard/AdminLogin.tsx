"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import styles from '../LetUsKnow/LetUsKnow.module.css'; // Importing the CSS module
import { signIn } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import useInitialPassStore from "@/store/initialPass";

export default function AdminLogin() {
  const [adminLogin, setAdminLogin] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { changeIsInitialPassStatus } = useInitialPassStore()

  const loginHandler = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      // Validate input
      if (!adminLogin.email || !adminLogin.password) {
        setError("Please enter both email and password");
        return;
      }

      console.log("Attempting login with:", adminLogin.email);
      
      // First attempt with redirect:false to check credentials
      const result = await signIn("credentials", {
        email: adminLogin.email,
        password: adminLogin.password,
        redirect: false
      });

      console.log("Auth result:", result);
      
      if (result?.error) {
        setError("Invalid email or password");
        setAdminLogin({email: adminLogin.email, password: ''});
      } else {
        // If login was successful, perform a direct navigation
        console.log("Login successful, redirecting to admin dashboard");
        
        try {
          // Reset any stored login state first
          localStorage.removeItem('next-auth.session-token');
          localStorage.removeItem('next-auth.callback-url');
          localStorage.removeItem('next-auth.csrf-token');
          
          // Set admin status and redirect to dashboard
          changeIsInitialPassStatus(true);
          console.log("Redirecting to admin dashboard...");
          
          // Use window.location.href for a full page reload/redirect
          window.location.href = '/admin';
        } catch (navError) {
          console.error("Navigation error:", navError);
          // Fallback redirect
          router.push("/admin");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`${styles.formSection} [w-full max-w-md space-y-4 rounded-lg p-6 lg:w-[25rem] h-[27rem] flex flex-col justify-around]`}
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-center">Admin Login</h2>
        <p className="text-sm text-gray-500 text-center">Enter your credentials to access the admin dashboard</p>
      </div>
      
      {error && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <Input
          placeholder="Email"
          type="email"
          autoComplete="email"
          value={adminLogin.email}
          onChange={(e) => setAdminLogin({ ...adminLogin, email: e.target.value })}
          className="bg-white py-5"
          disabled={isLoading}
          required
        />
        <Input
          placeholder="Password"
          type="password"
          value={adminLogin.password}
          onChange={(e) => setAdminLogin({ ...adminLogin, password: e.target.value })}
          className="bg-white py-5"
          disabled={isLoading}
          required
        />
      </div>
      
      <Button
        className={styles.button}
        onClick={loginHandler}
        disabled={isLoading}
      >
        {isLoading ? "Logging in..." : "Login"}
      </Button>
    </div>
  );
}