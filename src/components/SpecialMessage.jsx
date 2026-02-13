"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "motion/react"
import { Heart, ArrowRight } from "lucide-react"

export default function SpecialMessage({ onComplete, message }) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showButton, setShowButton] = useState(false)
  const [showCursor, setShowCursor] = useState(true)
  const messageRef = useRef(null)

  // Use custom message if provided, otherwise use default
  const fullMessage = message || `My Dearest Lovely Radhe😘,\n\nNavu 1st time bheti aadaga ansir lill "one day you will become this much special for me" , Hudgir andr na aggde iro nan hantvn life olg Boss ii muddud Gubbee na yk kalsidro eno 🥰. You walked into my world like a beautiful angel🧚, bringing light to places I didn't even know were dark.\n \nNin jote matad ta idra time hogid an gott aago dill nod . Your smile brightens my darkest days, your laugh is the sweetest melody I've ever heard, and your love is the greatest gift I could ever receive.\n[[GIF]]\nNin Cute Cute 😚 aagi sitt madkondaga yest cuteeeeee😘 kanti gottu, yest khusi aagtada gottu 🤭. Hing helateni anta murr hottu sitt madkond an irbyad mt 👊😁.\n\nOnce again Happyest Birthady My dear Gubbi Mari 😘.\nWith all my love,\nYour devoted heart 💕`;


  useEffect(() => {
    if (currentIndex < fullMessage.length) {
      const timer = setTimeout(() => {
        setDisplayedText(fullMessage.slice(0, currentIndex + 1))
        setCurrentIndex(currentIndex + 1)

        // Auto scroll to bottom as text appears
        if (messageRef.current) {
          messageRef.current.scrollTop = messageRef.current.scrollHeight
        }
      }, 20)
      return () => clearTimeout(timer)
    } else {
      setShowCursor(false)
      setTimeout(() => setShowButton(true), 1000)
    }
  }, [currentIndex, fullMessage])

  // Split the displayedText at the GIF placeholder
  const [beforeGif, afterGif] = displayedText.split("[[GIF]]")
  const gifShouldShow = displayedText.includes("[[GIF]]")

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen flex flex-col justify-center text-white px-4 py-4 md:px-6 md:py-6"
    >
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: showButton ? -6 : 0 }}
        className="flex flex-col max-w-4xl mx-auto w-full">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 md:p-8 lg:p-12 border border-white/10 shadow-2xl">
          <div className="text-center mb-6">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Heart className="w-10 h-10 md:w-12 md:h-12 text-pink-400 fill-current mx-auto" />
            </motion.div>
          </div>

          <div
            ref={messageRef}
            className="max-h-[60vh] overflow-y-auto pr-2 scroll-smooth transition-all duration-500"
          >
            <pre className="text-base md:text-lg lg:text-xl font-light leading-relaxed whitespace-pre-line text-pink-100 text-left">
              {beforeGif}
              {gifShouldShow && (
                <div className="flex justify-center my-4">
                  <img src="/angry.gif" alt="Angry Gif" className="w-32 h-32 md:w-40 md:h-40 object-contain" />
                </div>
              )}
              {afterGif}
              {currentIndex < fullMessage.length && showCursor && (
                <span className="inline-block w-0.5 h-4 md:h-5 bg-pink-400 ml-1 animate-pulse"></span>
              )}
            </pre>
          </div>
        </div>

        {showButton && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-center mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onComplete}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 md:px-10 py-4 rounded-full font-semibold text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-1 md:gap-2">
                <Heart className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                Sweet Memories
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}
