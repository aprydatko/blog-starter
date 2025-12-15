export type MenuItem = {
    label: string
    href: string
    children?: MenuItem[]
}

export const MENU_ITEMS: MenuItem[] = [
    {
        label: "Style",
        href: "/style",
        children: [
            { label: "Accessories", href: "/style/accessories" },
            { label: "Clothing", href: "/style/clothing" },
            { label: "Luggage", href: "/style/luggage" },
            { label: "Shoes", href: "/style/shoes" },
        ],
    },
    {
        label: "Beauty",
        href: "/beauty",
        children: [
            { label: "Makeup", href: "/beauty/makeup" },
            { label: "Skin Care", href: "/beauty/skin-care" },
            { label: "Hair", href: "/beauty/hair" },
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
