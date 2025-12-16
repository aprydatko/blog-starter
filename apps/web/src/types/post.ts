export type Category = {
  id: string
  name: string
}

export type Tag = {
  id: string
  name: string
}

export type Author = {
  id?: string
  name: string
  email?: string
  image?: string
}

export type PostWithRelations = {
  id: string
  title: string
  content?: string
  excerpt?: string | null
  slug?: string
  published?: boolean
  publishedAt?: Date | string | null
  scheduledAt?: Date | string | null
  createdAt: Date | string
  updatedAt: Date | string
  author?: Author | null
  categories: Category[]
  tags: Tag[]
  featuredImage?: string | null
  seoTitle?: string | null
  seoDescription?: string | null
}
