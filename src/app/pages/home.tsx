import { Link } from "react-router";
import { motion } from "motion/react";
import {
  ArrowRight,
  Users,
  TrendingUp,
  Eye,
  Heart,
  Instagram,
  Camera,
  Package,
  Calendar,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { DashboardPreview } from "../components/dashboard-preview";

export function Home() {
  const stats = [
    { icon: Users, label: "Followers", value: "250K+", color: "from-purple-500 to-purple-600" },
    { icon: Package, label: "Collaborations", value: "150+", color: "from-blue-500 to-blue-600" },
    { icon: Eye, label: "Monthly Reach", value: "2.5M+", color: "from-teal-500 to-teal-600" },
    { icon: Heart, label: "Engagement", value: "8.5%", color: "from-amber-500 to-amber-600" },
  ];

  const services = [
    {
      icon: Instagram,
      title: "Instagram Story Promotion",
      description: "24-hour story features with swipe-up links and engagement tracking",
    },
    {
      icon: Camera,
      title: "Instagram Reel Promotion",
      description: "High-impact reels with trending audio and professional editing",
    },
    {
      icon: Package,
      title: "Product Review",
      description: "Detailed product reviews with authentic feedback and recommendations",
    },
    {
      icon: Calendar,
      title: "Event Coverage",
      description: "Live event coverage with real-time updates and behind-the-scenes content",
    },
  ];

  const portfolioItems = [
    {
      brand: "Urban Eats",
      category: "Food & Beverage",
      reach: "500K",
      engagement: "12%",
      image: "https://images.unsplash.com/photo-1619719015141-8f5c1b8dfedf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwcGhvdG9ncmFwaGVyJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3ODAyNDQ5MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      brand: "TechFlow",
      category: "Technology",
      reach: "350K",
      engagement: "9.5%",
      image: "https://images.unsplash.com/photo-1545242640-7c9e9cc07d23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9kdWN0JTIwcGhvdG9ncmFwaHklMjBzdHVkaW98ZW58MXx8fHwxNzgwMjQ0OTE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      brand: "StyleHouse",
      category: "Fashion",
      reach: "420K",
      engagement: "11%",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFuZCUyMGNvbGxhYm9yYXRpb24lMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzgwMjQ0OTE3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
  ];

  const blogPosts = [
    {
      title: "5 Ways to Grow Your Instagram Following in 2026",
      category: "Growth",
      date: "May 25, 2026",
      readTime: "5 min read",
    },
    {
      title: "Behind the Scenes: My Journey as a Creator",
      category: "Personal Journey",
      date: "May 20, 2026",
      readTime: "8 min read",
    },
    {
      title: "Maximizing Brand Collaboration ROI",
      category: "Marketing",
      date: "May 15, 2026",
      readTime: "6 min read",
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Background Gradient */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-500/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-teal-500/20 border border-white/10 mb-6">
                <span className="text-sm text-gray-300">✨ Content Creator & Influencer</span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">
                Sarah Mitchell
              </h1>
              <p className="text-xl sm:text-2xl text-gray-300 mb-8">
                Helping brands connect with audiences through authentic storytelling and creative content
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/contact"
                  className="group px-8 py-4 bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2"
                >
                  <span>Work With Me</span>
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </Link>
                <Link
                  to="/portfolio"
                  className="px-8 py-4 border border-white/20 rounded-full hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                >
                  View Portfolio
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 rounded-3xl blur-2xl opacity-20" />
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmZsdWVuY2VyJTIwcG9ydHJhaXQlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzgwMjQ0OTE3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Creator"
                className="relative rounded-3xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 rounded-2xl backdrop-blur-xl border border-white/10 group-hover:border-white/20 transition-all" />
                <div className="relative p-6 text-center">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} mb-4`}>
                    <stat.icon size={24} className="text-white" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1611784728558-6c7d9b409cdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW50JTIwY3JlYXRvciUyMGZpbG1pbmd8ZW58MXx8fHwxNzgwMjQ0OTE2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="About"
                className="rounded-3xl shadow-2xl"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent">
                My Story
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                Started as a food blogger in 2020, I've grown into a full-time content creator
                working with amazing brands and helping them reach their target audiences through
                authentic, engaging content.
              </p>
              <p className="text-lg text-gray-300 mb-8">
                With a passion for storytelling and a keen eye for aesthetics, I create content
                that resonates, inspires, and drives real results for brands I partner with.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
              >
                Read My Full Story
                <ArrowRight size={20} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Brand Collaborations */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent">
              Featured Collaborations
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Trusted by leading brands across various industries
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {portfolioItems.map((item, index) => (
              <motion.div
                key={item.brand}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                <ImageWithFallback
                  src={item.image}
                  alt={item.brand}
                  className="w-full h-80 object-cover transition-transform group-hover:scale-110 duration-300"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <div className="text-sm text-purple-400 mb-2">{item.category}</div>
                  <h3 className="text-2xl font-bold mb-3">{item.brand}</h3>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Eye size={16} />
                      <span>{item.reach}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp size={16} />
                      <span>{item.engagement}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 rounded-full hover:bg-white/5 transition-all"
            >
              View All Projects
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent">
              What I Offer
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Professional content creation services tailored to your brand's needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 rounded-2xl backdrop-blur-xl border border-white/10 group-hover:border-purple-500/50 transition-all" />
                <div className="relative p-6">
                  <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 mb-4">
                    <service.icon size={24} className="text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-gray-400 text-sm">{service.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              View All Services
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Blog Posts */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent">
              Latest Insights
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Tips, stories, and strategies from my creator journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map((post, index) => (
              <motion.div
                key={post.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 rounded-2xl backdrop-blur-xl border border-white/10 group-hover:border-white/20 transition-all" />
                <div className="relative p-6">
                  <div className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs mb-4">
                    {post.category}
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-purple-400 transition-colors">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 rounded-full hover:bg-white/5 transition-all"
            >
              Read More Articles
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <DashboardPreview />

      {/* Call to Action */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-teal-500/20 rounded-3xl backdrop-blur-xl border border-white/10" />
            <div className="relative p-12">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent">
                Let's Create Something Amazing
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Ready to elevate your brand with authentic, engaging content? Let's discuss
                your next campaign.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                Get In Touch
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}