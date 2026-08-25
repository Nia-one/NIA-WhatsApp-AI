const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");

const { buildOrderAttribution } = require("../services/orderAttribution");
const { normalizeMobile } = require("../services/retailerService");
const {
    markInventoryMutation,
    isInventoryMutationRecent
} = require("../services/inventoryMutationGuard");

function loadWithMocks(modulePath, mocks) {
    const resolved = require.resolve(modulePath);
    delete require.cache[resolved];
    const originalLoad = Module._load;
    Module._load = function(request, parent, isMain) {
        if (Object.prototype.hasOwnProperty.call(mocks, request)) return mocks[request];
        return originalLoad.call(this, request, parent, isMain);
    };
    try {
        return require(resolved);
    } finally {
        Module._load = originalLoad;
    }
}

test("direct order keeps sender as beneficiary and actor", () => {
    assert.deepEqual(buildOrderAttribution("919876543210"), {
        isRetailerOrder: false,
        beneficiaryMobile: "919876543210",
        orderSource: "DIRECT_CUSTOMER",
        retailerId: null,
        placedByName: null,
        placedByMobile: "919876543210"
    });
});

test("retailer order separates actor from beneficiary", () => {
    assert.deepEqual(buildOrderAttribution("919111111111", {
        userType: "RETAILER",
        beneficiaryMobile: "9876543210",
        retailerId: "retailer-1",
        retailerName: "Retail Partner"
    }), {
        isRetailerOrder: true,
        beneficiaryMobile: "9876543210",
        orderSource: "RETAILER",
        retailerId: "retailer-1",
        placedByName: "Retail Partner",
        placedByMobile: "919111111111"
    });
});

test("retailer checkout is blocked without retailer identity", () => {
    assert.equal(buildOrderAttribution("919111111111", {
        userType: "RETAILER",
        beneficiaryMobile: "9876543210"
    }), null);
});

test("mobile normalization accepts country code and punctuation", () => {
    assert.equal(normalizeMobile("+91 98765-43210"), "9876543210");
});

test("recent order inventory mutations block stale inbound snapshots", () => {
    assert.equal(isInventoryMutationRecent("PRD-TEST"), false);
    markInventoryMutation("PRD-TEST", 1000);
    assert.equal(isInventoryMutationRecent("PRD-TEST"), true);
});

test("order attribution is written only to orders, not order_items", () => {
    const source = fs.readFileSync(path.join(__dirname, "..", "services", "orderService"), "utf8");
    const orderInsert = source.slice(source.indexOf('.from("orders")'), source.indexOf('.from("order_items")'));
    const itemInsert = source.slice(source.indexOf('.from("order_items")'), source.indexOf("if (itemError)"));
    assert.match(orderInsert, /order_source:/);
    assert.match(orderInsert, /placed_by_mobile:/);
    assert.doesNotMatch(itemInsert, /order_source:/);
    assert.doesNotMatch(itemInsert, /retailer_id:/);
});

test("checkout passes retailer context and keeps actor mobile", async () => {
    let received;
    const checkout = loadWithMocks("../src/flows/checkoutFlow", {
        "../../services/orderService": {
            createOrder: async (mobile, context) => {
                received = { mobile, context };
                return { success: true, orderId: "NIA-TEST", total: 100 };
            }
        },
        "../../services/conversationService": { updateConversation: async () => {} }
    });
    await checkout.checkoutFlow({
        mobile: "919111111111",
        userMessage: "confirm_order",
        state: {
            user_type: "RETAILER",
            beneficiary_mobile: "9876543210",
            retailer_id: "retailer-1",
            retailer_name: "Retail Partner"
        },
        sendWhatsAppMessage: async () => {},
        sendHomeMenu: async () => {},
        sendCheckoutButtons: async () => {},
        sendOrderSuccessButtons: async () => {},
        sendEmptyCartButtons: async () => {}
    });
    assert.equal(received.mobile, "919111111111");
    assert.equal(received.context.beneficiaryMobile, "9876543210");
    assert.equal(received.context.retailerId, "retailer-1");
});

test("retailer can select an existing old customer", async () => {
    const updates = [];
    const buttons = [];
    const guest = { id: "guest-1", guest_name: "Old Customer", mobile_number: "9876543210", studio_name: "Studio A" };
    const identity = loadWithMocks("../src/flows/identityFlow", {
        "../../services/customerService": {
            createGuest: async () => { throw new Error("should not create existing guest"); },
            findGuestByMobile: async () => guest,
            getOrCreateCustomer: async () => ({ id: "customer-1" }),
            updateGuestNameById: async () => guest
        },
        "../../services/retailerService": {
            findRetailerByMobile: async () => ({ id: "retailer-1", retailer_name: "Retail Partner", is_active: true }),
            normalizeMobile: value => String(value).replace(/\D/g, "").slice(-10)
        },
        "../../services/conversationService": {
            updateConversation: async (mobile, values) => updates.push({ mobile, values })
        }
    });

    await identity.handleIdentityFlow({
        mobile: "919111111111",
        userMessage: "9876543210",
        state: { current_state: "ASK_BENEFICIARY_MOBILE", user_type: "RETAILER", retailer_id: "retailer-1" },
        sendWhatsAppMessage: async () => {},
        sendWhatsAppButtons: async (...args) => buttons.push(args),
        sendHomeMenu: async () => {}
    });

    assert.equal(updates.at(-1).values.current_state, "CONFIRM_BENEFICIARY");
    assert.equal(updates.at(-1).values.beneficiary_customer_id, "customer-1");
    assert.match(buttons.at(-1)[1], /Old Customer/);
    assert.match(buttons.at(-1)[1], /Studio A/);
});

test("known retailer is verified before customer details are requested", async () => {
    const updates = [];
    const messages = [];
    const identity = loadWithMocks("../src/flows/identityFlow", {
        "../../services/customerService": {},
        "../../services/retailerService": {
            findRetailerByMobile: async () => ({ id: "retailer-1", retailer_name: "Retail Partner", is_active: true }),
            createRetailer: async () => { throw new Error("should not create known retailer"); },
            normalizeMobile: value => String(value).replace(/\D/g, "").slice(-10)
        },
        "../../services/conversationService": {
            updateConversation: async (mobile, values) => updates.push({ mobile, values })
        }
    });

    await identity.handleIdentityFlow({
        mobile: "919111111111",
        userMessage: "role_retailer",
        state: { current_state: "SELECT_USER_TYPE" },
        sendWhatsAppMessage: async (mobile, message) => messages.push(message),
        sendWhatsAppButtons: async () => {},
        sendHomeMenu: async () => {}
    });

    assert.equal(updates.at(-1).values.current_state, "ASK_BENEFICIARY_MOBILE");
    assert.equal(updates.at(-1).values.retailer_name, "Retail Partner");
    assert.match(messages.at(-1), /Retailer verified.*Retail Partner/);
    assert.match(messages.at(-1), /customer's 10-digit mobile/);
});

test("unknown retailer captures only retailer name and mobile before customer", async () => {
    const updates = [];
    const messages = [];
    let createdRetailer;
    const identity = loadWithMocks("../src/flows/identityFlow", {
        "../../services/customerService": {},
        "../../services/retailerService": {
            findRetailerByMobile: async () => null,
            createRetailer: async values => {
                createdRetailer = values;
                return { id: "retailer-new", retailer_name: values.name, is_active: true };
            },
            normalizeMobile: value => String(value).replace(/\D/g, "").slice(-10)
        },
        "../../services/conversationService": {
            updateConversation: async (mobile, values) => updates.push({ mobile, values })
        }
    });
    const base = {
        mobile: "919222222222",
        sendWhatsAppMessage: async (mobile, message) => messages.push(message),
        sendWhatsAppButtons: async () => {},
        sendHomeMenu: async () => {}
    };

    await identity.handleIdentityFlow({ ...base, userMessage: "role_retailer", state: { current_state: "SELECT_USER_TYPE" } });
    assert.equal(updates.at(-1).values.current_state, "ASK_RETAILER_NAME");

    await identity.handleIdentityFlow({ ...base, userMessage: "New Retailer", state: { current_state: "ASK_RETAILER_NAME" } });
    assert.equal(updates.at(-1).values.current_state, "ASK_RETAILER_MOBILE");

    await identity.handleIdentityFlow({
        ...base,
        userMessage: "9222222222",
        state: { current_state: "ASK_RETAILER_MOBILE", retailer_name: "New Retailer" }
    });
    assert.deepEqual(createdRetailer, { name: "New Retailer", mobile: "9222222222" });
    assert.equal(updates.at(-1).values.current_state, "ASK_BENEFICIARY_MOBILE");
    assert.equal(updates.at(-1).values.retailer_id, "retailer-new");
    assert.match(messages.at(-1), /customer's 10-digit mobile/);
});
