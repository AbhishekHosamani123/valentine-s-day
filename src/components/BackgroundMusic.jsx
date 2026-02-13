import { useEffect, useRef, forwardRef, useImperativeHandle, useState } from "react"
import { Music, Volume2, VolumeX } from "lucide-react"

const BackgroundMusic = forwardRef(({ src }, ref) => {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.6 // Default volume
      const playPromise = audioRef.current.play()

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true)
          })
          .catch((error) => {
            console.log("Autoplay prevented:", error)
            setIsPlaying(false)
          })
      }
    }
  }, [src])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  useImperativeHandle(ref, () => ({
    pause: () => {
      if (audioRef.current) {
        audioRef.current.pause()
        setIsPlaying(false)
      }
    },
    resume: () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play()
        setIsPlaying(true)
      }
    },
  }))

  return (
    <div className="fixed bottom-4 left-4 z-50 flex gap-2">
      <audio ref={audioRef} loop src={src || "/HB.mp3"} />

      <button
        onClick={togglePlay}
        className={`p-3 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 ${isPlaying
            ? "bg-pink-500/80 text-white hover:bg-pink-600"
            : "bg-white/20 text-white hover:bg-white/30 animate-pulse"
          }`}
      >
        <Music className={`w-6 h-6 ${isPlaying ? "animate-spin-slow" : ""}`} />
      </button>

      {isPlaying && (
        <button
          onClick={toggleMute}
          className="p-3 rounded-full bg-black/20 text-white/80 hover:bg-black/40 backdrop-blur-sm transition-all"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      )}
    </div>
  )
})

export default BackgroundMusic
