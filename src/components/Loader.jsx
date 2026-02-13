"use client"

import { motion } from "motion/react"
import { useEffect, useState } from "react"
import { Heart, Sparkles } from "lucide-react"

export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const isOverload = progress > 100

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 120) {
          clearInterval(timer)
          clearInterval(timer)
          // setTimeout(onComplete, 1500) // Removed auto-complete
          return 120
        }
        // Slow down slightly after 100% for dramatic effect
        const increment = prev >= 100 ? 0.5 : 1.5
        return prev + increment
      })
    }, 60)

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        x: progress === 120 ? [0, -10, 10, -10, 10, 0] : 0, // Shake effect at 120%
      }}
      exit={{ opacity: 0 }}
      transition={{
        opacity: { duration: 0.8 },
        x: { duration: 0.5 }
      }}
      className="min-h-screen flex flex-col items-center justify-center text-white px-6 py-8 overflow-hidden"
    >
      <div className="text-center max-w-md w-full">
        {/* Animated Heart with Sparkles */}
        <div className="relative mb-16">
          <motion.div
            animate={{
              scale: isOverload ? [1, 1.3, 1] : [1, 1.1, 1], // Beating harder on overload
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: isOverload ? 0.5 : 3, // Faster beat on overload
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative"
          >
            <Heart className={`w-24 h-24 ${isOverload ? "text-red-500 drop-shadow-[0_0_35px_rgba(239,68,68,0.8)]" : "text-pink-400 drop-shadow-2xl"} fill-current mx-auto transition-colors duration-500`} />
          </motion.div>

          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                rotate: 360,
                scale: [0.8, 1.2, 0.8],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "linear",
              }}
              className="absolute inset-0"
              style={{ transformOrigin: "center" }}
            >
              <Sparkles
                className={`w-3 h-3 ${isOverload ? "text-red-300" : "text-yellow-300"} absolute transition-colors duration-500`}
                style={{
                  left: `${50 + 35 * Math.cos((i * 90 * Math.PI) / 180)}%`,
                  top: `${50 + 35 * Math.sin((i * 90 * Math.PI) / 180)}%`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            </motion.div>
          ))}
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className={`text-4xl py-1 font-bold ${isOverload ? "text-red-400 animate-pulse scale-110" : "bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent"} transition-all duration-500`}>
              {isOverload ? "Cuteness Overload... 😍" : "Loading your Cuteness..."}
            </h1>

            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="text-lg text-pink-200 tracking-wide"
            >
              {isOverload ? "Hold on, it's too much! 💥" : <span>A beautiful surprise is loading ...<span className="text-pink-100">💫</span></span>}
            </motion.p>
          </div>

          <div className="space-y-4">
            {/* Progress bar */}
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/20">
              <motion.div
                className={`h-full rounded-full relative transition-colors duration-500 ${isOverload ? "bg-gradient-to-r from-red-500 to-pink-600" : "bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400"}`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 120)}%` }} // Cap visual width or let it overflow? transform-based width handles >100% fine visually but let's just let it fill
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent animate-pulse"></div>
              </motion.div>
            </div>

            <p className={`${isOverload ? "text-red-400 font-bold scale-110" : "text-pink-300 font-medium"} text-lg tracking-wider transition-all duration-300`}>
              {Math.round(progress)}%
            </p>
          </div>

          {/* Tap to Open Button */}
          {progress >= 120 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12"
            >
              <button
                onClick={onComplete}
                className="bg-white text-pink-500 px-8 py-4 rounded-full font-bold text-xl shadow-lg hover:scale-105 active:scale-95 transition-all animate-bounce"
              >
                Tap to Open 💌
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
