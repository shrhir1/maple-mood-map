import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import StoryBookBackground from "@/components/StoryBookBackground";
import Maple from "@/components/Maple";

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        navigate("/mood");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/mood");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = () => {
    navigate("/mood");
  };

  return (
    <StoryBookBackground>
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-[380px]">
          {/* Maple */}
          <div className="flex justify-center mb-4">
            <div className="anim-maple-float" style={{ width: 100, height: 100 }}>
              <Maple expression="waving" className="w-full h-full drop-shadow-lg" />
            </div>
          </div>

          {/* Card */}
          <div
            className="bg-white rounded-3xl p-8"
            style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}
          >
            <h2 className="text-2xl font-black text-center mb-1" style={{ color: "#3D2B1F" }}>
              {mode === "login" ? "Welcome back!" : "Create an account"}
            </h2>
            <p className="text-sm font-semibold text-center mb-6" style={{ color: "#8B6F5E" }}>
              {mode === "login"
                ? "Sign in to track your mood journey"
                : "Start your wellness journey with Maple"}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl text-sm border outline-none transition-all focus:ring-2 focus:ring-primary/30"
                style={{ background: "#FFF8F4", borderColor: "#F0E0D0", color: "#3D2B1F" }}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl text-sm border outline-none transition-all focus:ring-2 focus:ring-primary/30"
                style={{ background: "#FFF8F4", borderColor: "#F0E0D0", color: "#3D2B1F" }}
              />

              {error && (
                <p className="text-xs font-semibold text-center" style={{ color: "#E05C5C" }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-base shadow-lg hover:opacity-90 hover:scale-[1.01] transition-all duration-200 disabled:opacity-50"
              >
                {loading ? "..." : mode === "login" ? "Sign In" : "Sign Up"}
              </button>
            </form>

            {/* Toggle mode */}
            <p className="text-xs font-semibold text-center mt-4" style={{ color: "#8B6F5E" }}>
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); }}
                className="underline font-bold text-primary hover:opacity-80 transition-opacity"
              >
                {mode === "login" ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>

          {/* Guest */}
          <button
            onClick={handleGuest}
            className="w-full mt-4 py-3.5 rounded-xl font-bold text-base transition-all duration-200 hover:scale-[1.01]"
            style={{
              background: "rgba(255,248,240,0.92)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
              color: "#8B6F5E",
            }}
          >
            Continue as Guest 🍄
          </button>
        </div>
      </div>
    </StoryBookBackground>
  );
};

export default Auth;
