const supabase = require("../config/supabase");


// ======================================
// Export All Guests
// Handles Supabase 1000 row limit
// ======================================

const exportGuests = async () => {


    let allGuests = [];

    let from = 0;

    const batchSize = 1000;



    while (true) {


        const {
            data,
            error
        } = await supabase

            .from("guest_master")

            .select("*")

            .order("guest_code", {
                ascending: true
            })

            .range(
                from,
                from + batchSize - 1
            );



        if (error) {

            throw error;

        }



        if (!data || data.length === 0) {

            break;

        }



        allGuests = [
            ...allGuests,
            ...data
        ];



        console.log(
            `Export fetched ${allGuests.length} guests`
        );



        // Last batch completed

        if (data.length < batchSize) {

            break;

        }



        from += batchSize;


    }



    console.log(
        "TOTAL EXPORT GUESTS:",
        allGuests.length
    );



    return allGuests;


};



module.exports = {

    exportGuests

};