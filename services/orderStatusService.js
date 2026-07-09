const ORDER_WORKFLOW = {
  pending: ["confirmed", "cancelled"],

  confirmed: ["packed"],

  packed: ["shipped"],

  shipped: ["delivered"],

  delivered: [],

  cancelled: [],
};

function canChangeStatus(currentStatus, newStatus) {
  currentStatus = (currentStatus || "").toLowerCase();
  newStatus = (newStatus || "").toLowerCase();

  const allowed = ORDER_WORKFLOW[currentStatus] || [];

  return allowed.includes(newStatus);
}

function getNextStatuses(currentStatus) {
  currentStatus = (currentStatus || "").toLowerCase();

  return ORDER_WORKFLOW[currentStatus] || [];
}
x
module.exports = {
  canChangeStatus,
  getNextStatuses,
};