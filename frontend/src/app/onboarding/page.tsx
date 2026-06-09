"use client";

import React, { useState } from "react";
import { Button, Header, Input } from "@/components";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import type { OnboardingStep } from "@/lib/types";

export default function OnboardingPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [styleTags, setStyleTags] = useState<string[]>([]);
  const [colorPrefs, setColorPrefs] = useState<string[]>([]);
  const [occasionPrefs, setOccasionPrefs] = useState<string[]>([]);

  const handleRegister = async () => {
    setError("");
    setLoading(true);
    try {
      await register(email, password, fullName || undefined);
      router.push("/daily");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (
    tag: string,
    list: string[],
    setter: (t: string[]) => void
  ) => {
    if (list.includes(tag)) {
      setter(list.filter((t) => t !== tag));
    } else {
      setter([...list, tag]);
    }
  };

  const tagButton = (tag: string, list: string[]) => (
    <button
      key={tag}
      onClick={() => toggleTag(tag, list, list === styleTags ? setStyleTags : list === colorPrefs ? setColorPrefs : setOccasionPrefs)}
      data-selected={
        styleTags.includes(tag) ||
        colorPrefs.includes(tag) ||
        occasionPrefs.includes(tag)
      }
      className={`px-4 py-2 rounded-full border-2 text-body-sm transition-colors ${
        styleTags.includes(tag) ||
        colorPrefs.includes(tag) ||
        occasionPrefs.includes(tag)
          ? "border-accent bg-accent/5 text-accent"
          : "border-neutral-200 text-neutral-600 hover:border-accent hover:text-accent"
      }`}
    >
      {tag}
    </button>
  );

  const tagList = (
    tags: string[],
    list: string[],
    setter: (t: string[]) => void
  ) => (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => toggleTag(tag, list, setter)}
          data-selected={list.includes(tag)}
          className={`px-4 py-2 rounded-full border-2 text-body-sm transition-colors ${
            list.includes(tag)
              ? "border-accent bg-accent/5 text-accent"
              : "border-neutral-200 text-neutral-600 hover:border-accent hover:text-accent"
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );

  return (
    <main className="min-h-screen flex flex-col">
      <Header
        showBack={step !== "welcome"}
        onBack={() => {
          if (step === "style") setStep("photos");
          else if (step === "photos") setStep("welcome");
          else router.push("/");
        }}
      />

      <div className="flex-1 flex flex-col p-6">
        {step === "welcome" && (
          <div className="flex-1 flex flex-col animate-fade-in">
            <div className="flex-1 flex flex-col justify-center">
              <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center mb-6">
                <span className="text-white font-display font-bold text-2xl">
                  C
                </span>
              </div>
              <h1 className="text-heading-xl font-display font-bold text-neutral-900 mb-3">
                Let&rsquo;s build your wardrobe
              </h1>
              <p className="text-body text-neutral-500 leading-relaxed">
                We&rsquo;ll scan your clothes, learn your style, and start
                creating daily outfits — all in a few minutes.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  {
                    title: "Create your account",
                    desc: "Set up your Clad profile",
                  },
                  {
                    title: "Snap photos of your clothes",
                    desc: "Take photos of each item you own",
                  },
                  {
                    title: "Tell us your style",
                    desc: "Colors, fits, occasions you love",
                  },
                  {
                    title: "Get daily outfits",
                    desc: "AI-curated looks from your closet",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-accent/10 text-accent text-caption font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-body-sm font-medium text-neutral-900">
                        {item.title}
                      </p>
                      <p className="text-caption text-neutral-500">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => setStep("photos")}
              className="mt-6"
            >
              Get Started
            </Button>
          </div>
        )}

        {step === "photos" && (
          <div className="flex-1 flex flex-col animate-fade-in">
            <div className="flex-1 flex flex-col justify-center">
              <div className="w-24 h-24 rounded-2xl bg-neutral-100 flex items-center justify-center mb-6 mx-auto">
                <svg
                  className="w-12 h-12 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h2 className="text-heading-lg font-display font-bold text-neutral-900 mb-2 text-center">
                Create your account
              </h2>
              <p className="text-body text-neutral-500 text-center max-w-xs mx-auto mb-8">
                Enter your details to get started with Clad.
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-body-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <Input
                  label="Full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Morgan"
                />
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="mt-auto space-y-3">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => {
                  if (!email || !password) {
                    setError("Please enter your email and password.");
                    return;
                  }
                  setStep("style");
                }}
              >
                Continue
              </Button>
              <Button
                variant="ghost"
                size="md"
                fullWidth
                onClick={() => {
                  if (email && password) {
                    setStep("style");
                  } else {
                    handleRegister(); // will fail but shows user flow
                  }
                }}
              >
                Skip for now
              </Button>
            </div>
          </div>
        )}

        {step === "style" && (
          <div className="flex-1 flex flex-col animate-fade-in">
            <div className="flex-1 flex flex-col justify-center">
              <h2 className="text-heading-lg font-display font-bold text-neutral-900 mb-6">
                What&rsquo;s your style?
              </h2>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-body-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <p className="text-body-sm font-medium text-neutral-700 mb-2">
                    Style vibe
                  </p>
                  {tagList(
                    [
                      "Casual",
                      "Smart Casual",
                      "Business",
                      "Minimal",
                      "Bold",
                      "Classic",
                      "Trendy",
                      "Bohemian",
                    ],
                    styleTags,
                    setStyleTags
                  )}
                </div>

                <div>
                  <p className="text-body-sm font-medium text-neutral-700 mb-2">
                    Preferred colors
                  </p>
                  {tagList(
                    [
                      "Black",
                      "White",
                      "Navy",
                      "Gray",
                      "Beige",
                      "Green",
                      "Blue",
                      "Red",
                    ],
                    colorPrefs,
                    setColorPrefs
                  )}
                </div>

                <div>
                  <p className="text-body-sm font-medium text-neutral-700 mb-2">
                    Occasions
                  </p>
                  {tagList(
                    [
                      "Work",
                      "Date Night",
                      "Weekend",
                      "Formal",
                      "Workout",
                      "Travel",
                    ],
                    occasionPrefs,
                    setOccasionPrefs
                  )}
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleRegister}
              loading={loading}
              className="mt-6"
            >
              Create Account &amp; Show Me Outfits
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}