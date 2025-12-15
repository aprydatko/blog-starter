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
            <div className="w-full h-[108px] bg-background" aria-hidden="true" />

            <header className={cn("fixed top-0 z-40 w-full flex flex-col transition-none", isVisible ? "shadow-none" : "shadow-md")}>
                {/* Top Bar - Always Visible */}
                <div className="z-20 w-full bg-white dark:bg-background border-b border-border relative">
                    <div className="w-full py-2.5 px-5 max-w-7xl mx-auto">
                        <div className="flex items-center justify-between gap-6">
                            <div className="flex flex-1 gap-6 items-center">
                                <Link href="/" className="font-serif text-2xl font-bold">
                                    Blogger
                                </Link>
                                <div className="flex-1 max-w-lg hidden md:block">
                                    <form className="z-10 gap-2.5">
                                        <div className="relative">
                                            <Label htmlFor="titleSearch" className="sr-only">
                                                Search by Title
                                            </Label>
                                            <div className="relative flex items-center">
                                                <Input
                                                    id="titleSearch"
                                                    placeholder="Enter title..."
                                                    className="flex h-11 shrink w-full shadow-none rounded-full bg-background dark:bg-white/5 px-3 py-1.5 text-base outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                />
                                                <Button type="submit" size="icon" className="absolute right-1 top-1 h-9 w-9 rounded-full">
                                                    <Search className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 md:gap-6">
                                <div className="md:hidden">
                                    <Button variant="ghost" size="icon">
                                        <Search className="h-5 w-5" />
                                    </Button>
                                </div>
                                {user ? (
                                    <UserNav user={user} />
                                ) : (
                                    <div className="flex gap-4">
                                        <Button asChild variant="ghost" className="hidden sm:flex">
                                            <Link href="/login">Login</Link>
                                        </Button>
                                        <Button asChild className="hidden sm:flex">
                                            <Link href="/register">Sign up</Link>
                                        </Button>
                                        <Button asChild size="sm" className="sm:hidden">
                                            <Link href="/login">Login</Link>
                                        </Button>
                                    </div>
                                )}
                                <ThemeToggler />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Bar - Auto Hides */}
                <div
                    className={cn(
                        "z-10 w-full bg-background transition-all duration-300 ease-in-out absolute w-full",
                        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
                    )}
                    style={{ top: '100%' }}
                >
                    <div className="w-full h-11  px-5 max-w-7xl mx-auto flex items-center">
                        <nav className="w-full h-full overflow-x-auto md:overflow-visible no-scrollbar">
                            <ul className="flex items-center gap-8 min-w-max h-full">
                                {MENU_ITEMS.map((item) => (
                                    <li key={item.label} className="h-full flex items-center">
                                        <MenuLink item={item} />
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header
