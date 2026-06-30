import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface-dark border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Sunshine Horticulture. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          {[
            { label: "Home", href: "/" },
            { label: "About", href: "/#about" },
            { label: "Products", href: "/#products" },
            { label: "Contact", href: "/#contact" },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-gray-500 hover:text-brand-400 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
