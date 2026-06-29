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
module.exports = {
    getConversationState,
    saveConversationState
};