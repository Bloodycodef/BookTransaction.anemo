import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";

export default function Orders() {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  /* ================= FETCH ================= */
  const fetchOrders = async () => {
    const res = await api.get("/orders");
    setOrders(res.data);
  };

  const fetchProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchOrders();
    if (user?.role === "outlet") fetchProducts();
  }, [user]);

  /* ================= CREATE ORDER ================= */
  const addItem = () => {
    setItems([...items, { product_id: "", quantity: 1 }]);
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const submitOrder = async () => {
    if (items.length === 0) {
      alert("Add at least one product");
      return;
    }

    try {
      await api.post("/orders", { items });
      setItems([]);
      fetchOrders();
      alert("Order created successfully");
    } catch {
      alert("Failed to create order");
    }
  };

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (orderId, status) => {
    setLoadingId(orderId);
    try {
      await api.put(`/orders/${orderId}`, { status });
      fetchOrders();
    } catch {
      alert("Failed to update order");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Orders</h1>
        <span className="text-sm text-gray-500">
          Role: <b className="capitalize">{user?.role}</b>
        </span>
      </div>

      {/* ================= OUTLET CREATE ORDER ================= */}
      {user?.role === "outlet" && (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 text-white">
            <h2 className="text-lg font-semibold">Create New Order</h2>
            <p className="text-sm opacity-90">Add products & submit order</p>
          </div>

          <div className="p-4 space-y-4">
            {items.map((item, i) => (
              <div key={i} className="grid grid-cols-3 gap-3">
                <select
                  className="col-span-2 border rounded px-3 py-2"
                  value={item.product_id}
                  onChange={(e) => updateItem(i, "product_id", e.target.value)}
                >
                  <option value="">Select product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Stock: {p.stock})
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min="1"
                  className="border rounded px-3 py-2"
                  value={item.quantity}
                  onChange={(e) => updateItem(i, "quantity", e.target.value)}
                />
              </div>
            ))}

            <div className="flex gap-3">
              <button
                onClick={addItem}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                + Add Item
              </button>

              <button
                onClick={submitOrder}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Submit Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ORDER LIST ================= */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((o) => (
          <div
            key={o.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">Order #{o.id}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    o.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : o.status === "paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {o.status}
                </span>
              </div>

              <p className="text-sm text-gray-500 mt-1">
                Outlet ID: {o.outlet_id}
              </p>

              <p className="mt-3">
                Total: <b>{o.total_price}</b>
              </p>
            </div>

            {/* HO ACTION */}
            {user?.role === "ho" && o.status === "pending" && (
              <button
                onClick={() => updateStatus(o.id, "paid")}
                disabled={loadingId === o.id}
                className="mt-4 bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {loadingId === o.id ? "Updating..." : "Mark as Paid"}
              </button>
            )}
          </div>
        ))}

        {orders.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-10">
            No orders found
          </div>
        )}
      </div>
    </div>
  );
}
