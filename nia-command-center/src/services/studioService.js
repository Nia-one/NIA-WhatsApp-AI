import api from "./api";

// =============================
// Get All Studios
// =============================
export const getStudios = async () => {

    const { data } = await api.get("/studios");

    return data.data;

};

// =============================
// Create Studio
// =============================
export const createStudio = async (payload) => {

    const { data } = await api.post(
        "/studios",
        payload
    );

    return data.data;

};

// =============================
// Update Studio
// =============================
export const updateStudio = async (id, payload) => {

    const { data } = await api.put(
        `/studios/${id}`,
        payload
    );

    return data.data;

};