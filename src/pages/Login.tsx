import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext"; // 🔥 IMPORTANT

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth(); // 🔥 GET LOGIN FUNCTION

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // 🔥 UPDATED SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!form.email || !form.password) {
    alert("Email and password are required");
    return;
  }

  try {
    // ✅ PASS USERNAME HERE
    await login(form.email, form.password, form.username);

    // ✅ CALL EMAIL API
    await fetch("http://127.0.0.1:8001/email/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: form.email,
        username: form.username || form.email.split("@")[0],
      }),
    });

    console.log("Login + Email success");

const params = new URLSearchParams(window.location.search);
const redirectUrl = params.get("redirect");

if (redirectUrl) {
  window.location.href = redirectUrl;
} else {
  navigate("/neon");
}
  } catch (err: any) {
    alert(err.message || "Login failed");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative">

      {/* LOGO */}
      <div className="absolute top-6 left-6 text-xl font-semibold">
        CtrlS
      </div>

      {/* CARD */}
      <Card className="w-[90%] max-w-[380px] finops-card-hover">

        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Log In
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
            autoComplete="off"
          >

            {/* USERNAME (optional for UI only) */}
            <div className="space-y-2">
              <Label>Username</Label>
              <Input
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Enter your username"
                autoComplete="username"
              />
            </div>

            {/* EMAIL */}
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="new-password"
              />

              <Link
                to="/forgot-password"
                className="text-right block text-sm text-primary mt-1"
              >
                Forgot Password?
              </Link>
            </div>

            {/* BUTTON */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

          </form>

          {/* FOOTER */}
          <p className="text-center text-sm text-muted-foreground mt-5">
            New to CtrlS?
            <Link to="/signup" className="text-primary ml-1">
              Create Account →
            </Link>
          </p>

        </CardContent>
      </Card>
    </div>
  );
}