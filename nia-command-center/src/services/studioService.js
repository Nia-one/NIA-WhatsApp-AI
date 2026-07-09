import api from "./api";

// =============================
// Get All Studios
// =============================
export const getStudios = async () => {

    const { data } = await api.get("/studios");

    return data.data;

};