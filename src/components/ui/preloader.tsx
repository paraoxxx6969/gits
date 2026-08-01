"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

// "Welcome" translated into different languages.
// The suffix ("to GITS") stays fixed while this word cycles.
const words = [
  "Welcome",
  "Bienvenue",
  "Benvenuto",
  "Bienvenido",
  "ようこそ",
  "Välkommen",
  "Willkommen",
  "স্বাগতম",
  "स्वागत है",
  "स्वागत आहे",
]

const opacity = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 0.85,
    transition: { duration: 1, delay: 0.2 },
  },
}
const slideUp = {
  initial: {
    top: 0,
  },
  exit: {
    top: "-100vh",
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const, delay: 0.2 },
  },
}

interface PreloaderProps {
  onComplete?: () => void
}

export default function Preloader({ onComplete }: PreloaderProps) {

  const [index, setIndex] = useState(0)
  const [dimension, setDimension] = useState({ width: 0, height: 0 })
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    setDimension({ width: window.innerWidth, height: window.innerHeight })
  }, [])

  useEffect(() => {
    if (index === words.length - 1) {
      // Start exit animation after showing the last word
      setTimeout(() => {
        setIsExiting(true)
        // Call onComplete after exit animation
        setTimeout(() => {
          onComplete?.()
        }, 1000)
      }, 1000)
      return
    }

    setTimeout(
      () => {
        setIndex(index + 1)
      },
      index === 0 ? 1000 : 150,
    )
  }, [index, onComplete])

  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 300} 0 ${dimension.height} L0 0`
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height} L0 0`

  const curve = {
    initial: {
      d: initialPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] as const },
    },
    exit: {
      d: targetPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] as const, delay: 0.3 },
    },
  }

  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      animate={isExiting ? "exit" : "initial"}
      className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-black z-[99999999999]"
    >
      <style>{`
        @keyframes gitsShine {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {dimension.width > 0 && (
        <>
          <motion.p
            variants={opacity}
            initial="initial"
            animate="enter"
            className="flex items-center text-white text-4xl md:text-5xl lg:text-6xl absolute z-10 font-normal tracking-normal"
          >
            {/* Glowing neon pulse dot */}
            <span
              className="block w-3 h-3 rounded-full mr-4"
              style={{
                background: '#00f2fe',
                boxShadow: '0 0 16px #00f2fe, 0 0 30px rgba(0, 242, 254, 0.8)',
              }}
            />

            {/* "Welcome to " — Clean white, normal weight, NOT capitalized/uppercase */}
            <span
              style={{
                fontWeight: 400,
                color: '#ffffff',
                opacity: 0.95,
                textTransform: 'none',
              }}
            >
              {words[index]}&nbsp;to&nbsp;
            </span>

            {/* "GITS" — BOLD, CAPITAL (UPPERCASE), with Up-Shining vibrant contrast gradient & glow */}
            <span
              style={{
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                background: 'linear-gradient(120deg, #00f2fe 0%, #ff007f 45%, #ffe600 80%, #00f2fe 100%)',
                backgroundSize: '220% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'gitsShine 2.5s ease-in-out infinite',
                filter: 'drop-shadow(0 0 20px rgba(0, 242, 254, 0.9)) drop-shadow(0 0 35px rgba(255, 0, 127, 0.7))',
              }}
            >
              GITS
            </span>
          </motion.p>
          <svg className="absolute top-0 w-full h-[calc(100%+300px)]">
            <motion.path variants={curve} initial="initial" animate={isExiting ? "exit" : "initial"} fill="#070b13" />
          </svg>
        </>
      )}
    </motion.div>
  )
}
