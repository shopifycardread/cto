"use client";

import React, { useState, useEffect } from "react";
import { Header, BottomNav, Button, Card } from "@/components";
import { profileApi, isAuthenticated, getUser } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats] = useState({ items: 12, outfits: 24, days: 7 });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    async function fetchProfile() {
      try {
        const data = await profileApi.get();
        if (data.profile) {
          setProfile(data.profile as Record<string, unknown>);
        }
      } catch {
        console.log("Profile API not yet implemented, using defaults");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const displayName = user?.full_name || user?.email?.split("@")[0] || "Fashionista";

  return (
    <main className="min-h-screen flex flex-col pb-20">
      <Header title="Style Profile" />

      <div className="flex-1 p-4 space-y-6">
        {/* Profile avatar */}
        <div className="flex flex-col items-center py-4">
          <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mb-3 ring-2 ring-accent/20">
            <span className="text-heading-xl font-display font-bold text-accent">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
          <h2 className="text-heading-md font-semibold text-neutral-900">
            {displayName}
          </h2>
          <p className="text-body-sm text-neutral-500">
            {user?.email || "clad@fashion.com"}
          </p>
        </div>

        {/* Style tags */}
        <Card>
          <h3 className="text-body font-semibold text-neutral-900 mb-3">
            Style Preferences
          </h3>
          <div className="flex flex-wrap gap-2">
            {["Smart Casual", "Minimal", "Classic", "Neutral Colors"].map(
              (tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-accent/5 text-accent text-caption font-medium rounded-full border border-accent/20"
                >
                  {tag}
                </span>
              )
            )}
          </div>
          <Button variant="ghost" size="sm" className="mt-3">
            Edit preferences
          </Button>
        </Card>

        {/* Quick stats */}
        <Card>
          <h3 className="text-body font-semibold text-neutral-900 mb-3">
            Wardrobe Stats
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: "Items", value: String(stats.items) },
              { label: "Outfits Saved", value: String(stats.outfits) },
              { label: "Days Active", value: String(stats.days) },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-heading-lg font-bold text-neutral-900">
                  {stat.value}
                </p>
                <p className="text-caption text-neutral-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Settings links */}
        <div className="space-y-1">
          <Link
            href="/subscription"
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-neutral-50 transition-colors text-body text-neutral-700"
          >
            Subscription
            <svg
              className="w-4 h-4 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>

          <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-neutral-50 transition-colors text-body text-neutral-700">
            Notification Settings
            <svg
              className="w-4 h-4 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-neutral-50 transition-colors text-body text-neutral-700">
            Privacy & Data
            <svg
              className="w-4 h-4 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Logout */}
        <Button variant="ghost" size="md" fullWidth onClick={handleLogout}>
          Sign Out
        </Button>
      </div>

      <BottomNav />
    </main>
  );
}