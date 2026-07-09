const supabase = require("../config/supabase");

const getStudios = async () => {

    const { data, error } = await supabase
        .from("studio_master")
        .select("*")
        .order("theatre_name", { ascending: true })
        .order("studio_name", { ascending: true });

    if (error) {
        throw error;
    }

    return data;

};

module.exports = {
    getStudios,
};