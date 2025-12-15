import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { MenuItem } from "@/lib/utils/menu-data"

const MenuLink = ({ item }: { item: MenuItem }) => {
    if (!item.children || item.children.length === 0) {
        return (
            <Link
                href={item.href}
                className="font-sans text-sm font-bold text-gray-500 hover:text-primary whitespace-nowrap h-full flex items-center"
            >
                {item.label}
            </Link>
        )
    }

    return (
        <div className="group relative flex items-center gap-1 cursor-pointer h-full">
            <Link
                href={item.href}
                className="font-sans text-sm font-bold text-gray-500 group-hover:text-primary whitespace-nowrap"
            >
                {item.label}
            </Link>
            <ChevronDown className="h-3 w-3 text-gray-500 group-hover:text-primary transition-transform group-hover:rotate-180" />

            {/* Dropdown Menu */}
            <div className="absolute -left-6 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="flex flex-col min-w-[200px] rounded-md bg-white dark:bg-background border border-border shadow-lg p-2">
                    {item.children.map((child) => (
                        <Link
                            key={child.href}
                            href={child.href}
                            className="px-4 py-2 text-sm text-gray-500 hover:text-primary hover:bg-muted rounded-md transition-colors"
                        >
                            {child.label}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MenuLink