const test = require("node:test");
const assert = require("node:assert/strict");
const { CATEGORY_PAGE_SIZE, getCategoryIcon, buildCategoryPage } = require("../services/categoryBrowser");

const categories = Array.from({ length: 22 }, (_, index) => `Category ${index + 1}`);

test("all categories are paginated within the WhatsApp 10-row limit", () => {
    const pages = [1, 2, 3, 4].map(page => buildCategoryPage(categories, page));
    const categoryIds = pages.flatMap(page => page.rows)
        .filter(row => row.id.startsWith("CATEGORY_") && !row.id.startsWith("CATEGORY_PAGE_"))
        .map(row => decodeURIComponent(row.id.slice("CATEGORY_".length)));

    assert.equal(CATEGORY_PAGE_SIZE, 7);
    assert.deepEqual(categoryIds, categories);
    assert.ok(pages.every(page => page.rows.length <= 10));
    assert.equal(pages[0].rows.at(-1).id, "CATEGORY_PAGE_2");
    assert.equal(pages[1].rows.at(-2).id, "CATEGORY_PAGE_1");
    assert.equal(pages[1].rows.at(-1).id, "CATEGORY_PAGE_3");
});

test("category icons have meaningful mappings and a fallback", () => {
    assert.equal(getCategoryIcon("Biscuits"), "🍪");
    assert.equal(getCategoryIcon("Spices"), "🌶️");
    assert.equal(getCategoryIcon("New Category"), "🛍️");
});
