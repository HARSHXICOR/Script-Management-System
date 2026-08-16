import { motion } from "motion/react";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";
import { useState } from "react";

export function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Marketing", "Growth", "Personal Journey", "Creator Tips"];

  const blogPosts = [
    {
      id: 1,
      title: "5 Ways to Grow Your Instagram Following in 2026",
      category: "Growth",
      excerpt:
        "Discover the latest strategies to organically grow your Instagram following and boost engagement with proven tactics that work in 2026.",
      date: "May 25, 2026",
      readTime: "5 min read",
      featured: true,
    },
    {
      id: 2,
      title: "Behind the Scenes: My Journey as a Creator",
      category: "Personal Journey",
      excerpt:
        "From hobby to full-time career, here's an honest look at my journey as a content creator and the lessons I learned along the way.",
      date: "May 20, 2026",
      readTime: "8 min read",
      featured: true,
    },
    {
      id: 3,
      title: "Maximizing Brand Collaboration ROI",
      category: "Marketing",
      excerpt:
        "Learn how to measure and optimize the return on investment for your brand partnerships and sponsorships.",
      date: "May 15, 2026",
      readTime: "6 min read",
      featured: true,
    },
    {
      id: 4,
      title: "The Ultimate Content Creation Toolkit 2026",
      category: "Creator Tips",
      excerpt:
        "Essential tools, apps, and equipment I use daily to create professional content for brands and my audience.",
      date: "May 10, 2026",
      readTime: "7 min read",
      featured: false,
    },
    {
      id: 5,
      title: "Building Authentic Relationships with Your Audience",
      category: "Growth",
      excerpt:
        "Authenticity is key in the creator economy. Here's how to build genuine connections with your followers.",
      date: "May 5, 2026",
      readTime: "5 min read",
      featured: false,
    },
    {
      id: 6,
      title: "Negotiating Fair Rates for Content Creation",
      category: "Marketing",
      excerpt:
        "A comprehensive guide to understanding your worth and negotiating fair compensation for your content.",
      date: "April 28, 2026",
      readTime: "9 min read",
      featured: false,
    },
    {
      id: 7,
      title: "From 0 to 100K: My First Year Milestones",
      category: "Personal Journey",
      excerpt:
        "A detailed breakdown of how I grew from zero to 100,000 followers in my first year as a content creator.",
      date: "April 22, 2026",
      readTime: "10 min read",
      featured: false,
    },
    {
      id: 8,
      title: "Mastering Instagram Reels for Maximum Reach",
      category: "Creator Tips",
      excerpt:
        "Technical tips and creative strategies to make your Instagram Reels stand out and reach millions.",
      date: "April 15, 2026",
      readTime: "6 min read",
      featured: false,
    },
    {
      id: 9,
      title: "The Psychology of Engagement: What Makes People Click",
      category: "Marketing",
      excerpt:
        "Understanding the psychology behind social media engagement and how to apply it to your content strategy.",
      date: "April 10, 2026",
      readTime: "8 min read",
      featured: false,
    },
  ];

  const filteredPosts =
    selectedCategory === "All"
      ? blogPosts
      : blogPosts.filter((post) => post.category === selectedCategory);

  const featuredPosts = blogPosts.filter((post) => post.featured);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-500/30 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">
              Blog
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto">
              Insights, tips, and stories from my journey as a content creator
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent">
              Featured Articles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 rounded-2xl backdrop-blur-xl border border-white/10 group-hover:border-purple-500/50 transition-all" />
                <div className="relative p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs">
                      {post.category}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs">
                      Featured
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold mb-4 group-hover:text-purple-400 transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-gray-400 mb-6 line-clamp-3">{post.excerpt}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-purple-400 group-hover:gap-3 transition-all">
                    <span>Read More</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="relative py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 text-white"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
                }`}
              >
                <Tag size={16} />
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* All Posts */}
      <section className="relative py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent">
              All Articles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative group cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 rounded-2xl backdrop-blur-xl border border-white/10 group-hover:border-white/20 transition-all" />
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs">
                      {post.category}
                    </span>
                    {post.featured && (
                      <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-400 text-xs">
                        ★
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold mb-3 group-hover:text-purple-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{post.excerpt}</p>

                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{post.date}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-teal-500/20 rounded-3xl backdrop-blur-xl border border-white/10" />
            <div className="relative p-12 text-center">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent">
                Never Miss an Update
              </h2>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                Subscribe to get the latest creator tips, marketing insights, and personal
                stories delivered to your inbox
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-6 py-3 rounded-full bg-white/5 border border-white/10 focus:border-purple-500/50 focus:outline-none transition-all"
                />
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition-all whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
