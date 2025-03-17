"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-4 rounded-lg bg-zinc-900 p-6 w-lg:[25rem] h-[27rem] flex flex-col justify-around"
    >
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
        className="bg-white  py-5"
        required
      />
      <Input
        placeholder="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="bg-white  py-5"
        required
      />
      <Textarea
        placeholder="Write message..."
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        className="h-[120px] bg-white"
        required
      />
      <Button
        type="submit"
        className="w-full bg-[var(--primary-color)] text-black font-semibold hover:bg-[#FDB813]/90"
      >
        Send Message
      </Button>
    </form>
  );
}
