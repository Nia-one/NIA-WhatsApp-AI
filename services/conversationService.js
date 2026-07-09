const supabase = require("../config/supabase");

// ======================================
// Get Conversation State
// ======================================

async function getConversationState(mobile) {

    const { data, error } = await supabase
        .from("conversation_state")
        .select("*")
        .eq("customer_mobile", mobile)
        .single();

    console.log("Conversation Fetch:");
    console.log(data);
    console.log(error);

    return data;
}

// ======================================
// Save Conversation State
// ======================================

async function saveConversationState(mobile, state) {

    const { data, error } = await supabase
        .from("conversation_state")
        .upsert({
            customer_mobile: mobile,
            current_state: state
        })
        .select();

    console.log("Conversation Save:");
    console.log(data);
    console.log(error);
}

// ======================================
// Update Conversation
// ======================================

async function updateConversation(mobile, values) {

    console.log("########## VERSION 9 JULY ##########");

    console.log("================================");
    console.log("Updating Conversation State");
    console.log("Mobile:", mobile);
    console.log("Values:", values);
    console.log("================================");

    const existing = await getConversationState(mobile);

    if (!existing) {

        const { data, error } = await supabase
            .from("conversation_state")
            .insert({
                customer_mobile: mobile,
                ...values
            })
            .select();

        console.log("Inserted Conversation:");
        console.log(data);
        console.log(error);

        return data;
    }

    const { data, error } = await supabase
        .from("conversation_state")
        .update(values)
        .eq("customer_mobile", mobile)
        .select();

    console.log("========== UPDATE RESULT ==========");
    console.log("Updated Row:");
    console.log(data);
    console.log("Error:");
    console.log(error);
    console.log("===================================");

    if (error) {
        console.error("Conversation Update Error:");
        console.error(error);
        return null;
    }

    const latest = await getConversationState(mobile);

    console.log("========== AFTER UPDATE ==========");
    console.log(latest);
    console.log("=================================");

    return data;
}

// ======================================
// Reset Conversation
// ======================================

async function resetConversation(mobile) {

    const { data, error } = await supabase
        .from("conversation_state")
        .update({
            current_state: "HOME",
            current_page: 1,
            current_product_index: 0,
            last_product_id: null
        })
        .eq("customer_mobile", mobile)
        .select();

    console.log("Conversation Reset:");
    console.log(data);
    console.log(error);

    return data;
}

module.exports = {
    getConversationState,
    saveConversationState,
    updateConversation,
    resetConversation
};