"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showProfile?: boolean;
  backHref?: string;
  className?: string;
  rightContent?: React.ReactNode;
}

export default function Header({
  title,
  showBack = false,
  showProfile = true,
  backHref,
  className,
  rightContent,
}: HeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  return (
    <header
      className={cn(
        "flex items-center justify-between px-4 py-3 bg-white border-b border-[#e8e2d9] sticky top-0 z-10",
        className
      )}
    >
      {/* Left — back button */}
      <div className="w-10">
        {showBack && (
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#f8f5f0] transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={20} className="text-[#28312f]" />
          </button>
        )}
      </div>

      {/* Centre — logo + app name or page title */}
      <div className="flex flex-col items-center">
        {title ? (
          /* Page-level title — Lato semibold */
          <div className="flex items-center gap-2">
            <Image
              src="/wm-logo.png"
              alt="Watermark"
              width={20}
              height={20}
              className="rounded-sm opacity-70"
            />
            <h1
              className="text-sm font-bold text-[#28312f] tracking-wide"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {title}
            </h1>
          </div>
        ) : (
          /* App wordmark — W logo + Oswald uppercase */
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <Image
              src="/wm-logo.png"
              alt="Watermark"
              width={28}
              height={28}
              className="rounded-md"
            />
            <span
              className="text-sm font-bold text-[#28312f] tracking-[0.14em] uppercase"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              The{" "}
              <span className="text-[#ee7625]">10</span>
              {" "}Markers
            </span>
          </Link>
        )}
      </div>

      {/* Right — profile or custom content */}
      <div className="w-10 flex justify-end">
        {rightContent ??
          (showProfile && (
            <Link
              href="/profile"
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#f8f5f0] transition-colors"
              aria-label="Profile"
            >
              <User size={20} className="text-[#28312f]" />
            </Link>
          ))}
      </div>
    </header>
  );
}
