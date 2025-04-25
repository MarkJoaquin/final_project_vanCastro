"use client";

import { useState } from 'react';
import { X } from 'lucide-react';

interface ImageViewerProps {
  imageUrl: string;
  altText?: string;
}

export default function ImageViewer({ imageUrl, altText = "Image" }: ImageViewerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
    // Prevenir scroll cuando el modal está abierto
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsOpen(false);
    // Restaurar scroll cuando el modal se cierra
    document.body.style.overflow = 'auto';
  };

  return (
    <>
      {/* Imagen en miniatura que actúa como trigger */}
      <div className="border rounded p-2 mt-1 cursor-pointer" onClick={openModal}>
        <img 
          src={imageUrl} 
          alt={altText} 
          className="w-full h-auto max-h-40 object-contain" 
        />
      </div>

      {/* Modal de imagen expandida */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75" onClick={closeModal}>
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <button 
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
              onClick={(e) => {
                e.stopPropagation();
                closeModal();
              }}
            >
              <X className="h-6 w-6" />
            </button>
            <img 
              src={imageUrl} 
              alt={altText} 
              className="max-w-full max-h-[90vh] object-contain" 
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
}
