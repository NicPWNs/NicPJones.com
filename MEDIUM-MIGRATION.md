# Medium migration — canonicals & redirects

Your site is now the source of truth for all 17 posts. Two things make Google treat it that way.

## 1. Set the canonical URL on each Medium story

In Medium, open each story → **... → Story settings → SEO / Advanced → Canonical link**, and paste the matching site URL below. This tells Google the site URL is the original.

| Medium story | Canonical URL to enter |
|---|---|
| https://medium.com/@NicPWNs/cyberthreat-intelligence-5c9bbb1493bd | https://nicpjones.com/notes/cyberthreat-intelligence |
| https://medium.com/@NicPWNs/purple-teaming-2af5e5cab617 | https://nicpjones.com/notes/purple-teaming |
| https://medium.com/@NicPWNs/mitre-frameworks-b17ef7235b0a | https://nicpjones.com/notes/mitre-frameworks |
| https://medium.com/@NicPWNs/cyber-threat-intelligence-sharing-270c7d184baa | https://nicpjones.com/notes/cyber-threat-intelligence-sharing |
| https://medium.com/@NicPWNs/cti-in-the-soc-154d3cd1accc | https://nicpjones.com/notes/cti-in-the-soc |
| https://medium.com/@NicPWNs/what-is-cyberthreat-intelligence-9474b90e507f | https://nicpjones.com/notes/what-is-cyberthreat-intelligence |
| https://medium.com/@NicPWNs/hackthebox-paper-write-up-b77d4c2989d7 | https://nicpjones.com/notes/hackthebox-paper-write-up |
| https://medium.com/@NicPWNs/hackthebox-timing-write-up-76c07ce2b107 | https://nicpjones.com/notes/hackthebox-timing-write-up |
| https://medium.com/@NicPWNs/hackthebox-pandora-write-up-9c1d409c69dd | https://nicpjones.com/notes/hackthebox-pandora-write-up |
| https://medium.com/@NicPWNs/coding-data-structures-stacks-1a0b8c97f820 | https://nicpjones.com/notes/coding-data-structures-stacks |
| https://blog.nicpwns.com/hackthebox-unicode-write-up-320d5af4103d | https://nicpjones.com/notes/hackthebox-unicode-write-up |
| https://blog.nicpwns.com/coding-data-structures-linked-lists-2f5ff40b14d5 | https://nicpjones.com/notes/coding-data-structures-linked-lists |
| https://blog.nicpwns.com/hackthebox-search-write-up-245e93750cfe | https://nicpjones.com/notes/hackthebox-search-write-up |
| https://blog.nicpwns.com/coding-algorithms-bubble-sort-e403bdc7ae51 | https://nicpjones.com/notes/coding-algorithms-bubble-sort |
| https://blog.nicpwns.com/hackthebox-backdoor-write-up-29d3d448d322 | https://nicpjones.com/notes/hackthebox-backdoor-write-up |
| https://blog.nicpwns.com/vim-timidation-dont-be-scared-of-vim-ad8c1d1ba7d | https://nicpjones.com/notes/vim-timidation-dont-be-scared-of-vim |
| https://blog.nicpwns.com/how-to-create-a-blog-4b0d416f07b7 | https://nicpjones.com/notes/how-to-create-a-blog |

## 2. 301 redirects (already configured in the app)

`next.config.mjs` 301-redirects all old `blog.nicpwns.com` URLs to the new pages: one regex rule maps `/<slug>-<id>` → `/notes/<slug>`, old `/category/*` links → the matching tag filter, and a catch-all → `/notes`. Nothing renders on `blog.nicpwns.com` — every request redirects.

**To activate (SST → AWS, Cloudflare DNS-only):**

1. Add `blog.nicpwns.com` as an alias on the Next site's domain in SST and deploy (SST provisions the ACM cert + CloudFront alias):
   ```ts
   domain: { name: "nicpjones.com", aliases: ["blog.nicpwns.com"], dns: sst.cloudflare.dns() }
   ```
2. In Cloudflare DNS, delete the old Medium `blog` record (SST adds the new `blog` CNAME → CloudFront, DNS-only).

Verify: `curl -sI https://blog.nicpwns.com/` → **307 → /notes** (not 200).

> Cloudflare Free + DNS-only can't redirect at the edge (Rules need the orange-cloud proxy), so the redirect lives in the app — which is why it's configured here instead of in Cloudflare.

