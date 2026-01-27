import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";

export default function Products() {
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/products", { name, price, stock });
      setName("");
      setPrice("");
      setStock("");
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Failed create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <span className="text-sm text-gray-500">
          Role: <b className="capitalize">{user?.role}</b>
        </span>
      </div>

      <div
        className={`grid gap-6 ${
          user?.role === "ho" ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1"
        }`}
      >
        {/* ================= FORM HO ================= */}
        {user?.role === "ho" && (
          <div className="lg:col-span-1">
            <div className="rounded-xl shadow bg-white overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
                <h2 className="text-lg font-semibold">Create Product</h2>
                <p className="text-sm opacity-90">
                  Only Head Office can add products
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Product Name</label>
                  <input
                    className="w-full mt-1 border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Price</label>
                  <input
                    type="number"
                    className="w-full mt-1 border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Stock</label>
                  <input
                    type="number"
                    className="w-full mt-1 border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    required
                  />
                </div>

                <button
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Product"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ================= PRODUCT LIST ================= */}
        <div className={user?.role === "ho" ? "lg:col-span-2" : ""}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-semibold text-lg">{p.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Price: <b>{p.price}</b>
                  </p>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      p.stock <= 5
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    Stock: {p.stock}
                  </span>

                  <span className="text-xs text-gray-400">#{p.id}</span>
                </div>
              </div>
            ))}

            {products.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-10">
                No products available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* INFO OUTLET */}
      {user?.role !== "ho" && (
        <p className="text-sm text-gray-500 italic">
          You are an outlet — product list is read only
        </p>
      )}
    </div>
  );
}
