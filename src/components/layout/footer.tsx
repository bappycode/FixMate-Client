import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { FacebookIcon, LinkedinIcon, XIcon } from "@/components/shared/brand-icons";
import { categoryHref, CATEGORIES } from "@/lib/categories";
import { SITE } from "@/lib/site";
import { Container } from "./container";
import { PUBLIC_NAV_LINKS } from "./nav-links";

const SOCIAL_LINKS = [
  { label: "FixMate on X", href: SITE.social.x, icon: XIcon },
  { label: "FixMate on Facebook", href: SITE.social.facebook, icon: FacebookIcon },
  { label: "FixMate on LinkedIn", href: SITE.social.linkedin, icon: LinkedinIcon },
];

const columnTitle = "mb-4 text-sm font-semibold tracking-wider text-white uppercase";
const footerLink = "text-white/70 transition-colors hover:text-white";

export function Footer() {
  return (
    <footer className="bg-ink text-white/70">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <div className="flex flex-col gap-5">
          {/* The logo inherits the footer's text color; here it is set to white. */}
          <div className="text-white">
            <Logo />
          </div>
          <p className="max-w-xs text-sm leading-relaxed">{SITE.tagline}</p>
          <ul className="flex gap-3">
            {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-white/40 hover:text-white"
                >
                  <Icon className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Quick links">
          <h2 className={columnTitle}>Quick links</h2>
          <ul className="flex flex-col gap-2.5 text-sm">
            {PUBLIC_NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={footerLink}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Popular categories">
          <h2 className={columnTitle}>Popular categories</h2>
          <ul className="flex flex-col gap-2.5 text-sm">
            {CATEGORIES.slice(0, 5).map(({ name }) => (
              <li key={name}>
                <Link href={categoryHref(name)} className={footerLink}>
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className={columnTitle}>Contact</h2>
          <ul className="flex flex-col gap-3 text-sm">
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <a href={`mailto:${SITE.email}`} className={footerLink}>
                {SITE.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <a href={`tel:${SITE.phone.replace(/[^\d+]/g, "")}`} className={footerLink}>
                {SITE.phone}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <span>{SITE.address}</span>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="py-5 text-center text-sm">
          &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.
        </Container>
      </div>
    </footer>
  );
}
