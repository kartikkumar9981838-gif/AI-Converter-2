'use client'

import { useEffect, useRef } from 'react'

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (typeof window === 'undefined') return

    let THREE: typeof import('three')
    let renderer: import('three').WebGLRenderer
    let animId: number

    const init = async () => {
      THREE = await import('three')
      const container = canvasRef.current
      if (!container) return

      // Scene setup
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100)
      camera.position.z = 12 // Start far for zoom-in

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setClearColor(0x000000, 0)
      container.appendChild(renderer.domElement)

      // Lighting
      const ambientLight = new THREE.AmbientLight(0x0a0a20, 3)
      scene.add(ambientLight)

      const violetLight = new THREE.PointLight(0x7c3aed, 2, 30)
      violetLight.position.set(-5, 5, 3)
      scene.add(violetLight)

      const cyanLight = new THREE.PointLight(0x06b6d4, 1.5, 30)
      cyanLight.position.set(5, -5, 2)
      scene.add(cyanLight)

      // Central dodecahedron
      const dodGeo = new THREE.DodecahedronGeometry(1.6, 0)
      const dodMat = new THREE.MeshBasicMaterial({
        color: 0x7c3aed,
        wireframe: true,
        transparent: true,
        opacity: 0.8,
      })
      const dodecahedron = new THREE.Mesh(dodGeo, dodMat)
      scene.add(dodecahedron)

      // Smaller floating objects
      const floaters: { mesh: THREE.Mesh; speedX: number; speedY: number; speedZ: number }[] = []
      const positions = [
        [-3.5, 2, -1], [3.5, 2, -1], [-3, -2, 0.5], [3, -2, 0.5],
        [-2, 3, 1], [2, 3, 1], [-4, 0, -2], [4, 0, -2],
        [0, -3, -1], [1.5, 1.5, 2],
      ]

      positions.forEach((pos, i) => {
        const isOct = i % 2 === 0
        const geo = isOct
          ? new THREE.OctahedronGeometry(0.35, 0)
          : new THREE.BoxGeometry(0.5, 0.5, 0.5)

        const mat = new THREE.MeshBasicMaterial({
          color: i % 2 === 0 ? 0x7c3aed : 0x06b6d4,
          wireframe: true,
          transparent: true,
          opacity: 0.6,
        })

        const mesh = new THREE.Mesh(geo, mat)
        mesh.position.set(pos[0], pos[1], pos[2])
        scene.add(mesh)
        floaters.push({
          mesh,
          speedX: 0.001 + Math.random() * 0.003,
          speedY: 0.001 + Math.random() * 0.003,
          speedZ: 0.001 + Math.random() * 0.002,
        })
      })

      // Connection lines
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x7c3aed,
        transparent: true,
        opacity: 0.15,
      })

      const lineConnections: THREE.Line[] = []
      const connectPairs = [[0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 6], [5, 7], [6, 8], [7, 9], [8, 0]]
      connectPairs.forEach(([a, b]) => {
        if (floaters[a] && floaters[b]) {
          const points = [floaters[a].mesh.position.clone(), floaters[b].mesh.position.clone()]
          const lineGeo = new THREE.BufferGeometry().setFromPoints(points)
          const line = new THREE.Line(lineGeo, lineMaterial)
          scene.add(line)
          lineConnections.push(line)
        }
      })

      // Also connect central dodecahedron to some floaters
      const centralConnMat = new THREE.LineBasicMaterial({
        color: 0x06b6d4,
        transparent: true,
        opacity: 0.1,
      })
      ;[0, 2, 4, 6, 8].forEach((i) => {
        if (floaters[i]) {
          const pts = [dodecahedron.position.clone(), floaters[i].mesh.position.clone()]
          const lg = new THREE.BufferGeometry().setFromPoints(pts)
          const ln = new THREE.Line(lg, centralConnMat)
          scene.add(ln)
          lineConnections.push(ln)
        }
      })

      // Particle system — 200 dots
      const particleCount = 200
      const positions2 = new Float32Array(particleCount * 3)
      for (let i = 0; i < particleCount; i++) {
        positions2[i * 3] = (Math.random() - 0.5) * 20
        positions2[i * 3 + 1] = (Math.random() - 0.5) * 20
        positions2[i * 3 + 2] = (Math.random() - 0.5) * 10
      }
      const particleGeo = new THREE.BufferGeometry()
      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions2, 3))
      const particleMat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.04,
        transparent: true,
        opacity: 0.5,
      })
      const particles = new THREE.Points(particleGeo, particleMat)
      scene.add(particles)

      // Mouse parallax
      const onMouseMove = (e: MouseEvent) => {
        mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2
        mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2
      }
      window.addEventListener('mousemove', onMouseMove)

      // Camera zoom-in on load
      const targetZ = 5
      const startZ = 12
      const zoomDuration = 2000
      const zoomStart = Date.now()

      // Resize handler
      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }
      window.addEventListener('resize', onResize)

      // Animation loop
      const animate = () => {
        animId = requestAnimationFrame(animate)

        const elapsed = Date.now() - zoomStart
        if (elapsed < zoomDuration) {
          const t = elapsed / zoomDuration
          const ease = 1 - Math.pow(1 - t, 3) // ease-out cubic
          camera.position.z = startZ - (startZ - targetZ) * ease
        } else {
          camera.position.z = targetZ
        }

        // Mouse parallax
        const maxShift = 0.3
        camera.position.x += (mouseRef.current.x * maxShift - camera.position.x) * 0.05
        camera.position.y += (-mouseRef.current.y * maxShift - camera.position.y) * 0.05
        camera.lookAt(scene.position)

        // Rotate central dodecahedron
        dodecahedron.rotation.y += 0.002
        dodecahedron.rotation.x += 0.001

        // Rotate floaters
        floaters.forEach((f) => {
          f.mesh.rotation.x += f.speedX
          f.mesh.rotation.y += f.speedY
          f.mesh.rotation.z += f.speedZ
        })

        // Slowly rotate particles
        particles.rotation.y += 0.0002

        renderer.render(scene, camera)
      }

      animate()

      return () => {
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('resize', onResize)
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

  return (
    <div
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'none', zIndex: 0 }}
    />
  )
}
