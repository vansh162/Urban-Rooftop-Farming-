import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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
    <section id="shop" className="scroll-mt-20 py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-forest-green-900 mb-2">
            Shop Products
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
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
                transition={{ delay: idx * 0.05 }}
                className="p-6 rounded-xl border border-forest-green-100 bg-forest-green-50/50 hover:shadow-lg hover:border-forest-green-200 transition-all cursor-pointer group"
              >
                <span className="text-4xl mb-3 block group-hover:scale-110 transition-transform">{cat.icon}</span>
                <h3 className="font-semibold text-forest-green-900">{cat.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{cat.desc}</p>
                <p className="text-sm text-forest-green-600 mt-3 font-medium group-hover:underline">View products →</p>
              </motion.div>
            </Link>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <Link to="/shop" className="btn-primary inline-block">
            Browse all products
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
