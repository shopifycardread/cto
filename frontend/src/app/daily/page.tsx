"use client";

import React, { useState, useEffect } from "react";
import { Header, BottomNav, OutfitCard } from "@/components";
import { outfitsApi, isAuthenticated } from "@/lib/api";
import { useRouter } from "next/navigation";
import type { OutfitDisplay } from "@/lib/types";

const FALLBACK_OUTFITS: OutfitDisplay[] = [
  {
    id: "1",
    title: "Monday Meeting Ready",
    items: ["Navy Blazer", "White Oxford", "Beige Chinos", "Brown Loafers"],
    occasion: "Work",
  },
  {
    id: "2",
    title: "Weekend Casual",
    items: ["Crew Neck Sweater", "Dark Denim", "White Sneakers"],
    occasion: "Casual",
  },
  {
    id: "3",
    title: "Date Night",
    items: ["Leather Jacket", "Black Turtleneck", "Slim Fit Trousers", "Chelsea Boots"],
    occasion: "Evening",
  },
];

export default function DailyPage() {
  const router = useRouter();
  const [savedOutfits, setSavedOutfits] = useState<Set<string>>(new Set());
  const [outfits, setOutfits] = useState<OutfitDisplay[]>(FALLBACK_OUTFITS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    async function fetchOutfits() {
      try {
        const data = await outfitsApi.getDaily();
        if (data.outfits && Array.isArray(data.outfits) && data.outfits.length > 0) {
          // Map API response to display format
          setOutfits(
            data.outfits.map((o: unknown) => {
              const item = o as Record<string, unknown>;
              return {
                id: String(item.id || Math.random()),
                title: String(item.title || "Daily Outfit"),
                items: (item.items as string[]) || [],
                occasion: item.occasion as string | undefined,
              };
            })
          );
        }
      } catch {
        // API is a stub, use fallback
        console.log("Using fallback outfits (API not yet implemented)");
      } finally {
        setLoading(false);
      }
    }
    fetchOutfits();
  }, [router]);

  const toggleSave = async (id: string) => {
    setSavedOutfits((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

    try {
      if (!savedOutfits.has(id)) {
        await outfitsApi.save(id);
      } else {
        await outfitsApi.skip(id);
      }
    } catch {
      // API stub, just update UI
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col pb-20">
        <Header title="Today's Outfits" />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse-soft text-neutral-400">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-body-sm">Finding your outfits...</p>
          </div>
        </div>
        <BottomNav />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col pb-20">
      <Header title="Today's Outfits" />

      <div className="flex-1 p-4 space-y-4">
        <div className="text-center py-2">
          <p className="text-caption text-neutral-500 uppercase tracking-wider font-medium">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="space-y-5">
          {outfits.map((outfit) => (
            <OutfitCard
              key={outfit.id}
              title={outfit.title}
              items={outfit.items}
              occasion={outfit.occasion}
              saved={savedOutfits.has(outfit.id)}
              onSave={() => toggleSave(outfit.id)}
              onSkip={() => toggleSave(outfit.id)}
            />
          ))}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}