import { useQuery } from "@tanstack/react-query";
import { getGuests } from "../services/guestService";

export const useGuests = () => {

    return useQuery({
        queryKey: ["guests"],
        queryFn: getGuests,
    });

};