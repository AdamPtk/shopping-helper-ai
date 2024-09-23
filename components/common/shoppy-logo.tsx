import { motion } from "framer-motion";

export default function ShoppyLogo() {
  return (
    <motion.div
      className="relative w-10 h-10 flex items-center"
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"
        variants={{
          hidden: { scale: 0.8, rotate: -180 },
          visible: { scale: 1, rotate: 0, transition: { duration: 0.5 } },
          hover: { scale: 1.1, rotate: 360, transition: { duration: 0.3 } },
        }}
      />
      <motion.div
        className="absolute inset-1 bg-white dark:bg-gray-800 rounded-md flex items-center justify-center"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { delay: 0.2 } },
          hover: { opacity: 0.8 },
        }}
      >
        <span className="text-xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-transparent bg-clip-text">
          S
        </span>
      </motion.div>
      <span className="ml-12 text-transparent bg-clip-text bg-gradient-to-br from-blue-500 to-purple-600 hidden md:inline-block">
        Shoppy
      </span>
    </motion.div>
  );
}
