"use client"

import Link from "next/link"
import ThemeToggler from "@/components/theme-toggler"
import { UserNav } from "@/components/user-nav"
import { Button } from "@blog-starter/ui/button"
import { User } from "next-auth"
import { Label } from "@blog-starter/ui/label"
import { Search } from "lucide-react"
import { Input } from "@blog-starter/ui/input"
import { useScrollDirection } from "@/hooks/use-scroll-direction"
import { MENU_ITEMS } from "./menu-data"
import MenuLink from "./menu-link"
import { cn } from "@blog-starter/ui/lib/utils"


const Header = ({ user }: { user: User | null }) => {
    const { isVisible } = useScrollDirection()

    return (
        <>
            {/* Spacer to prevent content from jumping under the fixed header */}
            <div className="w-full bg-background" aria-hidden="true" />

            <header className={cn("fixed top-0 z-40 w-full flex flex-col transition-none", isVisible ? "shadow-none" : "shadow-md")}>
                {/* Top Bar - Always Visible */}
                <div className="z-20 w-full bg-white dark:bg-background border-b border-border relative">
                    <div className="w-full py-2.5 px-5 max-w-7xl mx-auto">
                        <div className="flex items-center justify-between gap-6">
                            <div className="flex flex-1 gap-6 items-center">
                                <Link href="/" className="font-serif text-2xl font-bold">
                                    Blogger
                                </Link>
                            </div>

                            <div className="flex items-center gap-4 md:gap-6">
                                <ThemeToggler />
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header
