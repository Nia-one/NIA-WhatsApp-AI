const {
    createGuest,
    findGuestByMobile,
    getOrCreateCustomer,
    updateGuestNameById
} = require("../../services/customerService");
const { findRetailerByMobile, normalizeMobile } = require("../../services/retailerService");
const { updateConversation } = require("../../services/conversationService");

const IDENTITY_STATES = new Set([
    "SELECT_USER_TYPE",
    "ASK_STUDIO_CUSTOMER_NAME",
    "ASK_BENEFICIARY_MOBILE",
    "ASK_BENEFICIARY_NAME",
    "CONFIRM_BENEFICIARY"
]);

async function sendRoleMenu(mobile, sendWhatsAppButtons) {
    await sendWhatsAppButtons(mobile, "Welcome to *Nia Essentials*. How are you ordering today?", [
        { id: "role_studio_customer", title: "Studio Customer" },
        { id: "role_retailer", title: "Retailer" }
    ]);
}

async function startIdentityFlow(mobile, sendWhatsAppButtons) {
    await updateConversation(mobile, {
        current_state: "SELECT_USER_TYPE",
        user_type: null,
        beneficiary_mobile: null,
        beneficiary_name: null,
        beneficiary_guest_id: null,
        beneficiary_customer_id: null,
        retailer_id: null,
        retailer_name: null,
        current_product_index: 0,
        last_product_id: null
    });
    await sendRoleMenu(mobile, sendWhatsAppButtons);
}

async function saveBeneficiary(mobile, guest, customer, extra = {}) {
    await updateConversation(mobile, {
        beneficiary_mobile: guest.mobile_number,
        beneficiary_name: guest.guest_name,
        beneficiary_guest_id: guest.id,
        beneficiary_customer_id: customer?.id || null,
        ...extra
    });
}

async function confirmBeneficiary(mobile, guest, sendWhatsAppButtons) {
    const studio = guest.studio_name || "Pending studio mapping";
    await sendWhatsAppButtons(
        mobile,
        `Please confirm customer details:\n\n*Name:* ${guest.guest_name}\n*Mobile:* ${guest.mobile_number}\n*Studio:* ${studio}`,
        [
            { id: "confirm_beneficiary", title: "Confirm" },
            { id: "change_beneficiary", title: "Change" }
        ]
    );
}

async function handleIdentityFlow({ mobile, userMessage, state, sendWhatsAppMessage, sendWhatsAppButtons, sendHomeMenu }) {
    const input = String(userMessage || "").trim();

    if (state.current_state === "SELECT_USER_TYPE") {
        if (input === "role_studio_customer") {
            const guest = await findGuestByMobile(mobile);
            if (!guest || !String(guest.guest_name || "").trim()) {
                await updateConversation(mobile, { current_state: "ASK_STUDIO_CUSTOMER_NAME", user_type: "DIRECT_CUSTOMER" });
                await sendWhatsAppMessage(mobile, "Please enter your full name.");
                return true;
            }
            const customer = await getOrCreateCustomer(guest);
            await saveBeneficiary(mobile, guest, customer, { current_state: "HOME", user_type: "DIRECT_CUSTOMER" });
            await sendHomeMenu(mobile);
            return true;
        }

        if (input === "role_retailer") {
            const retailer = await findRetailerByMobile(mobile);
            if (!retailer || !retailer.is_active) {
                await sendWhatsAppMessage(mobile, "This mobile number is not registered as an active retailer. Please contact the NIA team.");
                await sendRoleMenu(mobile, sendWhatsAppButtons);
                return true;
            }
            await updateConversation(mobile, {
                current_state: "ASK_BENEFICIARY_MOBILE",
                user_type: "RETAILER",
                retailer_id: retailer.id,
                retailer_name: retailer.retailer_name,
                beneficiary_mobile: null,
                beneficiary_name: null,
                beneficiary_guest_id: null,
                beneficiary_customer_id: null
            });
            await sendWhatsAppMessage(mobile, "Please enter the customer's 10-digit mobile number.");
            return true;
        }

        await sendRoleMenu(mobile, sendWhatsAppButtons);
        return true;
    }

    if (state.current_state === "ASK_STUDIO_CUSTOMER_NAME") {
        if (input.length < 2) {
            await sendWhatsAppMessage(mobile, "Please enter a valid full name.");
            return true;
        }
        let guest = await findGuestByMobile(mobile);
        guest = guest ? await updateGuestNameById(guest.id, input) : await createGuest(normalizeMobile(mobile), input);
        const customer = await getOrCreateCustomer(guest);
        await saveBeneficiary(mobile, guest, customer, { current_state: "HOME", user_type: "DIRECT_CUSTOMER" });
        await sendHomeMenu(mobile);
        return true;
    }

    if (state.current_state === "ASK_BENEFICIARY_MOBILE") {
        const beneficiaryMobile = normalizeMobile(input);
        if (beneficiaryMobile.length !== 10) {
            await sendWhatsAppMessage(mobile, "Please enter a valid 10-digit customer mobile number.");
            return true;
        }
        const guest = await findGuestByMobile(beneficiaryMobile);
        if (!guest) {
            await updateConversation(mobile, { current_state: "ASK_BENEFICIARY_NAME", beneficiary_mobile: beneficiaryMobile });
            await sendWhatsAppMessage(mobile, "Customer not found. Please enter the customer's full name.");
            return true;
        }
        const customer = await getOrCreateCustomer(guest);
        await saveBeneficiary(mobile, guest, customer, { current_state: "CONFIRM_BENEFICIARY" });
        await confirmBeneficiary(mobile, guest, sendWhatsAppButtons);
        return true;
    }

    if (state.current_state === "ASK_BENEFICIARY_NAME") {
        if (input.length < 2) {
            await sendWhatsAppMessage(mobile, "Please enter a valid customer name.");
            return true;
        }
        const guest = await createGuest(state.beneficiary_mobile, input);
        const customer = await getOrCreateCustomer(guest);
        await saveBeneficiary(mobile, guest, customer, { current_state: "CONFIRM_BENEFICIARY" });
        await confirmBeneficiary(mobile, guest, sendWhatsAppButtons);
        return true;
    }

    if (state.current_state === "CONFIRM_BENEFICIARY") {
        if (input === "change_beneficiary") {
            await updateConversation(mobile, { current_state: "ASK_BENEFICIARY_MOBILE", beneficiary_mobile: null, beneficiary_name: null, beneficiary_guest_id: null, beneficiary_customer_id: null });
            await sendWhatsAppMessage(mobile, "Please enter the customer's 10-digit mobile number.");
            return true;
        }
        if (input === "confirm_beneficiary") {
            await updateConversation(mobile, { current_state: "HOME" });
            await sendHomeMenu(mobile);
            return true;
        }
        const guest = await findGuestByMobile(state.beneficiary_mobile);
        if (guest) await confirmBeneficiary(mobile, guest, sendWhatsAppButtons);
        return true;
    }

    return false;
}

module.exports = { IDENTITY_STATES, startIdentityFlow, handleIdentityFlow };
