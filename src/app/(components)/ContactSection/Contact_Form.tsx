"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@radix-ui/react-dialog';
import styles from '../LetUsKnow/LetUsKnow.module.css'; 
import { AiOutlineClose } from "react-icons/ai";
import { usePathname } from "next/navigation";


export default function ContactForm() {
  const pathName = usePathname();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setDialogMessage("Please enter a valid email address.");
      setDialogOpen(true);
      setTimeout(() => setDialogOpen(false), 7000); 
      return;
    }

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        cache: "no-store",
      });

      if (response.ok) {
        setDialogMessage("Your email was successfully sent. We will get back to you shortly.");
        setFormData({
          name: "",
          phone: "",
          email: "",
          message: "",
        });
      } else {
        const errorData = await response.json();
        console.error("Failed to send email:", errorData);
        setDialogMessage("Failed to send email: " + (errorData.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setDialogMessage("There was an error sending your message. Please try again later.");
    } finally {
      setDialogOpen(true);
      setTimeout(() => setDialogOpen(false), 7000);
    }
  };

  const formClasses = pathName === "/plans"
    ? "w-full max-w-md space-y-4 rounded-lg bg-zinc-900 p-6 lg:w-[25rem] h-[27rem] flex flex-col justify-around"
    : styles.formLetUsKnow;

  const buttonClasses = pathName === "/plans"
    ? "w-full bg-[var(--primary-color)] text-black font-semibold hover:bg-[#FDB813]/90 cursor-pointer"
    : styles.button;

  return (
    <>
      <form onSubmit={handleSubmit} className={`${formClasses} ${styles.slideUp}`}>
        <Input
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="bg-white py-5"
          required
        />
        <Input
          placeholder="Phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="bg-white py-5"
          required
        />
        <Input
          placeholder="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="bg-white py-5"
          required
        />
        <Textarea
          placeholder="Write message..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="h-[120px] bg-white"
          required
        />
        <Button type="submit" className={`${buttonClasses} [w-full]`}>
          Send Message
        </Button>
      </form>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
      </DialogTrigger>
      
      <DialogContent className={styles.dialogContent}>
        <DialogClose asChild>
          <button className={styles.dialogButton}>
            <AiOutlineClose size={20} /> 
          </button>
        </DialogClose>
        {/* <DialogTitle className={styles.dialogTitle}>Message</DialogTitle> */}
        <DialogDescription className={styles.dialogDescription}>
          {dialogMessage}
        </DialogDescription>
      </DialogContent>
    </Dialog>
    </>
  );
}
