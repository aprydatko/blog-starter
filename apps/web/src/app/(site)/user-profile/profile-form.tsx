"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@blog-starter/ui/avatar"
import { Button } from "@blog-starter/ui/button"
import { Input } from "@blog-starter/ui/input"
import { Label } from "@blog-starter/ui/label"
import { updateUserProfile } from "@/lib/actions/user"
import { toast } from "sonner"
import { User } from "next-auth"
import { Loader2 } from "lucide-react"

interface ProfileFormProps {
    user: User & { image?: string | null }
}

export function ProfileForm({ user }: ProfileFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState(user.name || "")
    const [email, setEmail] = useState(user.email || "")
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user.image || null)
    const [imageFile, setImageFile] = useState<File | null>(null)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const formData = new FormData()
            formData.append("name", name)
            formData.append("email", email)
            if (imageFile) {
                formData.append("image", imageFile)
            }

            const result = await updateUserProfile(formData)

            if (result.success) {
                toast.success("Profile updated successfully")
                router.refresh()
                router.back() // Redirect to previous page on successful update
                setImageFile(null) // Reset file input after successful upload
            } else {
                toast.error(result.error || "Failed to update profile")
            }
        } catch (error) {
            console.error(error)
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="bg-card border rounded-lg p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 text-center sm:text-left">
                <div className="relative group">
                    <Avatar className="h-24 w-24 cursor-pointer ring-offset-2 ring-2 ring-transparent group-hover:ring-primary transition-all">
                        <AvatarImage src={avatarPreview || ""} alt={name} className="object-cover" />
                        <AvatarFallback className="text-2xl">
                            {name?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <label
                        htmlFor="avatar-upload"
                        className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity text-xs font-medium"
                    >
                        Change
                    </label>
                    <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                    />
                </div>

                <div>
                    <h2 className="text-2xl font-semibold">{name || "User"}</h2>
                    <p className="text-muted-foreground">{email || "No email provided"}</p>
                </div>
            </div>

            <div className="grid gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        required
                        minLength={2}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email"
                        required
                    />
                </div>

                <div className="grid gap-2">
                    <Label>User ID</Label>
                    <div className="p-2 bg-muted rounded text-sm font-mono text-muted-foreground">
                        {user.id}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button type="submit" disabled={isLoading} className="flex-1 sm:flex-none">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Profile
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading} className="flex-1 sm:flex-none">
                        Cancel
                    </Button>
                </div>
            </div>
        </form>
    )
}
