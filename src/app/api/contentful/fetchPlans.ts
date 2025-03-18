import client from "@/lib/contentful";

export const fetchPlans = async () => {
    try {
      const response = await client.getEntries({
        content_type: 'planCard',
      });
      return response.items;
    } catch (e) {
      console.error('Error fetching plans', e)
    }
  }