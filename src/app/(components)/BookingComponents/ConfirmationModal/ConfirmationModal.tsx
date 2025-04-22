"use client"

import { FormData, Plan, PlanClass, Location } from '@/types/FormTypes';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ConfirmationModalProps {
  formData: FormData;
  selectedPlan: Plan | null;
  selectedClass: PlanClass | null;
  instructor: any | null;
  location: Location | null;
  subtotal: number;
  gst: number;
  total: number;
  singleLessonPrice: string | null;
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const ConfirmationModal = ({
  formData,
  selectedPlan,
  selectedClass,
  instructor,
  location,
  subtotal,
  gst,
  total,
  singleLessonPrice,
  onConfirm,
  onCancel,
  isSubmitting
}: ConfirmationModalProps) => {
  const formatDate = (date: Date | null | undefined) => {
    if (!date) return 'N/A';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatTime = (date: Date | null | undefined) => {
    if (!date) return 'N/A';
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 p-4 pt-35" style={{ backgroundColor: '#000000a6' }}>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
        <div className="bg-blue-50 p-4 border-b border-blue-100">
          <h2 className="text-xl font-bold text-blue-800 text-center">Booking Confirmation</h2>
        </div>
        
        <div className="p-5 max-h-[70vh] overflow-y-auto">
          {/* Personal Information Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Your Information</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onCancel}
                className="text-xs h-7 px-2 py-0"
              >
                Edit
              </Button>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="w-6 mr-2">👤</span>
                <span>{formData.firstName} {formData.lastName || 'Complete this field'}</span>
              </div>

              <div className="flex items-center">
                <span className="w-6 mr-2">📞</span>
                <span>{formData.phone || 'Complete this field'}</span>
              </div>
              <div className="flex items-center">
                <span className="w-6 mr-2">📧</span>
                <span>{formData.email || 'Complete this field'}</span>
              </div>
              
              {formData.hasDriverLicense === 'yes' && (
                <div className="flex items-start">
                  <span className="w-6 mr-2 mt-1">🪪</span>
                  <div>
                    <div>Class {formData.licenseType || 'Complete this field'}</div>
                    <div className="text-sm text-gray-600">{formData.licenseNumber || 'Complete this field'}</div>
                    <div className="text-sm text-gray-600">Expires: {formatDate(formData.licenseExpiryDate) || 'Complete this field'}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Lesson Information Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Lesson Information</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onCancel}
                className="text-xs h-7 px-2 py-0"
              >
                Edit
              </Button>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="w-6 mr-2">📅</span>
                <span>{formData.dateTime ? formData.dateTime.toLocaleDateString('en-US', {
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric'
                }) : 'Complete this field'}</span>
              </div>
              <div className="flex items-center">
                <span className="w-6 mr-2">🕒</span>
                <span>
                  {formData.dateTime ? formatTime(formData.dateTime) : 'N/A'} - 
                  {formData.dateTime && selectedPlan ? formatTime(new Date(formData.dateTime.getTime() + selectedPlan.time * 60000)) : 'N/A'}
                  <span className="text-sm text-gray-600 ml-1">({selectedPlan ? `${selectedPlan.time} mins` : 'N/A'})</span>
                </span>
              </div>
              <div className="flex items-center">
                <span className="w-6 mr-2">📍</span>
                <span>{location?.name || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <span className="w-6 mr-2">👨‍🏫</span>
                <span>{instructor?.name || 'N/A'}</span>
              </div>
              <div className="flex items-start">
                <span className="w-6 mr-2 mt-1">📝</span>
                <div>
                  <div>{selectedClass?.name} {selectedPlan?.name}</div>
                  <div className="text-sm text-gray-600">{selectedPlan?.lessons || 0} lessons for {selectedPlan?.time || 0} mins</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Payment Information Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Payment Information</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onCancel}
                className="text-xs h-7 px-2 py-0"
              >
                Edit
              </Button>
            </div>
            
            <div className="flex items-center mb-4">
              <span className="w-6 mr-2">💳</span>
              <span>{formData.paymentMethod}</span>
            </div>
            
            <div className="border-t border-b py-3 mb-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>GST(5%)</span>
                <span>${gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            
            {singleLessonPrice && selectedPlan && selectedPlan.lessons > 1 && (
              <div className="text-sm text-blue-800 bg-blue-50 p-3 rounded-md border border-blue-100">
                Please pay for at least one lesson (${singleLessonPrice} with GST included) 24 hours before the lesson starts
              </div>
            )}
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="bg-gray-50 p-4 border-t flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onCancel}
          >
            Back
          </Button>
          <Button
            type="button"
            className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-medium border-0"
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Make a book'}
          </Button>
        </div>
        
        {/* Close button */}
        <button 
          onClick={onCancel} 
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
