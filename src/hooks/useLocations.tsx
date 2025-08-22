import { getLocations } from "@/api/locations";
import { useQuery } from "@tanstack/react-query";

export const useGetLocations = () => {
  return useQuery({
    queryKey: ["locations"],
    queryFn: getLocations,
    staleTime: Infinity,
  });
};
