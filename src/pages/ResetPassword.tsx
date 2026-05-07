import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!form.password || !form.confirmPassword) {
      alert("Fill all fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log("New Password Set:", form.password);

    // 🔥 TEMP → go back to login
    navigate("/login");

    // later → API call
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative">

      {/* LOGO */}
      <div className="absolute top-6 left-6 text-xl font-bold">
        CtrlS
      </div>

      {/* CARD */}
      <div className="w-[90%] max-w-md p-8 finops-card">

        <h2 className="text-2xl font-semibold text-center mb-6">
          Set New Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* NEW PASSWORD */}
          <div>
            <label className="text-sm font-medium">
              New Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter new password"
              value={form.password}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-2 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="text-sm font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-2 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full py-2.5 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}