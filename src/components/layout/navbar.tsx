"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Container } from "./container";
import { MobileNav } from "./mobile-nav";
import { isActiveLink, PUBLIC_NAV_LINKS } from "./nav-links";
import { UserMenu } from "./user-menu";

export function Navbar() {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user ?? null;

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {PUBLIC_NAV_LINKS.map((link) => {
            const active = isActiveLink(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
                {active ? <span className="absolute inset-x-3 -bottom-[17px] h-0.5 rounded-full bg-primary" /> : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 md:flex">
            {isPending ? (
              <div className="size-9 animate-pulse rounded-full bg-muted" aria-hidden />
            ) : user ? (
              <UserMenu user={user} />
            ) : (
              <>
                <Link href="/sign-in" className={cn(buttonVariants({ variant: "outline" }), "h-10 px-4")}>
                  Sign In
                </Link>
                <Link href="/sign-up" className={cn(buttonVariants(), "h-10 px-4")}>
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <MobileNav user={user} isPending={isPending} />
        </div>
      </Container>
    </header>
  );
}
