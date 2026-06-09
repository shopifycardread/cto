"use client";

import React, { useState } from "react";
import { Header, Button, Card } from "@/components";

const PLANS = [
  {
    id: "monthly",
    name: "Monthly",
    price: "$12",
    period: "/month",
    description: "Full access, cancel anytime",
    popular: false,
  },
  {
    id: "yearly",
    name: "Yearly",
    price: "$8",
    period: "/month",
    description: "Billed annually at $96 — save 33%",
    popular: true,
  },
];

const FEATURES = [
  "Daily AI-curated outfits",
  "Wardrobe catalog with filters",
  "Style profile & learning",
  "Gap analysis & recommendations",
  "Unlimited outfit saves",
  "Priority support",
];

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState("yearly");

  return (
    <main className="min-h-screen flex flex-col">
      <Header title="Upgrade" showBack />

      <div className="flex-1 p-4 space-y-6">
        {/* Header */}
        <div className="text-center py-4">
          <h2 className="text-heading-xl font-display font-bold text-neutral-900">
            Never run out of outfits
          </h2>
          <p className="text-body text-neutral-500 mt-2 max-w-xs mx-auto">
            Unlock daily recommendations, wardrobe analytics, and smart shopping.
          </p>
        </div>

        {/* Plan toggle */}
        <div className="flex bg-neutral-100 rounded-xl p-1 max-w-xs mx-auto">
          {PLANS.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`
                flex-1 py-2.5 rounded-lg text-body-sm font-medium transition-all
                ${
                  selectedPlan === plan.id
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-700"
                }
              `}
            >
              {plan.name}
              {plan.popular && (
                <span className="block text-caption text-accent font-semibold">
                  Best value
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Price card */}
        <Card
          className={`text-center ${
            selectedPlan === "yearly"
              ? "ring-2 ring-accent"
              : ""
          }`}
        >
          {selectedPlan === "yearly" && (
            <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-caption font-semibold rounded-full mb-3">
              Save 33%
            </span>
          )}
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-display-lg font-bold text-neutral-900">
              {PLANS.find((p) => p.id === selectedPlan)?.price}
            </span>
            <span className="text-body text-neutral-500">
              {PLANS.find((p) => p.id === selectedPlan)?.period}
            </span>
          </div>
          <p className="text-body-sm text-neutral-500 mt-1">
            {PLANS.find((p) => p.id === selectedPlan)?.description}
          </p>
        </Card>

        {/* Features */}
        <div className="space-y-3">
          <h3 className="text-body font-semibold text-neutral-900">
            Everything included
          </h3>
          {FEATURES.map((feature) => (
            <div key={feature} className="flex items-center gap-3">
              <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-body-sm text-neutral-700">{feature}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Button variant="primary" size="lg" fullWidth>
          Start {selectedPlan === "yearly" ? "Yearly" : "Monthly"} Plan
        </Button>

        <p className="text-caption text-neutral-400 text-center">
          Cancel anytime. No questions asked.
        </p>
      </div>
    </main>
  );
}