import api from "./api";


// Get Guests
export const getGuests = async () => {

    const { data } = await api.get(
        "/guests"
    );

    return data.data;

};



// Create Guest
export const createGuest = async (guestData) => {

    const { data } = await api.post(
        "/guests",
        guestData
    );

    return data;

};



// Export Guests
export const exportGuests = async () => {

    const { data } = await api.get(
        "/guests/export"
    );

    return data;

};