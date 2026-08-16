import { motion } from "motion/react";
import { Instagram, Camera, Package, Calendar, Megaphone, MapPin, CheckCircle } from "lucide-react";
import { Link } from "react-router";

export function Services() {
  const services = [
    {
      icon: Instagram,
      title: "Instagram Story Promotion",
      description: "Engage your audience with compelling 24-hour story features",
      features: [
        "Professional story design",
        "Swipe-up links (if available)",
        "Multiple story slides",
        "Behind-the-scenes content",
        "Story highlights inclusion",
        "Engagement tracking and analytics",
      ],
      pricing: "Starting at $500",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Camera,
      title: "Instagram Reel Promotion",
      description: "Create viral-worthy reels with professional editing and trending audio",
      features: [
        "Professional video editing",
        "Trending audio selection",
        "Hook optimization",
        "Call-to-action integration",
        "30-60 second format",
        "Post-promotion insights",
      ],
      pricing: "Starting at $800",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Package,
      title: "Product Review",
      description: "Authentic, detailed product reviews that drive purchasing decisions",
      features: [
        "Unboxing content",
        "Detailed product photography",
        "Honest feature breakdown",
        "Usage demonstrations",
        "Comparison content",
        "Recommendation rating",
      ],
      pricing: "Starting at $600",
      color: "from-teal-500 to-teal-600",
    },
    {
      icon: Calendar,
      title: "Event Coverage",
      description: "Comprehensive live event coverage with real-time updates",
      features: [
        "Live story updates",
        "Professional event photography",
        "Highlight reel creation",
        "Behind-the-scenes access",
        "Speaker/moment captures",
        "Post-event recap content",
      ],
      pricing: "Starting at $1,200",
      color: "from-amber-500 to-amber-600",
    },
    {
      icon: Megaphone,
      title: "Brand Promotion",
      description: "Multi-platform brand awareness campaigns",
      features: [
        "Cross-platform content",
        "Brand storytelling",
        "Multiple touchpoints",
        "Audience insights",
        "Content calendar planning",
        "Performance reporting",
      ],
      pricing: "Starting at $1,500",
      color: "from-rose-500 to-rose-600",
    },
    {
      icon: MapPin,
      title: "Local Marketing",
      description: "Targeted local business promotion and community engagement",
      features: [
        "Location-based content",
        "Community engagement",
        "Local SEO optimization",
        "Geo-tagged posts",
        "Local partnership features",
        "Neighborhood storytelling",
      ],
      pricing: "Starting at $700",
      color: "from-emerald-500 to-emerald-600",
    },
  ];

  const process = [
    {
      step: "01",
      title: "Consultation",
      description: "We discuss your brand goals, target audience, and campaign objectives",
    },
    {
      step: "02",
      title: "Strategy",
      description: "I create a customized content strategy aligned with your brand",
    },
    {
      step: "03",
      title: "Creation",
      description: "Professional content creation with attention to detail and quality",
    },
    {
      step: "04",
      title: "Delivery",
      description: "Content goes live with optimal timing for maximum engagement",
    },
    {
      step: "05",
      title: "Analytics",
      description: "Detailed performance report with insights and recommendations",
    },
  ];

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
              Services
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto">
              Professional content creation services designed to elevate your brand and
              engage your audience
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 rounded-2xl backdrop-blur-xl border border-white/10 group-hover:border-white/20 transition-all" />
                <div className="relative p-8">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${service.color} mb-6`}>
                    <service.icon size={32} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                  <p className="text-gray-400 mb-6">{service.description}</p>
                  
                  <div className="space-y-3 mb-6">
                    {service.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-2">
                        <CheckCircle size={20} className="text-teal-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-white/10">
                    <div className="text-sm text-gray-400 mb-2">Investment</div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent">
                      {service.pricing}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent">
              My Process
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              A streamlined approach to delivering exceptional results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {process.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 rounded-2xl backdrop-blur-xl border border-white/10" />
                <div className="relative p-6 text-center">
                  <div className="text-5xl font-bold bg-gradient-to-br from-purple-500 to-teal-500 bg-clip-text text-transparent mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Work With Me */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent">
              Why Work With Me?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Proven Track Record",
                description: "150+ successful brand collaborations with measurable results",
              },
              {
                title: "Authentic Engagement",
                description: "8.5% average engagement rate, well above industry standards",
              },
              {
                title: "Professional Quality",
                description: "High-quality content creation with attention to detail",
              },
              {
                title: "Data-Driven Insights",
                description: "Comprehensive analytics and performance reporting",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 rounded-2xl backdrop-blur-xl border border-white/10" />
                <div className="relative p-6">
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
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
                Ready to Get Started?
              </h2>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                Let's discuss your brand goals and create a custom content strategy
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                Request a Quote
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
