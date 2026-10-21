import { motion } from 'framer-motion';
import { LogoMark } from './Icons.jsx';

export default function Loader() {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-paper"
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="flex flex-col items-center gap-6">
        <motion.div
          className="relative grid h-24 w-24 place-items-center"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="absolute inset-0 rounded-3xl border-2 border-accent/60"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
          />
          <motion.span
            className="absolute inset-2 rounded-2xl border-2 border-accent2/60"
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
          />
          <LogoMark gradient width={44} height={44} />
        </motion.div>
        <div className="h-1 w-48 overflow-hidden rounded-full bg-line/10">
          <motion.div
            className="h-full bg-gradient-to-r from-accent to-accent2"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
}
