const supabase = require("../config/supabase");

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
async function updateConversation(mobile, values) {

    const { data, error } = await supabase
        .from("conversation_state")
        .update(values)
        .eq("customer_mobile", mobile);

    return { data, error };

}

async function resetConversation(mobile) {

    await supabase
        .from("conversation_state")
        .update({
            current_state: "HOME",
            current_page: 1,
            current_product_index: 0,
            last_product_id: null
        })
        .eq("customer_mobile", mobile);

}

module.exports = {
    getConversationState,
    saveConversationState,
    updateConversation,
    resetConversation
};