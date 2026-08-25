const recentMutations = new Map();

const DEFAULT_GUARD_MS = 60 * 1000;

function markInventoryMutation(productCode, guardMs = DEFAULT_GUARD_MS) {
    if (!productCode) return;
    recentMutations.set(String(productCode), Date.now() + guardMs);
}

function isInventoryMutationRecent(productCode) {
    if (!productCode) return false;

    const key = String(productCode);
    const expiresAt = recentMutations.get(key);

    if (!expiresAt) return false;
    if (expiresAt <= Date.now()) {
        recentMutations.delete(key);
        return false;
    }

    return true;
}

module.exports = {
    markInventoryMutation,
    isInventoryMutationRecent
};
