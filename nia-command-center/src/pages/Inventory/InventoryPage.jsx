import { useState, useEffect } from "react";

import { useInventory } from "../../hooks/useInventory";
import InventoryStatCard from "../../components/inventory/InventoryStatCard";
import InventoryTable from "../../components/inventory/InventoryTable";
import InventoryDetailsDrawer from "../../components/inventory/InventoryDetails/InventoryDetailsDrawer";
import InventorySearch from "../../components/inventory/InventorySearch";
import InventoryStatusFilter from "../../components/inventory/InventoryStatusFilter";

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const clearFilters = () => {
    setSearch("");
    setStatus("");
  };

  const {
    summary,
    inventory,
    isLoading,
    error,
  } = useInventory();

  // Keep selected product in sync after inventory refresh
  useEffect(() => {
    if (!selectedProduct || !inventory?.data) return;

    const latestProduct = inventory.data.find(
      (item) => item.id === selectedProduct.id
    );

    if (latestProduct) {
      setSelectedProduct(latestProduct);
    }
  }, [inventory, selectedProduct]);

  const filteredProducts = (inventory?.data || []).filter((product) => {
    const searchText = search.trim().toLowerCase();

    const matchesSearch =
      (product.product_name || "")
        .toLowerCase()
        .includes(searchText) ||
      (product.product_code || "")
        .toLowerCase()
        .includes(searchText);

    const matchesStatus =
      status === "" ||
      (product.inventory_status || "").toLowerCase() ===
        status.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="p-10 text-xl font-semibold">
        Loading Inventory...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-red-600">
        Failed to load inventory.
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="text-3xl font-bold">
          Inventory
        </h2>

        <p className="mt-2 text-slate-500">
          Manage products and stock.
        </p>
      </div>

      {/* KPI Cards */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <InventoryStatCard
          title="Total Products"
          value={summary?.totalProducts ?? 0}
        />

        <InventoryStatCard
          title="In Stock"
          value={summary?.inStock ?? 0}
          color="text-green-600"
        />

        <InventoryStatCard
          title="Low Stock"
          value={summary?.lowStock ?? 0}
          color="text-yellow-500"
        />

        <InventoryStatCard
          title="Out Of Stock"
          value={summary?.outOfStock ?? 0}
          color="text-red-600"
        />

      </div>

      {/* Search Toolbar */}

      <div className="mb-6 flex flex-wrap items-center gap-4">

        <InventorySearch
          value={search}
          onChange={setSearch}
        />

        <InventoryStatusFilter
          value={status}
          onChange={setStatus}
        />

        <button
          onClick={clearFilters}
          className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium transition hover:bg-slate-100"
        >
          Clear Filters
        </button>

      </div>

      {/* Inventory Table */}

      <InventoryTable
        products={filteredProducts}
        onView={(product) => {
          setSelectedProduct(product);
          setDrawerOpen(true);
        }}
      />

      <InventoryDetailsDrawer
        open={drawerOpen}
        product={selectedProduct}
        onClose={() => setDrawerOpen(false)}
      />

    </div>
  );
}