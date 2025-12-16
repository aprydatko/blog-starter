export type MenuItem = {
    label: string
    href: string
    children?: MenuItem[]
}

export const MENU_ITEMS: MenuItem[] = [
    {
        label: "Style",
        href: "#",
        children: [
            { label: "Accessories", href: "/accessories" },
            { label: "Clothing", href: "/clothing" },
            { label: "Luggage", href: "/luggage" },
            { label: "Shoes", href: "/shoes" },
        ],
    },
    {
        label: "Beauty",
        href: "#",
        children: [
            { label: "Makeup", href: "/makeup" },
            { label: "Skin Care", href: "/skin-care" },
            { label: "Hair", href: "/hair" },
        ],
    },
    {
        label: "Health",
        href: "/health",
    },
    {
        label: "Home and garden",
        href: "/home-garden",
    },
    {
        label: "Tech",
        href: "/tech",
    },
]
