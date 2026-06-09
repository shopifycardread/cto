"use client";

import React, { useState, useEffect, useRef } from "react";
import { Header, BottomNav, ItemCard, SearchInput, Button } from "@/components";
import { wardrobeApi, isAuthenticated } from "@/lib/api";
import { useRouter } from "next/navigation";
import type { WardrobeItem } from "@/lib/types";

const FALLBACK_ITEMS: WardrobeItem[] = [
  { id: "1", user_id: "", photo_url: "", name: "Navy Blazer", category: "Outerwear", color: "#1e3a5f", style_tags: [], created_at: "" },
  { id: "2", user_id: "", photo_url: "", name: "White Oxford Shirt", category: "Tops", color: "#f5f5f0", style_tags: [], created_at: "" },
  { id: "3", user_id: "", photo_url: "", name: "Beige Chinos", category: "Bottoms", color: "#d4c5a9", style_tags: [], created_at: "" },
  { id: "4", user_id: "", photo_url: "", name: "Brown Loafers", category: "Footwear", color: "#6b4423", style_tags: [], created_at: "" },
  { id: "5", user_id: "", photo_url: "", name: "Crew Neck Sweater", category: "Tops", color: "#7a8b8e", style_tags: [], created_at: "" },
  { id: "6", user_id: "", photo_url: "", name: "Dark Denim", category: "Bottoms", color: "#1a2744", style_tags: [], created_at: "" },
  { id: "7", user_id: "", photo_url: "", name: "White Sneakers", category: "Footwear", color: "#f0f0f0", style_tags: [], created_at: "" },
  { id: "8", user_id: "", photo_url: "", name: "Leather Jacket", category: "Outerwear", color: "#2d2d2d", style_tags: [], created_at: "" },
  { id: "9", user_id: "", photo_url: "", name: "Black Turtleneck", category: "Tops", color: "#1a1a1a", style_tags: [], created_at: "" },
  { id: "10", user_id: "", photo_url: "", name: "Slim Fit Trousers", category: "Bottoms", color: "#3d3d3d", style_tags: [], created_at: "" },
];

const CATEGORIES = ["All", "Tops", "Bottoms", "Outerwear", "Footwear", "Accessories"];

export default function WardrobePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [items, setItems] = useState<WardrobeItem[]>(FALLBACK_ITEMS);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    async function fetchItems() {
      try {
        const data = await wardrobeApi.list();
        if (data.items && Array.isArray(data.items) && data.items.length > 0) {
          setItems(data.items as WardrobeItem[]);
        }
      } catch {
        console.log("Using fallback items (API not yet implemented)");
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, [router]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    try {
      await wardrobeApi.create(formData);
      // Refresh list after upload
      const data = await wardrobeApi.list();
      if (data.items && Array.isArray(data.items)) {
        setItems(data.items as WardrobeItem[]);
      }
    } catch {
      console.log("Upload API not yet implemented");
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      (item.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.category || "").toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen flex flex-col pb-20">
      <Header title="My Wardrobe" />

      <div className="px-4 pt-2 pb-3 space-y-3">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch("")}
          placeholder="Search your wardrobe..."
        />

        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`
                flex-shrink-0 px-4 py-1.5 rounded-full text-caption font-medium transition-colors
                ${
                  activeCategory === cat
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 px-4">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-pulse-soft text-neutral-400">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-body-sm">Loading wardrobe...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              {filteredItems.map((item) => (
                <ItemCard
                  key={item.id}
                  name={item.name || "Unknown Item"}
                  category={item.category}
                  color={item.color}
                />
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <svg className="w-12 h-12 text-neutral-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-body text-neutral-500">
                  No items found{search ? ` for "${search}"` : ""}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Image upload input (hidden) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Add item FAB */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className="fixed bottom-24 right-6 w-14 h-14 bg-accent text-white rounded-full shadow-elevated flex items-center justify-center hover:bg-accent-700 transition-colors z-40"
        aria-label="Add wardrobe item"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      <BottomNav />
    </main>
  );
}