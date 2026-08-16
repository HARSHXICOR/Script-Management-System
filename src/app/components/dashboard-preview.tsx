import { motion } from "motion/react";
import { LayoutDashboard, User, Briefcase, FileText, MessageSquare, BarChart3 } from "lucide-react";

export function DashboardPreview() {
  const features = [
    {
      icon: User,
      title: "Profile Management",
      description: "Update your creator profile, bio, and social links",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Briefcase,
      title: "Portfolio Management",
      description: "Add and manage your brand collaborations and projects",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: FileText,
      title: "Blog Management",
      description: "Create, edit, and publish blog posts with SEO optimization",
      color: "from-teal-500 to-teal-600",
    },
    {
      icon: MessageSquare,
      title: "Inquiry Management",
      description: "Track and respond to brand collaboration requests",
      color: "from-amber-500 to-amber-600",
    },
  ];

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-purple-900/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-teal-500/20 border border-white/10 mb-6">
              <LayoutDashboard size={20} className="text-purple-400" />
              <span className="text-sm text-gray-300">Dashboard Preview</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent">
              Manage Everything in One Place
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              A powerful dashboard to manage your creator website, portfolio, and brand inquiries
            </p>
          </motion.div>
        </div>

        {/* Dashboard Mockup */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-teal-500/20 rounded-3xl blur-2xl" />
          <div className="relative bg-gradient-to-br from-white/5 to-white/0 rounded-3xl backdrop-blur-xl border border-white/10 p-8">
            {/* Dashboard Header */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <User size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Welcome back, Sarah</h3>
                  <p className="text-sm text-gray-400">Here's your performance overview</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                  <BarChart3 size={20} className="text-teal-400" />
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Views", value: "125K", change: "+12%" },
                { label: "Inquiries", value: "23", change: "+5%" },
                { label: "Active Projects", value: "8", change: "+2%" },
                { label: "Published Posts", value: "45", change: "+8%" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
                  <div className="flex items-end justify-between">
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-xs text-teal-400">{stat.change}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 rounded-xl backdrop-blur-xl border border-white/10 group-hover:border-purple-500/50 transition-all" />
                  <div className="relative p-6">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4`}>
                      <feature.icon size={24} className="text-white" />
                    </div>
                    <h4 className="text-lg font-bold mb-2">{feature.title}</h4>
                    <p className="text-sm text-gray-400">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-400 mb-4">
            Want a website like this for your creator brand?
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-teal-500/20 border border-white/10">
            <span className="text-sm">Powered by xitixr Platform</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
