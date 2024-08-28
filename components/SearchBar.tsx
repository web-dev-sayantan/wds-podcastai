"use client";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/lib/useDebounce";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const debouncedValue = useDebounce(search, 500);
  useEffect(() => {
    if (debouncedValue) {
      router.push(`/discover?search=${debouncedValue}`);
    } else if (!debouncedValue && pathname === "/discover") {
      router.push("/discover");
    }
  }, [debouncedValue, router, pathname]);
  return (
    <div className="relative block mt-9">
      <Input
        type="search"
        placeholder="Search Podcasts"
        className="input-class py-6 pl-12 focus-visible:ring-offset-orange-1"
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        onLoad={() => setSearch("")}
      ></Input>
      <Image
        src="/icons/search.svg"
        alt="search"
        height={20}
        width={20}
        className="absolute left-4 top-3.5"
      />
    </div>
  );
};

export default SearchBar;
