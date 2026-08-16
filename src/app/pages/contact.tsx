import { motion } from "motion/react";
import { Mail, Phone, MapPin, Instagram, Twitter, Linkedin, Youtube, Send } from "lucide-react";
import { useState } from "react";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    brandName: "",
    budget: "",
    requirements: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    alert("Thank you for your inquiry! I'll get back to you within 24 hours.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      brandName: "",
      budget: "",
      requirements: "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "hello@sarahmitchell.com",
      href: "mailto:hello@sarahmitchell.com",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+1 (555) 123-4567",
      href: "tel:+15551234567",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Los Angeles, CA",
      href: null,
    },
  ];

  const socialLinks = [
    { icon: Instagram, label: "Instagram", href: "https://instagram.com", username: "@sarahmitchell" },
    { icon: Twitter, label: "Twitter", href: "https://twitter.com", username: "@sarahmitchell" },
    { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com", username: "Sarah Mitchell" },
    { icon: Youtube, label: "YouTube", href: "https://youtube.com", username: "Sarah Mitchell" },
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
              Let's Connect
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto">
              Ready to create something amazing together? Let's discuss your brand goals
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-1 space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent">
                  Get in Touch
                </h2>
                <p className="text-gray-400 mb-8">
                  I typically respond within 24 hours. For urgent inquiries, please reach out
                  via phone or Instagram DM.
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-4">
                {contactInfo.map((info) => (
                  <div key={info.label} className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 rounded-xl backdrop-blur-xl border border-white/10" />
                    <div className="relative p-4 flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                        <info.icon size={20} className="text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-400 mb-1">{info.label}</div>
                        {info.href ? (
                          <a
                            href={info.href}
                            className="text-white hover:text-purple-400 transition-colors"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <div className="text-white">{info.value}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-xl font-bold mb-4">Follow Me</h3>
                <div className="grid grid-cols-2 gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 rounded-xl backdrop-blur-xl border border-white/10 group-hover:border-purple-500/50 transition-all" />
                      <div className="relative p-4 flex items-center gap-3">
                        <social.icon size={20} className="text-purple-400" />
                        <div className="flex-1">
                          <div className="text-sm font-bold">{social.label}</div>
                          <div className="text-xs text-gray-400">{social.username}</div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 rounded-2xl backdrop-blur-xl border border-white/10" />
                <div className="relative p-8">
                  <h3 className="text-2xl font-bold mb-6">Brand Inquiry Form</h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm text-gray-400 mb-2">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 focus:outline-none transition-all"
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm text-gray-400 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 focus:outline-none transition-all"
                          placeholder="john@company.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="block text-sm text-gray-400 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 focus:outline-none transition-all"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>

                      <div>
                        <label htmlFor="brandName" className="block text-sm text-gray-400 mb-2">
                          Brand Name *
                        </label>
                        <input
                          type="text"
                          id="brandName"
                          name="brandName"
                          required
                          value={formData.brandName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 focus:outline-none transition-all"
                          placeholder="Your Brand"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="budget" className="block text-sm text-gray-400 mb-2">
                        Budget Range *
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        required
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 focus:outline-none transition-all"
                      >
                        <option value="">Select your budget range</option>
                        <option value="under-1000">Under $1,000</option>
                        <option value="1000-2500">$1,000 - $2,500</option>
                        <option value="2500-5000">$2,500 - $5,000</option>
                        <option value="5000-10000">$5,000 - $10,000</option>
                        <option value="over-10000">Over $10,000</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="requirements" className="block text-sm text-gray-400 mb-2">
                        Campaign Requirements *
                      </label>
                      <textarea
                        id="requirements"
                        name="requirements"
                        required
                        value={formData.requirements}
                        onChange={handleChange}
                        rows={6}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 focus:outline-none transition-all resize-none"
                        placeholder="Tell me about your brand, campaign goals, target audience, and any specific requirements..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2"
                    >
                      <Send size={20} />
                      <span>Send Inquiry</span>
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "What's your typical turnaround time?",
                answer:
                  "Most projects are completed within 1-2 weeks from initial consultation to content delivery. Rush projects can be accommodated for an additional fee.",
              },
              {
                question: "Do you work with small businesses?",
                answer:
                  "Absolutely! I work with businesses of all sizes, from local startups to established brands. My packages are flexible to suit different budgets.",
              },
              {
                question: "What industries do you specialize in?",
                answer:
                  "I have experience in food & beverage, lifestyle, fashion, technology, and wellness. However, I'm always open to exploring new industries.",
              },
              {
                question: "How do you measure campaign success?",
                answer:
                  "I provide detailed analytics including reach, engagement rate, impressions, and conversions. Post-campaign reports are included in all packages.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 rounded-xl backdrop-blur-xl border border-white/10" />
                <div className="relative p-6">
                  <h3 className="text-lg font-bold mb-2">{faq.question}</h3>
                  <p className="text-gray-400">{faq.answer}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
