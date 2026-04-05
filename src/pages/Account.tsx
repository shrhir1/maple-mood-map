import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import StoryBookBackground from "@/components/StoryBookBackground";
import { ArrowLeft, Mail, User, Calendar, Shield } from "lucide-react";

const Account: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
  }, []);

  const isGuest = !user;

  const infoRows = isGuest
    ? [{ icon: User, label: "Account Type", value: "Guest" }]
    : [
        { icon: Mail, label: "Email", value: user.email || "—" },
        { icon: User, label: "Account Type", value: "Registered" },
        {
          icon: Calendar,
          label: "Joined",
          value: new Date(user.created_at).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
        },
        {
          icon: Shield,
          label: "Email Confirmed",
          value: user.email_confirmed_at ? "Yes" : "No",
        },
      ];

  return (
    <StoryBookBackground>
      <div className="min-h-screen flex flex-col items-center px-4 py-6">
        <div className="w-full max-w-lg flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/mood")}
            className="rounded-full p-2 transition-all hover:scale-110 active:scale-95"
            style={{
              background: "rgba(255,248,240,0.92)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
            }}
          >
            <ArrowLeft size={20} style={{ color: "#3D2B1F" }} />
          </button>
          <h1
            className="text-xl font-extrabold tracking-tight"
            style={{ color: "#3D2B1F" }}
          >
            Account Details
          </h1>
        </div>

        {loading ? (
          <div className="text-muted-foreground font-semibold">Loading...</div>
        ) : (
          <div className="w-full max-w-lg space-y-4">
            {/* Avatar / icon */}
            <div
              className="rounded-2xl p-6 flex flex-col items-center"
              style={{
                background: "rgba(255,255,255,0.88)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
              }}
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-3"
                style={{ background: "hsl(var(--primary) / 0.15)" }}
              >
                <User size={36} className="text-primary" />
              </div>
              <p className="text-lg font-extrabold" style={{ color: "#3D2B1F" }}>
                {isGuest ? "Guest User" : user.email}
              </p>
            </div>

            {/* Info rows */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.88)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
              }}
            >
              {infoRows.map((row, i) => (
                <div
                  key={row.label}
                  className="flex items-center gap-4 px-5 py-4"
                  style={{
                    borderBottom:
                      i < infoRows.length - 1
                        ? "1px solid rgba(0,0,0,0.06)"
                        : undefined,
                  }}
                >
                  <row.icon size={18} className="text-muted-foreground flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                      {row.label}
                    </p>
                    <p className="text-sm font-semibold" style={{ color: "#3D2B1F" }}>
                      {row.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Guest prompt */}
            {isGuest && (
              <div
                className="rounded-2xl p-5 text-center"
                style={{ background: "#FFFBE6", border: "1px solid #F4E3A0" }}
              >
                <p className="text-sm font-semibold" style={{ color: "#5C4A1E" }}>
                  Create an account to save your mood data across devices.
                </p>
                <button
                  onClick={() => navigate("/auth")}
                  className="mt-3 px-6 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-all"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </StoryBookBackground>
  );
};

export default Account;
