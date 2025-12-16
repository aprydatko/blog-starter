'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@blog-starter/ui/avatar'
import { Button } from '@blog-starter/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@blog-starter/ui/dropdown-menu'
import { User } from 'next-auth'
import Link from 'next/link'
import { logout } from '@/lib/actions/auth'
interface UserNavProps {
  user: User
}

export function UserNav({ user }: UserNavProps) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-auto w-auto p-0 gap-2 rounded-full cursor-pointer hover:bg-transparent"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.image || ''} alt={`Avatar Profile's ${user.name}`} />

            <AvatarFallback>{user.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="font-medium text-sm hidden md:inline-block">{user.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-48 border origin-top-right rounded-md mt-1 py-1 bg-popover border-white/10"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal block px-4 py-2 text-sm">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        {/* <DropdownMenuSeparator /> */}
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              href="/user-profile"
              className="block px-4 py-2 text-sm dark:text-gray-300 focus:bg-black/3 dark:focus:bg-white/5 focus:outline-hidden cursor-pointer"
            >
              Profile
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {/* <DropdownMenuSeparator /> */}
        <DropdownMenuItem
          onSelect={() => logout()}
          className="block px-4 py-2 text-sm dark:text-gray-300 focus:bg-black/3 dark:focus:bg-white/5 focus:outline-hidden cursor-pointer"
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
