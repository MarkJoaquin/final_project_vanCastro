"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { useLocalStorageWithExpiration } from "@/hooks/useLocalStorageWithExpiration"
import './AlertDialog.css'

interface AlertDialogBookingProps {
    onPermitResponse?: (hasPermit: boolean) => void;
}

export function AlertDialogBooking({ onPermitResponse }: AlertDialogBookingProps) {
    const EXPIRATION_TIME = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
    const [learningPermitAnswer, setLearningPermitAnswer] = useLocalStorageWithExpiration('learningPermitAnswer', EXPIRATION_TIME)
    const [open, setOpen] = useState(learningPermitAnswer === null)

    const handleResponse = (hasPermit: boolean) => {
        setLearningPermitAnswer(hasPermit)
        setOpen(false)
        onPermitResponse?.(hasPermit)
    }

    return (
        <div className="flex justify-center items-center">
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Do you have a Learning Permit?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Please mark "Yes" if you have a Learning Permit.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel 
                            onClick={() => handleResponse(false)}
                            style={{ cursor: 'pointer' }}
                            aria-label="Select no"
                            title="No, I don't have a Learning Permit"
                            className="negative_answer"
                            tabIndex={0}
                        >No</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={() => handleResponse(true)}
                            style={{ cursor: 'pointer' }}
                            aria-label="Select yes"
                            title="Yes, I have a Learning Permit"
                            className="affirmative_answer"
                            tabIndex={0}
                        >Yes, I have a Learning Permit</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}