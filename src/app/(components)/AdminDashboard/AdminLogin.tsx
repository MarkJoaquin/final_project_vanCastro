"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import styles from '../LetUsKnow/LetUsKnow.module.css'; // Importing the CSS module
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";

export default function AdminLogin() {
  const [adminLogin, setAdminLogin] = useState({
    email: "",
    password: "",
  });

  const loginHandler = async () => {
    const result = await signIn("credentials",{
      email:adminLogin.email,
      password:adminLogin.password,
      redirect:false,
/*       callbackUrl:"/admin" */
    })
    console.log("RREESSULT",result)
    if (result?.ok === false) {
      alert("Email or Password was wrong,,,");
      setAdminLogin({email:'',password:''})
    } else {
      redirect('/admin');
    }
  };

  return (
    <div
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
        className={styles.button} // Applying the new button styles
        onClick={loginHandler}
      >
        Login
      </Button>
    </div>
  );
}