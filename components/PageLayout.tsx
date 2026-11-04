import { NavItem } from "@/lib/types";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

export default function PageLayout({
  title,
  competition,
  navItems,
  children,
}: {
  title?: string;
  competition?: string;
  navItems?: NavItem[];
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader competition={competition} navItems={navItems} />
      <main>
        {title && (
          <div className="sf-banner">
            <h1 className="container mx-auto px-4 py-3 text-2xl text-wedgewood-50">
              {title}
            </h1>
          </div>
        )}
        <div className="container mx-auto px-4 py-4 md:py-6">{children}</div>
      </main>
      <SiteFooter />
    </div>
  );
}
