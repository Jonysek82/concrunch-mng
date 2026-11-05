import { PageTitle } from '@/components/ui/PageTitle';
import { Card } from '@/components/ui/Card';
import { placeholderNews } from '@/lib/placeholders';

export function NewsPage() {
  // TODO: nahradit useQuery(getNews)
  return (
    <>
      <PageTitle>Novinky</PageTitle>
      <ul className="flex flex-col gap-3">
        {placeholderNews.map((post) => (
          <li key={post.id}>
            <Card>
              <time className="text-xs text-muted">DD. M. HH:mm</time>
              <h3 className="mt-1 font-bold">{post.title}</h3>
              <p className="mt-1 text-sm text-muted">{post.body}</p>
            </Card>
          </li>
        ))}
      </ul>
    </>
  );
}
