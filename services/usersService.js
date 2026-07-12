const supabase = require("../config/supabase");
const bcrypt = require("bcrypt");
const { logAudit } = require("../services/auditService");
// ======================================
// Get Users
// ======================================

async function getUsers({
    page = 1,
    limit = 10,
    search = "",
    role,
    status
}) {

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
        .from("admin_users")
        .select(
            `
            id,
            name,
            email,
            mobile,
            role,
            status,
            last_login,
            created_at,
            updated_at
            `,
            { count: "exact" }
        );


    if (search) {

        query = query.or(
            `name.ilike.%${search}%,email.ilike.%${search}%`
        );

    }


    if (role) {

        query = query.eq("role", role);

    }


    if (status) {

        query = query.eq("status", status);

    }


    const {
        data,
        error,
        count
    } = await query
        .range(from, to)
        .order("created_at", {
            ascending: false
        });


    if (error) throw error;


    return {

        users: data,

        total: count,

        page,

        limit

    };

}


// ======================================
// Get User By ID
// ======================================

async function getUserById(id) {

    const {
        data,
        error
    } = await supabase
        .from("admin_users")
        .select(`
            id,
            name,
            email,
            mobile,
            role,
            status,
            last_login,
            created_at,
            updated_at
        `)
        .eq("id", id)
        .single();


    if (error) throw error;


    return data;

}


// ======================================
// Create User
// ======================================

async function createUser(payload) {

    const {

        name,

        email,

        mobile,

        password,

        role,

        createdBy

    } = payload;


    // Duplicate Email Check

    const {
        data: existing
    } = await supabase
        .from("admin_users")
        .select("id")
        .eq("email", email)
        .maybeSingle();


    if (existing) {

        throw new Error(
            "Email already exists"
        );

    }


    const passwordHash = await bcrypt.hash(
        password,
        10
    );


    const {
        data,
        error
    } = await supabase
        .from("admin_users")
        .insert({

            name,

            email,

            mobile,

            password_hash: passwordHash,

            role,

            status: "Active",

            created_by: createdBy

        })
        .select()
        .single();


    if (error) throw error;


    if (data) {

        delete data.password_hash;

    }


    return data;

}


// ======================================
// Update User
// ======================================

async function updateUser(id, payload) {

    const {

        name,

        email,

        mobile,

        role,

        updatedBy

    } = payload;


    // Duplicate Email Check

    if (email) {

        const {
            data: existingUser
        } = await supabase
            .from("admin_users")
            .select("id")
            .eq("email", email)
            .neq("id", id)
            .maybeSingle();


        if (existingUser) {

            throw new Error(
                "Email already exists"
            );

        }

    }


    const {
        data,
        error
    } = await supabase
        .from("admin_users")
        .update({

            name,

            email,

            mobile,

            role,

            updated_by: updatedBy,

            updated_at: new Date()

        })
        .eq("id", id)
        .select()
        .single();


    if (error) throw error;


    if (data) {

        delete data.password_hash;

    }


    return data;

}


// ======================================
// Update Status
// ======================================

async function updateUserStatus(
    id,
    status,
    updatedBy
) {


    // Prevent self deactivation

    if (
        id === updatedBy &&
        status === "Inactive"
    ) {

        throw new Error(
            "You cannot deactivate your own account"
        );

    }


    const {
        data,
        error
    } = await supabase
        .from("admin_users")
        .update({

            status,

            updated_by: updatedBy,

            updated_at: new Date()

        })
        .eq("id", id)
        .select()
        .single();


    if (error) throw error;


    if (data) {

        delete data.password_hash;

    }


    return data;

}


// ======================================
// Reset Password
// ======================================

async function resetPassword(
    id,
    password
) {

    const passwordHash = await bcrypt.hash(
        password,
        10
    );


    const {
        data,
        error
    } = await supabase
        .from("admin_users")
        .update({

            password_hash: passwordHash,

            updated_at: new Date()

        })
        .eq("id", id)
        .select()
        .single();


    if (error) throw error;


    if (data) {

        delete data.password_hash;

    }


    return data;

}


// ======================================
// Delete User
// ======================================

async function deleteUser(
    id,
    currentUserId
) {


    // Prevent self deletion

    if (id === currentUserId) {

        throw new Error(
            "You cannot delete your own account"
        );

    }


    // Get target user

    const {
        data: user,
        error: userError
    } = await supabase
        .from("admin_users")
        .select("role")
        .eq("id", id)
        .single();


    if (userError) {

        throw userError;

    }


    // Prevent deleting last admin

    if (user.role === "admin") {


        const {
            count,
            error: countError
        } = await supabase
            .from("admin_users")
            .select(
                "id",
                {
                    count: "exact",
                    head: true
                }
            )
            .eq("role", "admin");


        if (countError) {

            throw countError;

        }


        if (count <= 1) {

            throw new Error(
                "Cannot delete the last admin user"
            );

        }

    }


    const {
        error
    } = await supabase
        .from("admin_users")
        .delete()
        .eq("id", id);


    if (error) throw error;


    return true;

}


module.exports = {

    getUsers,

    getUserById,

    createUser,

    updateUser,

    updateUserStatus,

    resetPassword,

    deleteUser

};