import Image from "next/image";
import Link from "next/link";
import logo from "@/app/assets/sf-logo.png";
import SocialLinks from "./SocialLinks";

export default function SiteFooter() {
  return (
    <footer className="container mx-auto mt-auto px-5 py-8 text-gray-600">
      <div className="flex items-center">
        <p className="flex basis-1/3 text-sm">
          <Link href="/" className="flex items-center font-medium text-gray-900">
            <Image src={logo} className="mr-3 rounded-full" height={16} width={16} alt="" />
            &copy;{new Date().getFullYear()}
          </Link>
        </p>
        <div className="flex basis-1/3 justify-center whitespace-nowrap">
          <a className="hover:underline" href="https://stevenfewster.com">
            stevenfewster.com
          </a>
        </div>
        <div className="flex basis-1/3 justify-end">
          <span className="hidden md:inline-flex">
            <SocialLinks />
          </span>
        </div>
      </div>
    </footer>
  );
}
