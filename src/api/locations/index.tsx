export const getLocations = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/locations`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch locations");
    }

    return response.json();
  } catch (error) {
    throw error;
  }
};
