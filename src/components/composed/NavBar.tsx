"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "../ui/button";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <nav className="w-full bg-primary p-4 text-secondary">
      <div className="mx-auto flex max-w-full items-center justify-between px-4">
        <div>
          <Link href="/">
            <h1 className="text-lg font-semibold md:text-2xl">Lens Transfer</h1>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {/* Hamburger Menu */}
          <button
            className="block md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6 text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
          {/* Menu Items */}
          <div
            className={` ${
              isOpen
                ? "absolute right-1 top-10 block w-40 rounded-xl bg-primary"
                : "hidden"
            } w-full  md:flex md:items-center md:gap-4`}
          >
            <Link href="/lens-tools/profile-manager">
              <Button
                variant="ghost"
                className="block w-full md:inline md:w-auto"
              >
                Profile Manager
              </Button>
            </Link>
            <Link href="/lens-tools/transfer-profiles">
              <Button
                variant="ghost"
                className="block w-full md:inline md:w-auto"
              >
                Transfer Profiles
              </Button>
            </Link>
            <Link href="/lens-tools/follow-settings">
              <Button
                variant="ghost"
                className="block w-full md:inline md:w-auto"
              >
                Follow Settings
              </Button>
            </Link>
            <Link href="/about">
              <Button
                variant="ghost"
                className="block w-full md:inline md:w-auto"
              >
                About
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
