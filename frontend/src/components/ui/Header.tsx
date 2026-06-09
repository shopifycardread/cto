"use client";

import React from "react";
import Link from "next/link";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  transparent?: boolean;
  className?: string;
}

export function Header({
  title,
  showBack = false,
  onBack,
  rightAction,
  transparent = false,
  className = "",
}: HeaderProps) {
  return (
    <header
      className={`
        sticky top-0 z-40
        ${transparent
          ? "bg-transparent"
          : "bg-white/90 backdrop-blur-md border-b border-neutral-100"
        }
        safe-top
        ${className}
      `}
    >
      <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
        {/* Left section */}
        <div className="flex items-center gap-2 min-w-[40px]">
          {showBack ? (
            <button
              onClick={onBack}
              className="flex items-center justify-center w-10 h-10 -ml-2 rounded-lg hover:bg-neutral-100 transition-colors"
              aria-label="Go back"
            >
              <svg className="w-5 h-5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          ) : (
            <Link href="/" className="flex items-center gap-2" aria-label="Clad home">
              {/* App logo mark */}
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-display font-bold text-sm">C</span>
              </div>
            </Link>
          )}
        </div>

        {/* Title */}
        {title && (
          <h1 className="text-body font-semibold text-neutral-900 text-center flex-1">
            {title}
          </h1>
        )}

        {/* Spacer when there's a title but no back button */}
        {title && !showBack && <div className="w-10" />}

        {/* Right section */}
        <div className="flex items-center gap-1 min-w-[40px] justify-end">
          {rightAction}
        </div>
      </div>

      {/* Title-only header (onboarding style) */}
      {title && !showBack && !rightAction && (
        <div className="w-10" /> /* balance the layout */
      )}
    </header>
  );
}

/* ─── Brand Logo Header (for splash / onboarding) ─────────── */

export function BrandHeader({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mb-3 shadow-elevated">
        <span className="text-white font-display font-bold text-3xl">C</span>
      </div>
      <h1 className="text-display font-display font-bold text-neutral-900 tracking-tight">
        Clad
      </h1>
      <p className="text-body text-neutral-500 mt-1">
        Your AI personal stylist
      </p>
    </div>
  );
}