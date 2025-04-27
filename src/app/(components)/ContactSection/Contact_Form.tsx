"use client";

import { useState, useEffect } from "react";
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
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  // Validar el formulario cada vez que cambian los datos
  useEffect(() => {
    validateForm();
  }, [formData]);

  // Función para validar todos los campos
  const validateForm = () => {
    const newErrors = {
      name: "",
      phone: "",
      email: "",
      message: "",
    };
    
    // Validación de nombre
    if (formData.name.trim() === "") {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    
    // Validación de teléfono (formato norteamericano)
    if (formData.phone.trim() === "") {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\d\s\-\(\)\+]{10,15}$/.test(formData.phone.trim())) {
      newErrors.phone = "Please enter a valid phone number";
    }
    
    // Validación de email
    if (formData.email.trim() === "") {
      newErrors.email = "Email is required";
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Validación de mensaje
    if (formData.message.trim() === "") {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }
    
    setErrors(newErrors);
    
    // Verificar si el formulario es válido (no hay errores)
    const valid = Object.values(newErrors).every(error => error === "");
    setIsFormValid(valid);
    
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);

    // Validar el formulario antes de enviar
    if (!validateForm()) {
      // Si hay errores, mostrar un mensaje y no continuar
      setDialogMessage("Please correct the errors in the form before submitting.");
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
        <div className="relative">
          <Input
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`bg-white py-5 ${errors.name ? 'border-red-500' : ''}`}
            required
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        
        <div className="relative">
          <Input
            placeholder="Phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className={`bg-white py-5 ${errors.phone ? 'border-red-500' : ''}`}
            required
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>
        
        <div className="relative">
          <Input
            placeholder="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`bg-white py-5 ${errors.email ? 'border-red-500' : ''}`}
            required
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
        
        <div className="relative">
          <Textarea
            placeholder="Write message..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className={`h-[120px] bg-white ${errors.message ? 'border-red-500' : ''}`}
            required
          />
          {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
        </div>
        
        <Button 
          type="submit" 
          className={`${buttonClasses} [w-full]`}
          disabled={!isFormValid}
        >
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
        <DialogTitle className={styles.dialogTitle}>Message Status</DialogTitle>
        <DialogDescription className={styles.dialogDescription}>
          {dialogMessage}
        </DialogDescription>
      </DialogContent>
    </Dialog>
    </>
  );
}
