import { BlogContentManager, BlogPost } from '@/lib/blog-content';
import Link from 'next/link';
import Image from 'next/image';

export default function BlogPage() {
  // Combine all published posts, sorted by publishDate descending
  const allPosts = BlogContentManager.getAllPosts().sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );

  // Reorder: 2nd blog first, 3rd blog second, 1st blog third (if at least 3 blogs)
  let reorderedPosts = allPosts;
  if (allPosts.length >= 3) {
    // 2nd blog first, 3rd blog second, 1st blog third
    reorderedPosts = [allPosts[1], allPosts[2], allPosts[0], ...allPosts.slice(3)];
    // Move 'Disrupting Security & Surveillance...' (title match) to second position
    const idx = reorderedPosts.findIndex(post => post.title.includes('Disrupting Security & Surveillance with Edge Intelligence and Video Analytics'));
    if (idx > -1 && idx !== 1) {
      const [blog] = reorderedPosts.splice(idx, 1);
      reorderedPosts.splice(1, 0, blog);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">SocTeamUp Blog</h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Insights, tutorials, and updates from the world of semiconductor design and technology. Stay informed about the latest developments in chip design, industry trends, and our company news.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="divide-y divide-gray-200">
          {reorderedPosts.map((post, idx) => (
            <div key={post.id} className="flex flex-col md:flex-row items-stretch py-8 gap-4 md:gap-0">
              {/* Main Content */}
              <div className="flex-1 flex flex-col justify-center md:pr-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-1 leading-snug">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="text-gray-700 text-base mb-2 line-clamp-2">{post.excerpt}</p>
                <div className="text-gray-500 text-sm mb-1">
                  {post.author?.name}
                </div>
              </div>

              {/* Read time and image */}
              <div className="flex flex-col items-end justify-between md:w-56 min-w-[120px]">
                <span className="text-gray-400 text-sm mb-2 md:mb-0 md:self-end">
                  {post.readTime} min read
                </span>
                {post.coverImage && (
                  <div className="w-40 h-24 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      width={160}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 