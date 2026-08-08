"use client"

import React, { useEffect, useRef, useCallback } from "react"
import createGlobe from "cobe"

export function Globe({
  markers = [],
  arcs = [],
  className = "",
  markerColor = [0.3, 0.45, 0.85],
  baseColor = [1, 1, 1],
  arcColor = [0.3, 0.45, 0.85],
  glowColor = [0.94, 0.93, 0.91],
  dark = 0,
  mapBrightness = 10,
  markerSize = 0.025,
  markerElevation = 0.01,
  arcWidth = 0.5,
  arcHeight = 0.25,
  speed = 0.003,
  theta = 0.2,
  diffuse = 1.5,
  mapSamples = 16000,
}) {
  const canvasRef = useRef(null)
  const pointerInteracting = useRef(null)
  const lastPointer = useRef(null)
  const dragOffset = useRef({ phi: 0, theta: 0 })
  const velocity = useRef({ phi: 0, theta: 0 })
  const phiOffsetRef = useRef(0)
  const thetaOffsetRef = useRef(0)
  const isPausedRef = useRef(false)

  // Keep changing config options in a Ref to avoid WebGL context recreation on every render/scroll
  const configRef = useRef(null)
  configRef.current = {
    markers,
    arcs,
    markerColor,
    baseColor,
    arcColor,
    glowColor,
    dark,
    mapBrightness,
    markerSize,
    markerElevation,
    arcWidth,
    arcHeight,
    speed,
    theta,
    diffuse,
    mapSamples,
  }

  const handlePointerDown = useCallback(
    (e) => {
      pointerInteracting.current = { x: e.clientX, y: e.clientY }
      if (canvasRef.current) canvasRef.current.style.cursor = "grabbing"
      isPausedRef.current = true
    },
    []
  )

  const handlePointerMove = useCallback((e) => {
    if (pointerInteracting.current !== null) {
      const deltaX = e.clientX - pointerInteracting.current.x
      const deltaY = e.clientY - pointerInteracting.current.y
      dragOffset.current = { phi: deltaX / 300, theta: deltaY / 1000 }
      const now = Date.now()
      if (lastPointer.current) {
        const dt = Math.max(now - lastPointer.current.t, 1)
        const maxVelocity = 0.15
        velocity.current = {
          phi: Math.max(
            -maxVelocity,
            Math.min(maxVelocity, ((e.clientX - lastPointer.current.x) / dt) * 0.3)
          ),
          theta: Math.max(
            -maxVelocity,
            Math.min(maxVelocity, ((e.clientY - lastPointer.current.y) / dt) * 0.08)
          ),
        }
      }
      lastPointer.current = { x: e.clientX, y: e.clientY, t: now }
    }
  }, [])

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi
      thetaOffsetRef.current += dragOffset.current.theta
      dragOffset.current = { phi: 0, theta: 0 }
      lastPointer.current = null
    }
    pointerInteracting.current = null
    if (canvasRef.current) canvasRef.current.style.cursor = "grab"
    isPausedRef.current = false
  }, [])

  useEffect(() => {
    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("pointerup", handlePointerUp, { passive: true })
    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
    }
  }, [handlePointerMove, handlePointerUp])

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    let globe = null
    let animationId
    let phi = 0
    let isVisible = true

    // Pause WebGL rendering loop when canvas is offscreen to save mobile battery and prevent scroll lag
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
      },
      { threshold: 0.05 }
    )
    observer.observe(canvas)

    function init() {
      const width = canvas.offsetWidth
      if (width === 0 || globe) return

      const isMobile = window.innerWidth < 768
      const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5)
      const cfg = configRef.current
      try {
        globe = createGlobe(canvas, {
          devicePixelRatio: dpr,
          width,
          height: width,
          phi: 0,
          theta: cfg.theta,
          dark: cfg.dark,
          diffuse: cfg.diffuse,
          mapSamples: isMobile ? 8000 : cfg.mapSamples,
          mapBrightness: cfg.mapBrightness,
          baseColor: cfg.baseColor,
          markerColor: cfg.markerColor,
          glowColor: cfg.glowColor,
          markerElevation: cfg.markerElevation,
          markers: cfg.markers.map((m) => ({
            location: m.location,
            size: cfg.markerSize,
            id: m.id,
          })),
          arcs: cfg.arcs.map((a) => ({
            from: a.from,
            to: a.to,
            id: a.id,
          })),
          arcColor: cfg.arcColor,
          arcWidth: cfg.arcWidth,
          arcHeight: cfg.arcHeight,
          opacity: 0.7,
        })
      } catch (error) {
        console.error("Failed to initialize Cobe 3D Globe WebGL context:", error)
        return
      }

      function animate() {
        if (!globe) return
        if (!isVisible) {
          animationId = requestAnimationFrame(animate)
          return
        }
        const currentCfg = configRef.current
        if (!isPausedRef.current) {
          phi += currentCfg.speed
          if (
            Math.abs(velocity.current.phi) > 0.0001 ||
            Math.abs(velocity.current.theta) > 0.0001
          ) {
            phiOffsetRef.current += velocity.current.phi
            thetaOffsetRef.current += velocity.current.theta
            velocity.current.phi *= 0.95
            velocity.current.theta *= 0.95
          }
          const thetaMin = -0.4,
            thetaMax = 0.4
          if (thetaOffsetRef.current < thetaMin) {
            thetaOffsetRef.current += (thetaMin - thetaOffsetRef.current) * 0.1
          } else if (thetaOffsetRef.current > thetaMax) {
            thetaOffsetRef.current += (thetaMax - thetaOffsetRef.current) * 0.1
          }
        }
        
        try {
          if (globe) {
            globe.update({
              phi: phi + phiOffsetRef.current + dragOffset.current.phi,
              theta: currentCfg.theta + thetaOffsetRef.current + dragOffset.current.theta,
              dark: currentCfg.dark,
              mapBrightness: currentCfg.mapBrightness,
              markerColor: currentCfg.markerColor,
              baseColor: currentCfg.baseColor,
              arcColor: currentCfg.arcColor,
              markerElevation: currentCfg.markerElevation,
              markers: currentCfg.markers.map((m) => ({
                location: m.location,
                size: currentCfg.markerSize,
                id: m.id,
              })),
              arcs: currentCfg.arcs.map((a) => ({
                from: a.from,
                to: a.to,
                id: a.id,
              })),
            })
          }
        } catch (error) {
          console.error("Failed to update Cobe 3D Globe:", error)
        }
        animationId = requestAnimationFrame(animate)
      }
      animate()
      setTimeout(() => canvas && (canvas.style.opacity = "1"))
    }

    if (canvas.offsetWidth > 0) {
      init()
    } else {
      ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          if (ro) ro.disconnect()
          init()
        }
      })
      ro.observe(canvas)
    }

    return () => {
      if (observer) observer.disconnect()
      if (ro) ro.disconnect()
      if (animationId) cancelAnimationFrame(animationId)
      if (globe) {
        try {
          globe.destroy()
        } catch (error) {
          console.error("Failed to destroy Cobe 3D Globe:", error)
        }
      }
    }
  }, [])

  return (
    <div className={`relative aspect-square select-none ${className}`}>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          opacity: 0,
          transition: "opacity 1.2s ease",
          borderRadius: "50%",
          touchAction: "none",
        }}
      />
      {markers.map((m) => (
        <div
          key={m.id}
          style={{
            position: "absolute",
            positionAnchor: `--cobe-${m.id}`,
            bottom: "anchor(top)",
            left: "anchor(center)",
            transform: "translate3d(-50%, 0, 0)",
            translate: "-50% 0",
            marginBottom: 8,
            padding: "2px 6px",
            background: "#081125",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "6px",
            color: "#fff",
            fontFamily: "monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            opacity: `var(--cobe-visible-${m.id}, 0)`,
            filter: `blur(calc((1 - var(--cobe-visible-${m.id}, 0)) * 8px))`,
            transition: "opacity 0.8s, filter 0.8s",
          }}
        >
          {m.label}
          <span
            style={{
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translate3d(-50%, -1px, 0)",
              border: "5px solid transparent",
              borderTopColor: "#081125",
            }}
          />
        </div>
      ))}
      {arcs
        .filter((a) => a.label)
        .map((a) => (
          <div
            key={a.id}
            style={{
              position: "absolute",
              positionAnchor: `--cobe-arc-${a.id}`,
              bottom: "anchor(top)",
              left: "anchor(center)",
              transform: "translate3d(-50%, 0, 0)",
              translate: "-50% 0",
              marginBottom: 8,
              padding: "2px 6px",
              background: "#fff",
              color: "#1a1a2e",
              fontFamily: "monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              pointerEvents: "none",
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
              opacity: `var(--cobe-visible-arc-${a.id}, 0)`,
              filter: `blur(calc((1 - var(--cobe-visible-arc-${a.id}, 0)) * 8px))`,
              transition: "opacity 0.8s, filter 0.8s",
            }}
          >
            {a.label}
            <span
              style={{
                position: "absolute",
                top: "100%",
                left: "50%",
                transform: "translate3d(-50%, -1px, 0)",
                border: "5px solid transparent",
                borderTopColor: "#fff",
              }}
            />
          </div>
        ))}
    </div>
  )
}
