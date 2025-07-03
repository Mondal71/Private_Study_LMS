import { useNavigate } from "react-router-dom";

export default function RoleSelector({ action }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center space-y-6">
      <h2 className="text-2xl font-bold text-indigo-700">
        {action === "login" ? "Login As" : "Signup As"}
      </h2>
      <div className="flex gap-6">
        <button
          className="btn-primary w-32"
          onClick={() => navigate(`/user/${action}`)}
        >
          User
        </button>
        <button
          className="btn-primary w-32"
          onClick={() => navigate(`/admin/${action}`)}
        >
          Admin
        </button>
      </div>
    </div>
  );
}
