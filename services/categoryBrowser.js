const CATEGORY_PAGE_SIZE = 7;

const CATEGORY_ICONS = [
    [/atta|flour/i, "🌾"], [/bakery|bread/i, "🥖"],
    [/bath soap|soap/i, "🧼"], [/biscuit|cookie/i, "🍪"],
    [/chip/i, "🍟"], [/cigarette/i, "🚬"], [/dal|rice/i, "🍚"],
    [/detergent|laundry/i, "🧺"], [/edible oil|cooking oil/i, "🫗"],
    [/gutka|tobacco/i, "📦"], [/hair/i, "💇"], [/appliance/i, "🔌"],
    [/home care/i, "🏠"], [/namkeen|snack/i, "🥨"],
    [/noodle|pasta/i, "🍜"], [/oral|tooth/i, "🪥"], [/water/i, "💧"],
    [/salt/i, "🧂"], [/soft drink|beverage/i, "🥤"],
    [/spice|masala/i, "🌶️"], [/sugar/i, "🍬"], [/tea|coffee/i, "☕"]
];

function getCategoryIcon(category) {
    const match = CATEGORY_ICONS.find(([pattern]) => pattern.test(category));
    return match ? match[1] : "🛍️";
}

function buildCategoryPage(categories, requestedPage = 1) {
    const totalPages = Math.max(1, Math.ceil(categories.length / CATEGORY_PAGE_SIZE));
    const page = Math.min(totalPages, Math.max(1, Number.parseInt(requestedPage, 10) || 1));
    const start = (page - 1) * CATEGORY_PAGE_SIZE;
    const rows = [{
        id: "SEARCH_PRODUCTS",
        title: "🔍 Search Products",
        description: "Search by name, brand or keyword"
    }];

    rows.push(...categories.slice(start, start + CATEGORY_PAGE_SIZE).map(category => ({
        id: `CATEGORY_${encodeURIComponent(category)}`,
        title: `${getCategoryIcon(category)} ${category}`,
        description: `View available ${category} products`
    })));

    if (page > 1) rows.push({
        id: `CATEGORY_PAGE_${page - 1}`,
        title: "⬅️ Previous Categories",
        description: `Go to category page ${page - 1}`
    });
    if (page < totalPages) rows.push({
        id: `CATEGORY_PAGE_${page + 1}`,
        title: "➡️ More Categories",
        description: `Go to category page ${page + 1} of ${totalPages}`
    });

    return { page, totalPages, rows };
}

module.exports = { CATEGORY_PAGE_SIZE, getCategoryIcon, buildCategoryPage };
