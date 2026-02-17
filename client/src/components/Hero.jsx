import { motion } from "framer-motion";
import { Leaf, ArrowRight, Sparkles } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero bg-leaf-pattern">
      {/* Organic blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.2, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-forest-green-400 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.12, 0.18, 0.12] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/3 translate-y-1/3 rounded-full bg-wood-400 blur-3xl"
        />
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-forest-green-200/40 blur-3xl"
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 pb-28 pt-4">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div variants={item} className="mb-8">
            <motion.div
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-forest-green-600 shadow-organic"
            >
              <Leaf className="w-12 h-12 text-white drop-shadow-sm" strokeWidth={1.5} />
            </motion.div>
          </motion.div>

          <motion.div variants={item} className="mb-4 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-forest-green-200 bg-white/80 px-4 py-2 text-sm font-medium text-forest-green-700 shadow-soft backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-forest-green-500" />
              Urban Rooftop Farming
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="font-display text-5xl font-bold tracking-tight text-forest-green-900 sm:text-6xl lg:text-7xl xl:text-8xl leading-[1.1] mb-6"
          >
            Transform Your
            <br />
            <span className="bg-gradient-to-r from-forest-green-600 to-forest-green-500 bg-clip-text text-transparent">
              top
            </span>
            <br />
            <span className="text-forest-green-700">Into a Green Oasis</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto max-w-2xl text-lg sm:text-xl text-forest-green-700/90 leading-relaxed mb-10"
          >
            Leafinity brings expert-designed systems and premium products to your doorstep. Grow fresh, organic produce with installation, maintenance, and harvest support.
          </motion.p>

          <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.a
              href="#booking"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary text-lg px-8 py-4 gap-2"
            >
              Get Your Quote
              <ArrowRight className="w-5 h-5" />
            </motion.a>
            <motion.a
              href="#shop"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="btn-secondary text-lg px-8 py-4"
            >
              Shop Products
            </motion.a>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-16 mb-6 flex flex-wrap justify-center gap-3"
          >
            {["Expert Installation", "Monthly Maintenance", "Harvest Support"].map((feature, idx) => (
              <motion.span
                key={feature}
                whileHover={{ scale: 1.05, y: -2 }}
                className="rounded-2xl border border-forest-green-200/80 bg-white/90 px-5 py-2.5 text-sm font-semibold text-forest-green-700 shadow-soft backdrop-blur-sm"
              >
                {feature}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-forest-green-500/60"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="mt-2 h-2 w-1 rounded-full bg-forest-green-500"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
