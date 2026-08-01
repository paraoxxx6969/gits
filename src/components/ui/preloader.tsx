"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import gitsLogo from "@/assets/gits-logo.jpg"

const words = ["Hello", "Bonjour", "Ciao", "Olà", "やあ", "Hallå", "Guten tag", "হ্যালো"]

const opacity = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 0.75,
    transition: { duration: 1, delay: 0.2 },
  },
}
const slideUp = {
  initial: {
    top: 0,
  },
  exit: {
    top: "-100vh",
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 },
  },
}

const logoReveal = {
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  enter: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
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
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
      d: targetPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.3 },
    },
  }


  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      animate={isExiting ? "exit" : "initial"}
      className="fixed inset-0 w-screen h-screen flex flex-col items-center justify-center bg-black z-[99999999999]"
    >
      {dimension.width > 0 && (
        <>
          {/* Logo */}
          <motion.div
            variants={logoReveal}
            initial="initial"
            animate="enter"
            className="absolute z-10 flex flex-col items-center"
            style={{ marginBottom: '2rem' }}
          >
            <img
              src={gitsLogo}
              alt="GITS Tech Club"
              className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover mb-6"
              style={{ boxShadow: '0 0 40px rgba(0, 242, 254, 0.3)' }}
            />
            <motion.p
              variants={opacity}
              initial="initial"
              animate="enter"
              className="flex items-center text-white text-4xl md:text-5xl lg:text-6xl z-10 font-medium"
            >
              <span className="block w-2.5 h-2.5 bg-white rounded-full mr-2.5"></span>
              {words[index]}
            </motion.p>
          </motion.div>
          <svg className="absolute top-0 w-full h-[calc(100%+300px)]">
            <motion.path variants={curve} initial="initial" animate={isExiting ? "exit" : "initial"} fill="#070b13" />
          </svg>
        </>
      )}
    </motion.div>
  );
}
