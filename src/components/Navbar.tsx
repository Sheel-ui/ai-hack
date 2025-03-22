import * as React from "react";
import Link from "next/link";
import { Candy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function Navbar() {
  return (
    <div className="sticky top-0 z-50 border-b border-primary/5 px-6 py-4 backdrop-blur-lg bg-white/10 shadow-md">
      <div className="mx-auto flex items-center justify-between md:max-w-6xl">
        <div className="flex items-center space-x-2 scale-50">
          <Candy className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">TrendBite</span>
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-8 text-sm font-medium">
          <Link href="/" className="transition hover:text-primary">
            Home
          </Link>
          <Link href="/analytics" className="transition hover:text-primary">
            Analytics
          </Link>
        </div>

        <Button variant="outline" size="sm">
          <LogOut />
          Logout
        </Button>
      </div>
    </div>
  );
}
