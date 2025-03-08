import client from "@/lib/contentful";

export const fetchInstructors = async () => {
    try {
      const response = await client.getEntries({
        content_type: "drivingInstructor",
      });
      return response.items;
    } catch (e) {
      console.error("Error fetching instructors", e);
    }
  };