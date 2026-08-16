import { motion } from "motion/react";
import { Eye, TrendingUp, Heart, ExternalLink } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useState } from "react";

export function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Food & Beverage", "Technology", "Fashion", "Lifestyle", "Events"];

  const portfolioItems = [
    {
      id: 1,
      brand: "Urban Eats",
      category: "Food & Beverage",
      description: "Multi-platform campaign featuring new menu items with Instagram reels and stories",
      reach: "500K",
      engagement: "12%",
      conversions: "2.5K",
      image: "https://images.unsplash.com/photo-1619719015141-8f5c1b8dfedf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwcGhvdG9ncmFwaGVyJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3ODAyNDQ5MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      deliverables: ["5 Instagram Reels", "10 Story Posts", "2 Feed Posts"],
    },
    {
      id: 2,
      brand: "TechFlow",
      category: "Technology",
      description: "Product review and unboxing series for new smartphone launch",
      reach: "350K",
      engagement: "9.5%",
      conversions: "1.8K",
      image: "https://images.unsplash.com/photo-1545242640-7c9e9cc07d23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9kdWN0JTIwcGhvdG9ncmFwaHklMjBzdHVkaW98ZW58MXx8fHwxNzgwMjQ0OTE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      deliverables: ["Unboxing Reel", "Feature Breakdown", "Comparison Video"],
    },
    {
      id: 3,
      brand: "StyleHouse",
      category: "Fashion",
      description: "Spring collection showcase with styling tips and outfit inspo",
      reach: "420K",
      engagement: "11%",
      conversions: "3.2K",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFuZCUyMGNvbGxhYm9yYXRpb24lMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzgwMjQ0OTE3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      deliverables: ["6 Reels", "15 Story Posts", "3 Carousel Posts"],
    },
    {
      id: 4,
      brand: "FitLife Pro",
      category: "Lifestyle",
      description: "30-day fitness challenge promotion with daily content updates",
      reach: "380K",
      engagement: "10.2%",
      conversions: "2.1K",
      image: "https://images.unsplash.com/photo-1611784728558-6c7d9b409cdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW50JTIwY3JlYXRvciUyMGZpbG1pbmd8ZW58MXx8fHwxNzgwMjQ0OTE2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      deliverables: ["30 Stories", "10 Reels", "Challenge Recap"],
    },
    {
      id: 5,
      brand: "Summit 2025",
      category: "Events",
      description: "Live event coverage for digital marketing conference",
      reach: "290K",
      engagement: "8.7%",
      conversions: "1.5K",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjBtZWRpYSUyMGFuYWx5dGljcyUyMGRhc2hib2FyZHxlbnwxfHx8fDE3ODAwNjU0MjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      deliverables: ["Live Stories", "Speaker Highlights", "Event Recap Video"],
    },
    {
      id: 6,
      brand: "Glow Beauty",
      category: "Lifestyle",
      description: "Skincare routine series featuring new product line",
      reach: "460K",
      engagement: "13.5%",
      conversions: "3.8K",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmZsdWVuY2VyJTIwcG9ydHJhaXQlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzgwMjQ0OTE3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      deliverables: ["Tutorial Reels", "Before/After", "Product Reviews"],
    },
  ];

  const filteredItems =
    selectedCategory === "All"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === selectedCategory);

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
              Portfolio
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto">
              A showcase of successful brand collaborations and campaign results
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="relative py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Total Campaigns", value: "150+" },
              { label: "Brands Worked With", value: "80+" },
              { label: "Total Reach", value: "15M+" },
              { label: "Avg. Engagement", value: "10.5%" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 rounded-2xl backdrop-blur-xl border border-white/10" />
                <div className="relative p-6 text-center">
                  <div className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              </motion.div>
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
                className={`px-6 py-3 rounded-full transition-all ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 text-white"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="relative py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 rounded-2xl backdrop-blur-xl border border-white/10 group-hover:border-purple-500/50 transition-all" />
                <div className="relative overflow-hidden rounded-2xl">
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.brand}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs">
                        {item.category}
                      </span>
                      <ExternalLink
                        size={16}
                        className="text-gray-400 group-hover:text-white transition-colors"
                      />
                    </div>

                    <h3 className="text-2xl font-bold mb-3 group-hover:text-purple-400 transition-colors">
                      {item.brand}
                    </h3>
                    <p className="text-gray-400 text-sm mb-6">{item.description}</p>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div>
                        <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                          <Eye size={14} />
                          <span>Reach</span>
                        </div>
                        <div className="text-lg font-bold">{item.reach}</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                          <Heart size={14} />
                          <span>Engagement</span>
                        </div>
                        <div className="text-lg font-bold">{item.engagement}</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                          <TrendingUp size={14} />
                          <span>Conversions</span>
                        </div>
                        <div className="text-lg font-bold">{item.conversions}</div>
                      </div>
                    </div>

                    {/* Deliverables */}
                    <div className="pt-4 border-t border-white/10">
                      <div className="text-xs text-gray-400 mb-2">Deliverables</div>
                      <div className="flex flex-wrap gap-2">
                        {item.deliverables.map((deliverable) => (
                          <span
                            key={deliverable}
                            className="px-2 py-1 rounded bg-white/5 text-xs text-gray-300"
                          >
                            {deliverable}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-teal-500/20 rounded-3xl backdrop-blur-xl border border-white/10" />
            <div className="relative p-12 text-center">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent">
                Want Similar Results?
              </h2>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                Let's create a campaign that drives real results for your brand
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                Start Your Campaign
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
