const { updateConversation } = require("../../services/conversationService");
const { getSearchProductsPage } = require("../../services/productBrowser");

async function productSearchFlow({
    mobile,
    state,
    userMessage,
    sendWhatsAppMessage,
    sendProductList,
    sendCategoryList
}) {
    const input = String(userMessage || "").trim();

    if (input === "SEARCH_PRODUCTS" || input === "BACK_TO_SEARCH") {
        await updateConversation(mobile, {
            current_state: "PRODUCT_SEARCH",
            current_page: 1,
            current_product_index: 0,
            last_product_id: null
        });
        await sendWhatsAppMessage(
            mobile,
            "🔍 Type a product name, brand or keyword.\n\nExample: *col* for Colgate"
        );
        return true;
    }

    if (input === "BACK_TO_CATEGORIES") {
        await updateConversation(mobile, {
            current_state: "PRODUCT_CATALOGUE",
            current_page: 1
        });
        await sendCategoryList(mobile);
        return true;
    }

    let query = input;
    let pageNumber = 1;
    const nextPageMatch = input.match(/^NEXT_SEARCH_PAGE_(\d+)_(.+)$/);

    if (nextPageMatch) {
        pageNumber = Number.parseInt(nextPageMatch[1], 10);
        query = decodeURIComponent(nextPageMatch[2]);
    } else if (state?.current_state !== "PRODUCT_SEARCH") {
        return false;
    }

    if (query.length < 2) {
        await sendWhatsAppMessage(
            mobile,
            "Please type at least 2 letters to search for a product."
        );
        return true;
    }

    const page = await getSearchProductsPage(query, pageNumber);

    if (!page.products.length) {
        await sendWhatsAppMessage(
            mobile,
            pageNumber > 1
                ? "You have reached the last page of these search results."
                : `No available product found for *${query}*. Please try another keyword.`
        );
        return true;
    }

    await updateConversation(mobile, {
        current_state: "PRODUCT_SEARCH",
        current_page: page.page,
        current_product_index: 0
    });
    await sendProductList(mobile, page);
    return true;
}

module.exports = { productSearchFlow };
