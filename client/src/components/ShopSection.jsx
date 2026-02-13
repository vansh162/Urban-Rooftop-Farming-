import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, ArrowRight } from "lucide-react";

const categories = [
  { name: "Containers", slug: "containers", desc: "UV grow bags, ceramic & mud pots", icon: "🪴" },
  { name: "Growing Media", slug: "growing-media", desc: "Potting mix, cocopeat, vermicompost", icon: "🌱" },
  { name: "Irrigation & Tech", slug: "irrigation-tech", desc: "Drip kits, NFT systems, smart timers", icon: "💧" },
  { name: "Vertical Gardening", slug: "vertical-gardening", desc: "Frames, trellis nets", icon: "📐" },
  { name: "Pest Management", slug: "pest-management", desc: "Neem oil, sticky traps", icon: "🛡️" },
  { name: "Monitoring", slug: "monitoring-tools", desc: "pH & moisture meters, clay pebbles", icon: "📊" },
];

export default function ShopSection() {
  return (
    <section id="shop" className="scroll-mt-24 py-24 bg-gradient-organic">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-forest-green-100 px-4 py-2 text-sm font-semibold text-forest-green-700 mb-4">
            <Leaf className="w-4 h-4" />
            Product catalog
          </span>
          <h2 className="font-display text-4xl font-bold text-forest-green-900 sm:text-5xl mb-4">
            Shop Products
          </h2>
          <p className="text-forest-green-700/90 max-w-2xl mx-auto text-lg">
            Everything you need for urban rooftop farming — from containers to smart irrigation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <Link key={cat.name} to={`/shop?category=${cat.slug}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="card-organic group p-8 h-full flex flex-col"
              >
                <span className="text-5xl mb-4 block transition-transform duration-300 group-hover:scale-110">
                  {cat.icon}
                </span>
                <h3 className="font-display text-xl font-bold text-forest-green-900 mb-2">{cat.name}</h3>
                <p className="text-forest-green-700/80 text-sm flex-1">{cat.desc}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-forest-green-600 group-hover:gap-3 transition-all">
                  View products
                  <ArrowRight className="w-4 h-4" />
                </span>
              </motion.div>
            </Link>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to="/shop" className="btn-primary inline-flex gap-2">
            Browse all products
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
