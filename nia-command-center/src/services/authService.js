import api from "./api";


// ======================================
// Admin Login
// ======================================

export const loginAdmin = async (email, password) => {

    const response = await api.post(
        "/auth/login",
        {
            email,
            password
        }
    );


    return response.data;

};