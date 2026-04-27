import { Location } from '@/lib/types';

export const getLocations = async (): Promise<Location[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/locations`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch locations');
    }

    return response.json();
  } catch (error) {
    throw error;
  }
};

export const addLocation = async ({
  name,
}: {
  name: string;
}): Promise<Location> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/locations`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to add location');
    }

    return response.json();
  } catch (error) {
    throw error;
  }
};

export const deleteLocation = async (id: string): Promise<void> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/locations/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete location');
    }

    await response.json();
  } catch (error) {
    throw error;
  }
};
