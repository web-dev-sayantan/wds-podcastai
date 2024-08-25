import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

const Header = ({
  title,
  className,
}: {
  title?: string;
  className?: string;
}) => {
  return (
    <header className={cn("flex items-center justify-between")}>
      {title ? (
        <h1 className={cn("text-18 font-bold text-white-1", className)}>
          {title}
        </h1>
      ) : (
        <div />
      )}
      <Link href="/discover" className="text-16 font-semibold text-orange-1">
        See All
      </Link>
    </header>
  );
};

export default Header;
