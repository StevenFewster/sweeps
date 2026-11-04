"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "@/app/assets/sf-logo.png";
import { NavItem } from "@/lib/types";
import SocialLinks from "./SocialLinks";

const HOME_NAV_ITEM: NavItem = { path: "/", text: "All Sweepstakes" };

function HeaderLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.path}
      aria-current={active ? "page" : undefined}
      className={`relative mx-3 my-1 inline-block whitespace-nowrap text-gray-500 before:absolute before:-inset-1 before:block before:-skew-x-1 before:-skew-y-2 hover:text-white before:hover:bg-wedgewood-400 ${
        active ? "before:border before:border-dotted before:border-wedgewood-400" : ""
      }`}
    >
      <span className="relative">{item.text}</span>
    </Link>
  );
}

export default function SiteHeader({
  competition,
  navItems = [],
}: {
  competition?: string;
  navItems?: NavItem[];
}) {
  const pathname = usePathname();
  // Competition pages get a way back to the list of sweepstakes.
  const items = navItems.length ? [HOME_NAV_ITEM, ...navItems] : navItems;

  return (
    <header className="container mx-auto flex flex-col flex-wrap items-center px-4 py-3 text-gray-600 md:flex-row md:p-5">
      <a
        href="https://stevenfewster.com"
        className="mb-3 flex items-center text-gray-900 md:mb-0"
      >
        <Image src={logo} className="rounded-full" height={32} width={32} alt="" />
        <span className="ml-3 flex flex-col">
          <span className="text-xl font-medium leading-tight">Steven Fewster</span>
          {competition && <span className="sf-eyebrow">{competition}</span>}
        </span>
      </a>
      <nav className="flex flex-grow flex-wrap justify-center">
        {items.map((item) => (
          <HeaderLink key={item.path} item={item} active={pathname === item.path} />
        ))}
      </nav>
      <div className="hidden justify-end md:flex md:min-w-[182px]">
        <SocialLinks />
      </div>
    </header>
  );
}
