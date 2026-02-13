"use client"

import { motion } from "motion/react"
import { Swiper, SwiperSlide } from "swiper/react"
import { EffectFlip, Navigation, Pagination } from "swiper/modules"
import { Heart, ArrowRight, Camera } from "lucide-react"
import Image from "next/image"

import "swiper/css"
import "swiper/css/effect-flip"
import "swiper/css/navigation"
import "swiper/css/pagination"

export default function PhotoGallery({ onComplete, photos }) {
  const defaultPhotos = [
    "/1.jpg",
    "/2.jpg",
    "/3.jpg",
    "/4.jpg",
    "/5.jpg",
    "/6.jpg",
    "/7.jpg",
    "/8.jpg",
    "/9.jpg",
    "/10.jpg",
    // Insert video at the correct order (after 10.jpg, before 12.jpg)
    "/11.mp4",
    "/12.jpg",
    "/13.jpg",
    "/14.jpg",
    "/15.jpg",
  ]

  // Use provided photos or fallback to default
  // Ensure photos is an array and has items, otherwise use default
  const galleryItems = (photos && photos.length > 0) ? photos : defaultPhotos;


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen flex flex-col items-center justify-center text-white px-4 py-6 md:px-6 md:py-8"
    >
      <div className="w-full max-w-4xl flex flex-col justify-center space-y-8 md:space-y-12">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center space-y-4 md:space-y-6"
        >
          <motion.div
            animate={{
              rotate: [0, 8, -8, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <Camera className="w-12 h-12 md:w-16 md:h-16 text-pink-400 mx-auto drop-shadow-lg" />
          </motion.div>
          <div className="space-y-3 md:space-y-4">
            <h2 className="text-3xl md:text-4xl py-1 font-bold bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
              Our Beautiful Journey
            </h2>
            <motion.p
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="text-pink-200 text-lg md:text-xl"
            >
              Every moment with you is a treasure✨
            </motion.p>
          </div>
        </motion.div>

        <div className="w-full max-w-sm md:max-w-md mx-auto">
          <Swiper
            effect="flip"
            grabCursor={true}
            pagination={{ clickable: true }}
            navigation={true}
            modules={[EffectFlip, Navigation, Pagination]}
            speed={600}
            className="w-80 h-95 md:w-85 md:h-100"
          >
            {galleryItems.map((item, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="bg-white/10 backdrop-blur-xl rounded-3xl p-3 md:p-4 border border-white/20 shadow-2xl h-full relative overflow-hidden group"
                >
                  <div className="relative h-full rounded-2xl overflow-hidden flex items-center justify-center">
                    {item.endsWith('.mp4') ? (
                      <video
                        src={item}
                        controls
                        className="object-contain h-full w-full rounded-2xl"
                        style={{ aspectRatio: '1/1' }}
                      />
                    ) : (
                      <img
                        src={item}
                        alt={`Memory ${index + 1}`}
                        className="object-cover h-full w-full transition-transform duration-500 group-hover:scale-105 rounded-2xl"
                        style={{ aspectRatio: '1/1' }}
                      />
                    )}
                    {/* Floating hearts on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{
                            y: [0, -40],
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0],
                            rotate: [0, 360],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: i * 0.3,
                          }}
                          className="absolute"
                          style={{
                            left: `${20 + i * 15}%`,
                            bottom: "20%",
                          }}
                        >
                          <Heart className="w-3 h-3 md:w-4 md:h-4 text-pink-300 fill-current" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <p className="text-center text-white/80 text-base md:text-lg mt-4 font-light">
          Thank you for being part of my story💖
        </p>

      </div>
      <div
        className="mt-8 px-8 py-4 bg-white/10 text-pink-200 rounded-2xl font-semibold text-lg backdrop-blur-sm border border-white/20 inline-block text-center z-50 relative"
      >
        To be continued... ❤️
      </div>
    </motion.div >
  )
}
