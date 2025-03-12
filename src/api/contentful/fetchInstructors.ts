import client from "@/lib/contentful";

export const fetchInstructors = async () => {
    try {
      const response = await client.getEntries({
        content_type: "drivingInstructor",
      });
      console.log("Instructors data:", response.items);
      return response.items;
    } catch (e) {
      console.error("Error fetching instructors", e);
    }
  };