require("dotenv").config();

const bcrypt = require("bcrypt");
const supabase = require("./config/supabase");

async function createAdmin() {
    try {

        const passwordHash = await bcrypt.hash(
            "password123",
            10
        );

        const { data, error } = await supabase
            .from("admin_users")
            .insert({
                name: "Nia.one",
                email: "admin@nia.one",
                password_hash: passwordHash,
                role: "admin"
            })
            .select();

        if (error) {
            throw error;
        }

        console.log("✅ Admin created successfully");
        console.log(data);

    } catch (err) {
        console.error(err);
    }

    process.exit();
}

createAdmin();