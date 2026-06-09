"use client";

import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  padded?: boolean;
}

export function Card({
  children,
  className = "",
  onClick,
  hoverable = false,
  padded = true,
}: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-xl border border-neutral-200 shadow-card
        ${padded ? "p-4" : ""}
        ${hoverable ? "cursor-pointer hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200" : ""}
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e: React.KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}

/* ─── Outfit Card (for daily recommendations) ──────────────── */

interface OutfitCardProps {
  imageUrl?: string;
  title: string;
  items: string[];
  occasion?: string;
  onSave?: () => void;
  onSkip?: () => void;
  saved?: boolean;
  className?: string;
}

export function OutfitCard({
  imageUrl,
  title,
  items,
  occasion,
  onSave,
  onSkip,
  saved = false,
  className = "",
}: OutfitCardProps) {
  return (
    <Card className={`overflow-hidden ${className}`} padded={false}>
      {/* Image area */}
      <div className="aspect-[4/5] bg-neutral-100 relative overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400">
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
          </div>
        )}
        {/* Occasion tag */}
        {occasion && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-caption font-medium text-neutral-700">
            {occasion}
          </span>
        )}
      </div>

      {/* Content area */}
      <div className="p-4">
        <h3 className="heading-md font-semibold text-neutral-900 mb-2">
          {title}
        </h3>
        <ul className="space-y-1 mb-4">
          {items.map((item, i) => (
            <li key={i} className="text-body-sm text-neutral-600 flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-neutral-300 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onSave}
            className={`
              flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-body-sm font-medium transition-all
              ${
                saved
                  ? "bg-accent/10 text-accent"
                  : "bg-neutral-900 text-white hover:bg-neutral-800"
              }
            `}
            aria-label={saved ? "Saved" : "Save outfit"}
          >
            <svg className="w-4 h-4" fill={saved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {saved ? "Saved" : "Save"}
          </button>
          <button
            onClick={onSkip}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-body-sm font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 transition-colors"
            aria-label="Skip outfit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Skip
          </button>
        </div>
      </div>
    </Card>
  );
}

/* ─── Item Card (for wardrobe catalog) ────────────────────── */

interface ItemCardProps {
  imageUrl?: string;
  name: string;
  category?: string;
  color?: string;
  brand?: string;
  onClick?: () => void;
  className?: string;
}

export function ItemCard({
  imageUrl,
  name,
  category,
  color,
  brand,
  onClick,
  className = "",
}: ItemCardProps) {
  return (
    <Card
      className={`overflow-hidden ${className}`}
      padded={false}
      hoverable
      onClick={onClick}
    >
      {/* Image area */}
      <div className="aspect-square bg-neutral-100 relative overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-300">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <p className="text-body-sm font-medium text-neutral-900 truncate">
          {name}
        </p>
        {category && (
          <p className="text-caption text-neutral-500 mt-0.5">{category}</p>
        )}
        {(color || brand) && (
          <div className="flex items-center gap-2 mt-1.5">
            {color && (
              <span className="flex items-center gap-1 text-caption text-neutral-500">
                <span
                  className="w-2.5 h-2.5 rounded-full border border-neutral-200"
                  style={{ backgroundColor: color }}
                />
                {color}
              </span>
            )}
            {brand && (
              <span className="text-caption text-neutral-500">{brand}</span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}