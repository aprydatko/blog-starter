import Link from 'next/link'

const mainLinks = [
  { label: 'Deals', href: '#' },
  { label: 'Style', href: '#' },
  { label: 'Stores', href: '#' },
  { label: 'Beauty', href: '#' },
  { label: 'Health', href: '#' },
  { label: 'Home and Garden', href: '#' },
  { label: 'Tech', href: '#' },
  { label: 'Gift Ideas', href: '#' },
]

const legalLinks = [
  { label: 'Terms', href: '#' },
  { label: 'Privacy Policy', href: '#' },
  { label: 'Privacy Dashboard', href: '#' },
  { label: 'Help', href: '#' },
  { label: 'About us', href: '#' },
  { label: 'About our ads', href: '#' },
  { label: 'Licensing', href: '#' },
  { label: 'Sitemap', href: '#' },
]

const socialLinks = [
  { label: 'X', href: '#' },
  { label: 'Facebook', href: '#' },
  { label: 'Instagram', href: '#' },
]

const Footer = () => {
  return (
    <footer className="border-t border-border bg-white dark:bg-background py-8 text-sm">
      <div className="container mx-auto px-4">
        {/* Top Row: Categories */}
        <div className="mb-8 flex flex-wrap justify-center gap-x-6 gap-y-3 font-medium text-gray-900 md:gap-x-8">
          {mainLinks.map(link => (
            <Link key={link.label} href={link.href} className="dark:text-white hover:text-primary hover:underline">
              {link.label}
            </Link>
          ))}
        </div>

        {/* Middle Section: Socials */}
        <div className="mb-8 flex flex-col items-center justify-center gap-3 border-t border-border pt-8 sm:flex-row">
          <span className="font-semibold text-gray-900">Follow us on</span>
          <div className="flex gap-4">
            {socialLinks.map(link => (
              <Link key={link.label} href={link.href} className="font-medium text-gray-600 hover:text-purple-600">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Row: Legal & Copyright */}
        <div className="border-t border-border pt-8 text-center">
          <div className="mb-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-gray-500">
            {legalLinks.map(link => (
              <Link key={link.label} href={link.href} className="hover:underline">
                {link.label}
              </Link>
            ))}
          </div>
          <div className="text-xs text-gray-400">&copy; {new Date().getFullYear()} Blogger. All rights reserved.</div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
