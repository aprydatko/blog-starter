import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ProfileForm } from "./profile-form"

import { prisma } from "@blog-starter/db"

export default async function UserProfilePage() {
    const session = await auth()

    if (!session?.user?.id) {
        redirect("/login")
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    })

    if (!user) {
        redirect("/login")
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">User Profile</h1>
                <ProfileForm user={user} />
            </div>
        </div>
    )
}
