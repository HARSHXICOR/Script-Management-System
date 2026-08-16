import { motion } from "motion/react";
import { Award, Trophy, Target, Users, TrendingUp, Star } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function About() {
  const timeline = [
    {
      year: "2020",
      title: "The Beginning",
      description: "Started food blogging as a passion project while working full-time",
    },
    {
      year: "2021",
      title: "First Collaboration",
      description: "Partnered with first local restaurant, reaching 10K followers",
    },
    {
      year: "2022",
      title: "Going Full-Time",
      description: "Quit my 9-5 to pursue content creation full-time",
    },
    {
      year: "2023",
      title: "Expanding Horizons",
      description: "Diversified into lifestyle and tech content, hit 100K followers",
    },
    {
      year: "2024",
      title: "Major Partnerships",
      description: "Collaborated with major brands, built a sustainable creator business",
    },
    {
      year: "2025-2026",
      title: "Industry Leader",
      description: "Reached 250K+ followers, mentoring aspiring creators",
    },
  ];

  const achievements = [
    {
      icon: Award,
      title: "Best Food Creator 2024",
      organization: "Digital Creator Awards",
    },
    {
      icon: Trophy,
      title: "Top 100 Influencers",
      organization: "Social Media Magazine",
    },
    {
      icon: Star,
      title: "Featured Creator",
      organization: "Instagram Official",
    },
    {
      icon: Target,
      title: "Campaign Excellence",
      organization: "Marketing Association",
    },
  ];

  const values = [
    {
      icon: Users,
      title: "Authenticity",
      description: "I only partner with brands I genuinely believe in and use myself",
    },
    {
      icon: TrendingUp,
      title: "Quality",
      description: "Every piece of content is crafted with attention to detail and professionalism",
    },
    {
      icon: Star,
      title: "Engagement",
      description: "Building real connections with my audience is at the heart of what I do",
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
              My Story
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto">
              From a passionate food blogger to a full-time content creator helping brands
              tell their stories
            </p>
          </motion.div>
        </div>
      </section>

      {/* Creator Story */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 rounded-3xl blur-2xl opacity-20" />
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmZsdWVuY2VyJTIwcG9ydHJhaXQlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzgwMjQ0OTE3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Sarah Mitchell"
                  className="relative rounded-3xl shadow-2xl"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent">
                Hello, I'm Sarah
              </h2>
              <p className="text-lg text-gray-300">
                My journey as a content creator started in 2020 when I began sharing my love
                for food photography on Instagram. What started as a hobby quickly turned into
                a passion project, and eventually, a full-time career.
              </p>
              <p className="text-lg text-gray-300">
                Today, I work with amazing brands across various industries, helping them
                connect with their target audiences through authentic, engaging content. I
                believe in the power of storytelling and creating content that resonates with
                people on a personal level.
              </p>
              <p className="text-lg text-gray-300">
                When I'm not creating content, you can find me exploring new restaurants,
                experimenting with photography techniques, or mentoring aspiring creators who
                want to make their mark in the digital world.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent">
              My Journey
            </h2>
            <p className="text-lg text-gray-400">
              A timeline of growth, learning, and achievements
            </p>
          </div>

          <div className="space-y-8">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500 via-blue-500 to-teal-500 hidden md:block" />
                <div className="md:pl-12">
                  <div className="relative">
                    <div className="absolute -left-12 top-2 w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hidden md:flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-white" />
                    </div>
                    <div className="bg-gradient-to-br from-white/5 to-white/0 rounded-2xl backdrop-blur-xl border border-white/10 p-6 hover:border-purple-500/50 transition-all">
                      <div className="text-sm text-purple-400 font-bold mb-2">{item.year}</div>
                      <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                      <p className="text-gray-400">{item.description}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent">
              Achievements
            </h2>
            <p className="text-lg text-gray-400">
              Recognition and awards from the industry
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 rounded-2xl backdrop-blur-xl border border-white/10 group-hover:border-amber-500/50 transition-all" />
                <div className="relative p-6 text-center">
                  <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 mb-4">
                    <achievement.icon size={32} className="text-amber-400" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{achievement.title}</h3>
                  <p className="text-sm text-gray-400">{achievement.organization}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent">
              My Values
            </h2>
            <p className="text-lg text-gray-400">
              What drives my work as a creator
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 rounded-2xl backdrop-blur-xl border border-white/10" />
                <div className="relative p-8">
                  <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 mb-4">
                    <value.icon size={24} className="text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{value.title}</h3>
                  <p className="text-gray-400">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Personal Brand Story */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-teal-500/20 rounded-3xl backdrop-blur-xl border border-white/10" />
            <div className="relative p-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent">
                Building a Personal Brand
              </h2>
              <p className="text-lg text-gray-300 mb-4">
                My personal brand is built on three core pillars: authenticity, creativity, and
                community. I believe that in today's digital landscape, people connect with real
                stories and genuine personalities.
              </p>
              <p className="text-lg text-gray-300 mb-4">
                Every collaboration I take on is carefully considered to ensure it aligns with my
                values and resonates with my audience. This approach has helped me build trust
                with both my followers and the brands I work with.
              </p>
              <p className="text-lg text-gray-300">
                Looking ahead, I'm excited to continue growing, learning, and helping brands tell
                their stories in ways that truly connect with people.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
