const supabase = require("../config/supabase");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// ======================================
// Create Admin
// ======================================

async function createAdmin(
    name,
    email,
    password
) {

    const passwordHash =
        await bcrypt.hash(
            password,
            10
        );


    const { data, error } =
        await supabase
            .from("admin_users")
            .insert({

                name,

                email,

                password_hash: passwordHash

            })
            .select()
            .single();


    if (error) {

        throw error;

    }


    return data;

}


// ======================================
// Login Admin
// ======================================

async function loginAdmin(
    email,
    password
) {


    const { data, error } =
        await supabase
            .from("admin_users")
            .select("*")
            .eq("email", email)
            .single();


    if (error) {

        throw new Error(
            "Invalid credentials"
        );

    }


    const isValid =
        await bcrypt.compare(
            password,
            data.password_hash
        );


    if (!isValid) {

        throw new Error(
            "Invalid credentials"
        );

    }


    const token = jwt.sign(
    {
        id: data.id,
        email: data.email,
        role: data.role
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "8h"
    }
);

return {

    token,

    user: {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role
    }

};

}


module.exports = {

    createAdmin,

    loginAdmin

};