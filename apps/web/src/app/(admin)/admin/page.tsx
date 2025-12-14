import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@blog-starter/ui/card'
import { Newspaper, StickyNote, MessageSquareMore, Image } from 'lucide-react';
import { getDashboardStats } from "./dashboard-stats"

export default async function AdminDashboard() {
  const { commentsCount, mediaCount, pagesCount, postsCount } = await getDashboardStats();
  
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className='border-border bg-card'>
          <CardContent>
            <div>
              <div className='flex items-center justify-center w-16 h-16 bg-accent/5 rounded-xl'>
                <Newspaper className='w-6 h-6' />
              </div>
              <p className='mt-4 text-xl'>Posts</p>
              <p className='mt-3 text-4xl font-bold leading-none'>{postsCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card className='border-border bg-card'>
          <CardContent>
            <div>
              <div className='flex items-center justify-center w-16 h-16 bg-accent/5 rounded-xl'>
                <StickyNote className='w-6 h-6' />
              </div>
              <p className='mt-4 text-xl'>Pages</p>
              <p className='mt-3 text-4xl font-bold leading-none'>{pagesCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card className='border-border bg-card'>
          <CardContent>
            <div>
              <div className='flex items-center justify-center w-16 h-16 bg-accent/5 rounded-xl'>
                <MessageSquareMore className='w-6 h-6' />
              </div>
              <p className='mt-4 text-xl'>Comments</p>
              <p className='mt-3 text-4xl font-bold leading-none'>{commentsCount}</p>
            </div>
          </CardContent>
        </Card>

         <Card className='border-border bg-card'>
          <CardContent>
            <div>
              <div className='flex items-center justify-center w-16 h-16 bg-accent/5 rounded-xl'>
                <Image className='w-6 h-6' />
              </div>
              <p className='mt-4 text-xl'>Media Files</p>
              <p className='mt-3 text-4xl font-bold leading-none'>{mediaCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
