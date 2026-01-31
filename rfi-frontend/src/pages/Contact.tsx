import { motion, Variants } from 'framer-motion';

const Contact = () => {
  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    }
  };

  const socialVariants: Variants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: { 
        type: "spring" as const,
        stiffness: 200, 
        damping: 15 
      }
    }
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto py-12"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="bg-gray-900 text-white rounded-lg shadow-xl p-8 md:p-12"
        variants={itemVariants}
      >
        <motion.div className="text-center" variants={itemVariants}>
          <h3 className="text-2xl md:text-3xl mb-4 font-mono">
            📍 Melbourne, Victoria, Australia
          </h3>
          <hr className="border-gray-700 mb-6" />
        </motion.div>

        <motion.div className="text-center space-y-4" variants={itemVariants}>
          <h5 className="text-xl md:text-2xl font-semibold">
            We'd love to hear from you!
          </h5>
          <h5 className="text-lg text-gray-300">
            Send us a message and we'll respond as soon as possible
          </h5>
          <p className="text-gray-400 pt-3">
            Thank you for your interest in Rise For Iran. Together, we can make a difference!
          </p>
        </motion.div>

        <motion.div
          className="mt-8 flex justify-center"
          variants={itemVariants}
        >
          <motion.a
            href="mailto:info@riseforiran.org?subject=Website%20Inquiry%20from%20User"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-950 text-white font-bold rounded-lg transition-all hover:bg-gray-800"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fas fa-envelope"></i>
            <span>Send a message</span>
          </motion.a>
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-12 flex justify-center gap-8"
        variants={containerVariants}
      >
        <motion.a
          href="https://www.instagram.com/rise_for_iran/?igsh=OWgybzdpenl6OTUx&utm_source=qr#"
          className="text-[#46A2B9] hover:text-[#5bc0de] transition-colors"
          title="Instagram"
          variants={socialVariants}
          whileHover={{ scale: 1.2, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
        >
          <i className="fa-brands fa-instagram fa-3x"></i>
        </motion.a>
        <motion.a
          href="https://t.me/riseforiran"
          className="text-[#46A2B9] hover:text-[#5bc0de] transition-colors"
          title="Telegram"
          variants={socialVariants}
          whileHover={{ scale: 1.2, rotate: -5 }}
          whileTap={{ scale: 0.9 }}
        >
          <i className="fa-brands fa-telegram fa-3x"></i>
        </motion.a>
      </motion.div>
    </motion.div>
  );
};

export default Contact;
