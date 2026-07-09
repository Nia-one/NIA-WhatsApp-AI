import { useQuery } from "@tanstack/react-query";
import { getStudios } from "../services/studioService";

export const useStudios = () => {

    return useQuery({

        queryKey: ["studios"],

        queryFn: getStudios,

        staleTime: 1000 * 60 * 10, // Cache for 10 minutes

    });

};