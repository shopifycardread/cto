"use client";

import React from "react";
import { Header, BottomNav, Card, Button } from "@/components";
import { isAuthenticated } from "@/lib/api";
import { useRouter } from "next/navigation";
import type { ShopRecommendation } from "@/lib/types";

const RECOMMENDATIONS: ShopRecommendation[] = [
  {
    id: "1",
    title: "Cream Cashmere Sweater",
    reason: "Your sweaters are mostly grey — a cream option would expand your neutral palette.",
    price: "$128",
    brand: "Everlane",
    category: "Tops",
  },
  {
    id: "2",
    title: "Brown Leather Belt",
    reason: "Matches your brown loafers and would tie your work outfits together.",
    price: "$65",
    brand: "Madewell",
    category: "Accessories",
  },
  {
    id: "3",
    title: "Navy Chino Shorts",
    reason: "You have great summer tops but no shorts to pair them with.",
    price: "$78",
    brand: "J.Crew",
    category: "Bottoms",
  },
];

export default function ShopPage() {
  const router = useRouter();

  React.useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
    }
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col pb-20">
      <Header title="Clad Picks" />

      <div className="flex-1 p-4 space-y-4">
        {/* Gap analysis summary */}
        <Card className="bg-accent/5 border-accent/20" padded>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 className="text-body font-semibold text-neutral-900">
                Wardrobe Gaps Found
              </h3>
              <p className="text-body-sm text-neutral-600 mt-1">
                We noticed a few gaps in your wardrobe. Adding these items would
                unlock <strong>8 new outfit combinations</strong>.
              </p>
            </div>
          </div>
        </Card>

        {/* Recommendations */}
        <div className="space-y-3">
          <h2 className="text-heading-md font-display font-bold text-neutral-900">
            Fill the gaps
          </h2>

          {RECOMMENDATIONS.map((rec) => (
            <Card key={rec.id}>
              <div className="flex gap-4">
                {/* Thumbnail placeholder */}
                <div className="w-20 h-20 rounded-lg bg-neutral-100 flex-shrink-0 flex items-center justify-center">
                  <svg className="w-8 h-8 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-body font-semibold text-neutral-900">
                        {rec.title}
                      </h3>
                      <p className="text-caption text-neutral-500">
                        {rec.brand} · {rec.category}
                      </p>
                    </div>
                    <span className="text-body-sm font-semibold text-neutral-900 flex-shrink-0">
                      {rec.price}
                    </span>
                  </div>

                  <p className="text-body-sm text-neutral-600 mt-1.5">
                    {rec.reason}
                  </p>

                  <Button variant="outline" size="sm" className="mt-2">
                    View details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}