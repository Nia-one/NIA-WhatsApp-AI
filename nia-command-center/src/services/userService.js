import api from "./api";


// ======================================
// Get Users
// ======================================

export const getUsers = async () => {

  const { data } = await api.get(
    "/admin/users"
  );

  return data;

};



// ======================================
// Create User
// ======================================

export const createUser = async (payload) => {

  const { data } = await api.post(
    "/admin/users",
    payload
  );

  return data;

};