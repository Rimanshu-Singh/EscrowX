"use client"

import React, { useRef, MouseEvent } from "react"
import { motion, useMotionTemplate, useMotionValue } from "framer-motion"
import { cn } from "@/lib/utils"

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  className?: string
  spotlightColor?: string
  borderColor?: string
  size?: number
}

export function SpotlightCard({
  children,
  className,
  spotlightColor = "rgba(16, 185, 129, 0.08)",
  borderColor = "rgba(16, 185, 129, 0.2)",
  size = 250,
  ...props
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return
    const { left, top } = cardRef.current.getBoundingClientRect()
    mouseX.set(e.clientX - left)
    mouseY.set(e.clientY - top)
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative rounded-3xl border border-white/[0.06] bg-[#111111] overflow-hidden group/spotlight",
        className
      )}
      {...props}
    >
      {/* Background Spotlight Glow */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-500 group-hover/spotlight:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              ${size}px circle at ${mouseX}px ${mouseY}px,
              ${spotlightColor},
              transparent 80%
            )
          `,
        }}
      />
      
      {/* Border Spotlight Glow */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-500 group-hover/spotlight:opacity-100 z-10"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              ${size / 1.2}px circle at ${mouseX}px ${mouseY}px,
              ${borderColor},
              transparent 80%
            )
          `,
          padding: "1px",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      <div className="relative z-20 h-full w-full">{children}</div>
    </div>
  )
}
