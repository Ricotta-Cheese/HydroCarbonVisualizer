import Link from "next/link";

const navItems = [
  { href: "/", label: "Class Map", key: "class-map" },
  { href: "/combustion", label: "Combustion View", key: "combustion" },
  { href: "/reagents", label: "Reagent Test", key: "reagents" },
  { href: "/lab", label: "Reaction Lab", key: "lab" },
];

export default function AppNavigation({ active }) {
  return (
    <nav
      className="mx-auto mb-8 flex w-fit max-w-full justify-center rounded-full border border-slate-200 bg-white/90 p-1 shadow-[0_18px_55px_rgba(15,23,42,0.10)] backdrop-blur-xl"
      aria-label="Primary navigation"
    >
      <div className="flex max-w-full flex-wrap justify-center gap-1">
        {navItems.map((item) => {
          const isActive = active === item.key;
          const baseClass =
            "inline-flex min-h-10 items-center justify-center rounded-full px-4 text-sm font-semibold transition duration-300";

          return (
            <Link
              key={item.key}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`${baseClass} ${
                isActive
                  ? "bg-slate-950 text-white shadow-[0_10px_28px_rgba(15,23,42,0.22)]"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
