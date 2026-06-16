'use client'

import { useEffect, useRef } from 'react'

export default function XMLBracketCanvas() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    let animId: number
    let renderer: import('three').WebGLRenderer

    const init = async () => {
      const THREE = await import('three')
      const container = mountRef.current
      if (!container) return

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100)
      camera.position.z = 3

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
      renderer.setSize(200, 200)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setClearColor(0x000000, 0)
      container.appendChild(renderer.domElement)

      // XML bracket shape using torus + box combo
      const bracketGroup = new THREE.Group()

      // Left bracket '<'
      const leftGeo = new THREE.TorusGeometry(0.5, 0.04, 8, 16, Math.PI)
      const leftMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: false })
      const leftBracket = new THREE.Mesh(leftGeo, leftMat)
      leftBracket.position.x = -0.6
      leftBracket.rotation.z = Math.PI / 2
      bracketGroup.add(leftBracket)

      // Right bracket '>'
      const rightGeo = new THREE.TorusGeometry(0.5, 0.04, 8, 16, Math.PI)
      const rightMat = new THREE.MeshBasicMaterial({ color: 0x7c3aed, wireframe: false })
      const rightBracket = new THREE.Mesh(rightGeo, rightMat)
      rightBracket.position.x = 0.6
      rightBracket.rotation.z = -Math.PI / 2
      bracketGroup.add(rightBracket)

      // Center slash '/'
      const slashGeo = new THREE.CylinderGeometry(0.03, 0.03, 1, 8)
      const slashMat = new THREE.MeshBasicMaterial({ color: 0xa855f7 })
      const slash = new THREE.Mesh(slashGeo, slashMat)
      slash.rotation.z = Math.PI / 4
      bracketGroup.add(slash)

      scene.add(bracketGroup)

      // Ambient + point lights
      scene.add(new THREE.AmbientLight(0x7c3aed, 2))
      const pl = new THREE.PointLight(0x06b6d4, 3, 10)
      pl.position.set(2, 2, 2)
      scene.add(pl)

      const animate = () => {
        animId = requestAnimationFrame(animate)
        bracketGroup.rotation.y += 0.015
        bracketGroup.rotation.x = Math.sin(Date.now() * 0.001) * 0.3
        renderer.render(scene, camera)
      }

      animate()

      return () => {
        cancelAnimationFrame(animId)
        renderer.dispose()
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement)
        }
      }
    }

    const cleanup = init()
    return () => {
      cleanup.then((fn) => fn && fn())
    }
  }, [])

  return <div ref={mountRef} style={{ width: 200, height: 200 }} />
}
