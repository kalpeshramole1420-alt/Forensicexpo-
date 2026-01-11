import { MainLayout } from '@/components/layouts/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Newspaper, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getPublishedNews } from '@/db/api';
import type { News as NewsType } from '@/types/types';
import { format } from 'date-fns';

export default function News() {
  const [news, setNews] = useState<NewsType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getPublishedNews();
        setNews(data);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl xl:text-5xl font-bold text-foreground mb-4 max-sm:text-3xl">
            Latest News & Updates
          </h1>
          <p className="text-lg text-muted-foreground max-sm:text-base">
            Stay informed about the latest developments in forensic science and our organization.
          </p>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-6 bg-muted animate-pulse mb-2 rounded" />
                  <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : news.length > 0 ? (
          <div className="space-y-6">
            {news.map((item) => (
              <Card
                key={item.id}
                className="shadow-card hover:shadow-hover transition-shadow overflow-hidden"
              >
                <div className="@container">
                  <div className="flex flex-col @md:flex-row">
                    {item.image_url && (
                      <div className="@md:w-64 h-48 @md:h-auto bg-muted overflow-hidden shrink-0">
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="p-6 flex-1">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
                        <Newspaper className="h-4 w-4" />
                        <span>
                          {item.published_at
                            ? format(new Date(item.published_at), 'MMMM dd, yyyy')
                            : format(new Date(item.created_at), 'MMMM dd, yyyy')}
                        </span>
                      </div>
                      <h2 className="text-2xl font-semibold text-foreground mb-3">
                        {item.title}
                      </h2>
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {item.excerpt || item.content.substring(0, 200) + '...'}
                      </p>
                      <Link
                        to={`/news/${item.id}`}
                        className="inline-flex items-center text-primary hover:underline"
                      >
                        Read Full Article <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No news articles available at the moment.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
