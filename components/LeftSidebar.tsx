"use client";

import Image from "next/image";
import Link from "next/link";
import { sidebarLinks } from "@/constants";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/providers/audioProvider";

const LeftSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { audio } = useAudio();
  return (
    <section
      className={cn("left_sidebar h-[calc(100vh-5px)]", {
        "h-[calc(100vh-140px)]": audio?.audioUrl,
      })}
    >
      <nav className="flex flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-1 pb-10 max-lg:justify-center cursor-pointer"
        >
          <Image src="/icons/logo.svg" alt="logo" width={23} height={27} />
          <h1 className="text-24 font-extrabold text-white-1 max-lg:hidden">
            Podcastai
          </h1>
        </Link>
        {sidebarLinks.map(({ route, imgURL, label }) => {
          const isActive =
            pathname === route || pathname.startsWith(`${route}/`);
          return (
            <Link
              href={route}
              key={label}
              className={cn(
                "flex gap-3 items-center py-4 max-lg:px-4 justify-center lg:justify-start",
                {
                  "bg-nav-focus border-r-4 border-orange-1": isActive,
                }
              )}
            >
              <Image src={imgURL} alt={label} width={24} height={24} />
              <p className="">{label}</p>
            </Link>
          );
        })}
      </nav>
      <SignedOut>
        <div className="flex-center w-full-pb-14 max-lg:px-4 lg:pr-8">
          <Button
            asChild
            className="text-16 w-full font-extrabold bg-orange-1 text-white-1"
          >
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </SignedOut>
      <SignedIn>
        <div className="flex-center w-full-pb-14 max-lg:px-4 lg:pr-8">
          <Button
            className="text-16 w-full font-extrabold bg-orange-1 text-white-1"
            onClick={() => signOut(() => router.push("/"))}
          >
            Sign Out
          </Button>
        </div>
      </SignedIn>
    </section>
  );
};

export default LeftSidebar;
