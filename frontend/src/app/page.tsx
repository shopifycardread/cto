"use client";

import React from "react";
import Link from "next/link";
import { BrandHeader, Button } from "@/components";
import { useAuth } from "@/lib/auth-context";

export default function HomePage() {
  const { isLoggedIn, user } = useAuth();

  return (
    <main className="min-h-screen flex flex-col items-center justify-between p-6 safe-bottom">
      {/* Top spacer */}
      <div className="flex-1" />

      {/* Brand + Hero */}
      <div className="flex flex-col items-center text-center animate-fade-in">
        <BrandHeader className="mb-2" />

        <p className="text-body text-neutral-500 mt-6 max-w-xs mx-auto leading-relaxed">
          Scan your wardrobe. Discover your style.
          <br />
          Never have &ldquo;nothing to wear&rdquo; again.
        </p>

        {/* Feature preview pills */}
        <div className="flex flex-wrap justify-center gap-2 mt-8">
          {["AI Outfits", "Wardrobe Scan", "Smart Shop"].map((feature) => (
            <span
              key={feature}
              className="px-3 py-1.5 bg-neutral-100 rounded-full text-caption font-medium text-neutral-600"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="w-full mt-12 space-y-3 animate-slide-up">
        {isLoggedIn ? (
          <>
            <p className="text-body-sm text-neutral-500 text-center">
              Welcome back{user?.full_name ? `, ${user.full_name}` : ""}!
            </p>
            <Link href="/daily" className="block w-full">
              <Button variant="primary" size="lg" fullWidth>
                Today&rsquo;s Outfits
              </Button>
            </Link>
            <Link href="/wardrobe" className="block w-full">
              <Button variant="outline" size="lg" fullWidth>
                My Wardrobe
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Link href="/onboarding" className="block w-full">
              <Button variant="primary" size="lg" fullWidth>
                Get Started
              </Button>
            </Link>
            <Link href="/login" className="block w-full">
              <Button variant="ghost" size="lg" fullWidth>
                I already have an account
              </Button>
            </Link>
          </>
        )}
      </div>
    </main>
  );
}