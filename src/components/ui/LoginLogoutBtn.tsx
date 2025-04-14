"use client"

import { Button } from "@/components/ui/button"
import { signIn, signOut } from "next-auth/react"

export const LoginBtn = () => {
  return <Button
  onClick={()=> signIn()}
  >
  Sign In
  </Button>
}

export const LogoutBtn = () => {
  const handleSignOut = async () => {
    // Call signOut with redirect:true and callbackUrl to auth page
    await signOut({ 
      redirect: true,
      callbackUrl: '/auth'
    });
    
    // As a backup, if the above doesn't work, force redirect after a short delay
    setTimeout(() => {
      window.location.href = '/auth';
    }, 500);
  };
  
  return (
    <Button onClick={handleSignOut}>
      Sign Out
    </Button>
  );
}
