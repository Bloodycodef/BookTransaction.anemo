import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null; // 🔐 belum login → navbar disembunyikan

  return (
    <div className="bg-gray-800 text-white px-6 py-3 flex justify-between">
      <div className="space-x-4">
        <Link to="/products">Products</Link>
        <Link to="/orders">Orders</Link>
        <Link to="/summary">Summary</Link>
      </div>

      <div>
        {user.email}
        <button onClick={logout} className="ml-4 text-red-400">
          Logout
        </button>
      </div>
    </div>
  );
}
