import client from "@/lib/contentful";

const fetchPoliciesNFaq = async () => {
    try {
      const response = await client.getEntries({
        content_type: 'policyAndFaqCards',
      });
      return response.items;
    } catch (e) {
      console.error('Error fetching policies', e)
    }
  }

export default fetchPoliciesNFaq;