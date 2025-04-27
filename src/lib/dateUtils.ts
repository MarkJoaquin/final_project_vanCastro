export const formatLessonDate = (dateString: string | Date): string => {
    try {
        const date = typeof dateString === "string" ? new Date(dateString.split("T")[0]) : new Date(dateString);
        return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        });
    } catch (error) {
        console.error("Error formatting date:", error);
        return "Unknown date";
    }
};