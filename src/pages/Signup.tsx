import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
type Role = "viewer" | "admin" | "manager" | "analyst";


export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();

  const [formData, setFormData] = useState<{
  name: string;
  role:Role;
  email: string;
  password: string;
  confirmPassword: string;
}>({
  name: "",
  role: "viewer",
  email: "",
  password: "",
  confirmPassword: "",
});

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // INPUT CHANGE
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: name === "role" ? (value as Role) : value,
  }));
};
  // VALIDATION
  const validateForm = () => {
    if (!formData.name.trim()) return "Name is required";
    if (!formData.email.includes("@")) return "Valid email is required";
    if (formData.password.length < 6)
      return "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      return "Passwords do not match";
    return "";
  };
const handleSubmit = async (e: any) => {
  e.preventDefault();

  const validationError = validateForm();
  if (validationError) {
    setError(validationError);
    return;
  }

  setError("");
  setIsSubmitting(true);

  try {
    // ✅ Step 1: create user
    await signup(
      formData.email,
      formData.password,
      formData.name,
      formData.role
    );

    // 🔥 Step 2: call backend email API
    await fetch("http://127.0.0.1:8001/email/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        username: formData.name, // ✅ FIXED (no email splitting)
      }),
    });

    // ✅ Step 3: go to verification page
    navigate("/verify-email");

  } catch (err: any) {
    setError(err.message || "Signup failed");
  } finally {
    setIsSubmitting(false);
  }
};
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative">

      {/* LOGO */}
      <div className="absolute top-6 left-6 text-xl font-semibold">
        CtrlS
      </div>

      {/* CARD */}
      <div className="w-[90%] max-w-[400px] bg-card border border-border rounded-xl p-8 shadow-lg">

        <h2 className="text-center text-2xl font-semibold mb-6">
          Create Account
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* NAME */}
          <div>
            <label className="text-sm">Full Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full mt-1 p-2 rounded-md bg-muted border border-border"
            />
          </div>

          {/* ROLE */}
          <div>
            <label className="text-sm">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full mt-1 p-2 rounded-md bg-muted border border-border"
            >
              <option value="viewer">Viewer</option>
              <option value="analyst">Analyst</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full mt-1 p-2 rounded-md bg-muted border border-border"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm">Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full mt-1 p-2 rounded-md bg-muted border border-border"
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="text-sm">Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className="w-full mt-1 p-2 rounded-md bg-muted border border-border"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-full py-2.5 rounded-md bg-primary text-white font-medium hover:opacity-90 transition"
          >
            {isSubmitting ? "Creating..." : "Create Account"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-sm text-muted-foreground mt-5">
          Already have an account?
          <Link to="/login" className="text-primary ml-1">
            Sign In →
          </Link>
        </p>
      </div>
    </div>
  );

}
