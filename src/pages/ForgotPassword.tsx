import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email");
      return;
    }

    console.log("Reset link sent to:", email);

    // 🔥 TEMP NAVIGATION (for UI testing)
    navigate("/verify-email");

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

        {/* TITLE */}
        <h2 className="text-2xl font-semibold text-center mb-6">
          Forgot Password
        </h2>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full mt-2 px-4 py-2
                rounded-lg
                bg-input
                border border-border
                focus:ring-2 focus:ring-primary
                outline-none
              "
              required
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="
              w-full py-2.5
              bg-primary
              text-white
              rounded-lg
              font-medium
              hover:opacity-90
              transition
            "
          >
            Send Code
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-sm mt-5 text-muted-foreground">
          Remember your password?
          <span
            onClick={() => navigate("/login")}
            className="text-primary ml-1 cursor-pointer"
          >
            Sign In →
          </span>
        </p>
      </div>
    </div>
  );
}