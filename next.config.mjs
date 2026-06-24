/** @type {import('next').NextConfig} */

const SITE = "https://nicpjones.com";
const BLOG_HOST = "blog.nicpwns.com";
const onBlogHost = [{ type: "host", value: BLOG_HOST }];

// Old blog short paths (pre-Medium) -> destinations on the new site.
const SHORT_REDIRECTS = {
  "/linked-lists": "/notes/coding-data-structures-linked-lists",
  "/how-to-create-a-blog": "/notes/how-to-create-a-blog",
  "/whoami": "/profile",
  "/category/coding": "/notes?tag=coding",
  "/category/coding/data-structures": "/notes?tag=coding",
  "/category/coding/algorithms": "/notes?tag=coding",
  "/category/cyber-security/cyber-threat-intelligence": "/notes?tag=threatintelligence",
  "/category/cyber-security/write-ups/hack-the-box": "/notes?tag=hackthebox",
};

const nextConfig = {
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
  async redirects() {
    // blog.nicpwns.com -> site. These fire only once blog.nicpwns.com is added
    // as an alias on the SST site (and its old Medium DNS record removed).
    const shorts = Object.entries(SHORT_REDIRECTS).map(([oldPath, dest]) => ({
      source: oldPath,
      has: onBlogHost,
      destination: `${SITE}${dest}`,
      permanent: true,
    }));
    return [
      { source: "/blog", destination: "/notes", permanent: true },
      // Old Medium story URLs (/<slug>-<id>) -> /notes/<slug>.
      {
        source: "/:slug([a-z0-9-]+)-:id([0-9a-f]{8,})",
        has: onBlogHost,
        destination: `${SITE}/notes/:slug`,
        permanent: true,
      },
      ...shorts,
      // Anything else still hitting the old blog host -> notes index.
      { source: "/:path*", has: onBlogHost, destination: `${SITE}/notes`, permanent: false },
    ];
  },
};

export default nextConfig;
