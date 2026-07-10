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

export const importGuests = async (rows) => {

    const { data } = await api.post(
        "/guests/import",
        rows
    );

    return data;

};

export const downloadGuestTemplate = async () => {

    const response = await api.get(
        "/guests/template",
        {
            responseType: "blob"
        }
    );

    const url = window.URL.createObjectURL(
        new Blob([response.data])
    );

    const link = document.createElement("a");

    link.href = url;

    link.download = "Guest_Master_Template.xlsx";

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);

};