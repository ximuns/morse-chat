import { motion } from 'motion/react'

function AnimatedScreen({ children, className = '', ...props }) {
  return (
    <motion.div
      className={`scene ${className}`}
      initial={{
        opacity: 0,
        scale: 0.86,
        filter: 'blur(12px)',
      }}
      animate={{
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
      }}
      exit={{
        opacity: 0,
        scale: 1.12,
        filter: 'blur(7px)',
      }}
      transition={{
        duration: 0.8,
        ease: [0.16, 0.5, 0.3, 1],
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default AnimatedScreen
