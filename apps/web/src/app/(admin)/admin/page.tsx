import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@blog-starter/ui/card'
import { getDashboardStats } from "./dashboard-stats"

export default async function AdminDashboard() {
  const { commentsCount, mediaCount, pagesCount, postsCount } = await getDashboardStats();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your admin dashboard</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Posts</CardTitle>
            <CardDescription>Published articles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{postsCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Pages</CardTitle>
            <CardDescription>Static pages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagesCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comments</CardTitle>
            <CardDescription>User comments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{commentsCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Media Files</CardTitle>
            <CardDescription>Uploaded files</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mediaCount}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
