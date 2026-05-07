import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EmailVerification() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");

  const handleVerify = (e: any) => {
    e.preventDefault();
    console.log("Verification Code:", code);

    // later → API verification

    // TEMP FLOW → redirect to dashboard
    navigate("/reset-password");
  };

  const handleResend = () => {
    console.log("Resend verification email");

    // later → API resend
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
          Email Verification
        </h2>

        {/* FORM */}
        <form onSubmit={handleVerify} className="space-y-5">

          <div>
            <label className="text-sm font-medium">
              Verification Code
            </label>

            <input
              type="text"
              placeholder="Enter verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
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

          {/* VERIFY BUTTON */}
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
            Verify
          </button>
        </form>

        {/* RESEND */}
        <p className="text-center text-sm mt-5 text-muted-foreground">
          Didn’t receive the email?
          <span
            onClick={handleResend}
            className="text-primary ml-1 cursor-pointer"
          >
            Click to resend
          </span>
        </p>
      </div>
    </div>
  );
}