'use client'

import { useRef, useEffect, useCallback } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import {
  PAN_SPEED,
  VELOCITY_DECAY,
  VELOCITY_LERP,
  MAX_VELOCITY,
  KEYBOARD_SPEED,
} from '@/lib/canvas/constants'

interface CameraControllerProps {
  onCameraMove?: (position: THREE.Vector3) => void
  enabled?: boolean
}

export function CameraController({ onCameraMove, enabled = true }: CameraControllerProps) {
  const { camera, gl } = useThree()

  // Refs for tracking drag state
  const isDragging = useRef(false)
  const previousMousePosition = useRef({ x: 0, y: 0 })
  const velocity = useRef(new THREE.Vector3(0, 0, 0))
  const targetVelocity = useRef(new THREE.Vector3(0, 0, 0))
  const keysPressed = useRef<Set<string>>(new Set())
  const scrollAccum = useRef(0) // Scroll accumulator for smooth zoom

  // Handle pointer events
  const handlePointerDown = useCallback((e: PointerEvent) => {
    if (!enabled) return
    isDragging.current = true
    previousMousePosition.current = { x: e.clientX, y: e.clientY }
    gl.domElement.style.cursor = 'grabbing'
  }, [enabled, gl])

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!isDragging.current || !enabled) return

    const deltaX = e.clientX - previousMousePosition.current.x
    const deltaY = e.clientY - previousMousePosition.current.y

    // Accumulate target velocity based on drag (matches Codrops pattern)
    targetVelocity.current.x -= deltaX * PAN_SPEED
    targetVelocity.current.y += deltaY * PAN_SPEED

    previousMousePosition.current = { x: e.clientX, y: e.clientY }
  }, [enabled])

  const handlePointerUp = useCallback(() => {
    isDragging.current = false
    gl.domElement.style.cursor = 'grab'
  }, [gl])

  // Handle wheel for zoom (move along Z axis)
  const handleWheel = useCallback((e: WheelEvent) => {
    if (!enabled) return
    e.preventDefault()

    // Use accumulator pattern for smooth zoom (matches Codrops)
    scrollAccum.current += e.deltaY * 0.006
  }, [enabled])

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!enabled) return
    keysPressed.current.add(e.key.toLowerCase())
  }, [enabled])

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keysPressed.current.delete(e.key.toLowerCase())
  }, [])

  // Set up event listeners
  useEffect(() => {
    const domElement = gl.domElement

    domElement.addEventListener('pointerdown', handlePointerDown)
    domElement.addEventListener('pointermove', handlePointerMove)
    domElement.addEventListener('pointerup', handlePointerUp)
    domElement.addEventListener('pointerleave', handlePointerUp)
    domElement.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    // Set initial cursor
    domElement.style.cursor = 'grab'

    return () => {
      domElement.removeEventListener('pointerdown', handlePointerDown)
      domElement.removeEventListener('pointermove', handlePointerMove)
      domElement.removeEventListener('pointerup', handlePointerUp)
      domElement.removeEventListener('pointerleave', handlePointerUp)
      domElement.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [gl, handlePointerDown, handlePointerMove, handlePointerUp, handleWheel, handleKeyDown, handleKeyUp])

  // Animation frame for movement
  useFrame(() => {
    if (!enabled) return

    // 1. Accumulate keyboard input into targetVelocity (matches Codrops += pattern)
    const keys = keysPressed.current
    if (keys.has('w') || keys.has('arrowup')) targetVelocity.current.y += KEYBOARD_SPEED
    if (keys.has('s') || keys.has('arrowdown')) targetVelocity.current.y -= KEYBOARD_SPEED
    if (keys.has('a') || keys.has('arrowleft')) targetVelocity.current.x -= KEYBOARD_SPEED
    if (keys.has('d') || keys.has('arrowright')) targetVelocity.current.x += KEYBOARD_SPEED
    if (keys.has('q')) targetVelocity.current.z -= KEYBOARD_SPEED
    if (keys.has('e')) targetVelocity.current.z += KEYBOARD_SPEED

    // 2. Apply accumulated scroll to Z velocity and decay
    targetVelocity.current.z += scrollAccum.current
    scrollAccum.current *= 0.8 // Scroll decay

    // 3. Clamp target velocity
    targetVelocity.current.x = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, targetVelocity.current.x))
    targetVelocity.current.y = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, targetVelocity.current.y))
    targetVelocity.current.z = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, targetVelocity.current.z))

    // 4. Lerp actual velocity towards target velocity (smoothing)
    velocity.current.x += (targetVelocity.current.x - velocity.current.x) * VELOCITY_LERP
    velocity.current.y += (targetVelocity.current.y - velocity.current.y) * VELOCITY_LERP
    velocity.current.z += (targetVelocity.current.z - velocity.current.z) * VELOCITY_LERP

    // 5. Apply velocity to camera
    camera.position.add(velocity.current)

    // 6. Decay target velocity for momentum/inertia
    targetVelocity.current.x *= VELOCITY_DECAY
    targetVelocity.current.y *= VELOCITY_DECAY
    targetVelocity.current.z *= VELOCITY_DECAY

    // Stop when velocity is very small
    if (velocity.current.length() < 0.001) {
      velocity.current.set(0, 0, 0)
    }

    // Notify parent of camera movement
    if (onCameraMove) {
      onCameraMove(camera.position.clone())
    }
  })

  return null
}
