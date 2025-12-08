"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import AdvokitLogo from "@/public/images/advokit-logo.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <nav className="flex h-16 items-center justify-between">
          {/* Brand (logo + wordmark) */}
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold tracking-tight"
            aria-label="Advokit home"
          >
            <Image
              src={AdvokitLogo} // /public/icon.png
              alt="Advokit logo"
              width={50}
              height={50}
              priority
              sizes="28px"
              className="rounded" // remove if you want sharp corners
            />
            <span className="leading-none text-2xl">Advokit</span>
          </Link>
          {/* Desktop */}
          <ul className="hidden items-center gap-6 md:flex text-lg">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/benefits-list">List of benefits</Link>
            </li>
            <li>
              <Link href="/benefits-table">Benefits table</Link>
            </li>
            <li>
              <Link href="/stories">Stories</Link>
            </li>
          </ul>

          {/* Mobile hamburger button */}
          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center rounded-md p-2
                       ring-1 ring-gray-300 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
          >
            {/* icon */}
            <svg
              className={`h-5 w-5 ${open ? "hidden" : "block"}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg
              className={`h-5 w-5 ${open ? "block" : "hidden"}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </nav>

        {/* Mobile panel */}
        {open && (
          <ul className="md:hidden border-t bg-white -mx-4 px-4 sm:-mx-6 sm:px-6 py-3">
            <li>
              <Link href="/" onClick={() => setOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" onClick={() => setOpen(false)}>
                About
              </Link>
            </li>
            <li>
              <Link href="/benefits-list" onClick={() => setOpen(false)}>
                List of benefits
              </Link>
            </li>
            <li>
              <Link href="/benefits-table" onClick={() => setOpen(false)}>
                Benefits table
              </Link>
            </li>
            <li>
              <Link href="/stories" onClick={() => setOpen(false)}>
                Stories
              </Link>
            </li>
          </ul>
        )}
      </div>
    </header>
  );
}
