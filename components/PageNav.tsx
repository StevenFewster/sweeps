"use client";
import { NavItem } from "@/lib/types";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PageNav({
  children,
  navItems,
}: {
  children: React.ReactNode;
  navItems: NavItem[];
}) {
  const pathname = usePathname();
  return (
    <div className="navbar bg-base-100 md:rounded-box shadow-md mb-6">
      <div className="flex-none">
        <Link href="/" className="btn btn-ghost">
          {" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </Link>
      </div>
      <div className="flex-1">
        <h1 className="text-2xl font-bold pl-4">{children}</h1>
      </div>
      <div className="flex-none hidden md:block">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`ml-4 link mr-4 ${pathname === item.path ? "font-bold link-primary" : "link-hover"}`}
          >
            {item.text}
          </Link>
        ))}
      </div>
      <div className="dropdown dropdown-end md:hidden">
        <div tabIndex={0} role="button" className="btn m-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-5 w-5 stroke-current"
          >
            {" "}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>{" "}
          </svg>
        </div>
        <ul
          tabIndex={-1}
          className="dropdown-content menu bg-base-100 rounded-box z-[999] w-52 p-2 shadow-sm"
        >
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`ml-4 link mr-4 ${pathname === item.path ? "font-bold link-primary" : "link-hover"}`}
              >
                {item.text}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
