import { useEffect, useRef } from 'react'

const PURPLE = 0x5b4bd9

function LoginThreeScene() {
  const sceneRef = useRef(null)

  useEffect(() => {
    const container = sceneRef.current
    if (!container) return undefined

    let cancel = false
    let cleanupScene = () => {}

    const bootScene = async () => {
      const THREE = await import('three')
      if (cancel || !container) return

      const createMaterial = (color, extra = {}) =>
        new THREE.MeshStandardMaterial({
          color,
          roughness: 0.35,
          metalness: 0.2,
          ...extra,
        })

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
      camera.position.set(0.3, 0.6, 10)

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.setSize(container.clientWidth, container.clientHeight)
      container.appendChild(renderer.domElement)

      const cluster = new THREE.Group()
      cluster.position.set(1.1, 0.1, 0)
      scene.add(cluster)

      const mainCube = new THREE.Mesh(
        new THREE.BoxGeometry(2.9, 2.9, 2.9),
        createMaterial(0x3a2fb1, { roughness: 0.28 }),
      )
      mainCube.position.set(-0.8, 0.9, 0.2)
      mainCube.rotation.set(-0.45, 0.6, -0.18)
      cluster.add(mainCube)

      const tallCube = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 1.8, 1.8),
        createMaterial(0x2e257f, { roughness: 0.32 }),
      )
      tallCube.position.set(1.55, 1.35, -1.3)
      tallCube.rotation.set(-0.2, -0.52, 0.16)
      cluster.add(tallCube)

      const darkCube = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 2.2, 2.2),
        createMaterial(0x171246, { roughness: 0.42 }),
      )
      darkCube.position.set(0.9, -1.85, -0.9)
      darkCube.rotation.set(-0.15, 0.35, 0.6)
      cluster.add(darkCube)

      const lightCube = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 1.2, 1.2),
        createMaterial(0xa6a6ff, { roughness: 0.22 }),
      )
      lightCube.position.set(-0.1, -3.05, 0.75)
      lightCube.rotation.set(-0.28, 0.4, -0.2)
      cluster.add(lightCube)

      const hexPrism = new THREE.Mesh(
        new THREE.CylinderGeometry(1.35, 1.35, 1.7, 6),
        createMaterial(0x9aa0ff, { roughness: 0.2 }),
      )
      hexPrism.position.set(1.45, 0.15, 0.85)
      hexPrism.rotation.set(-0.28, 0.26, 1.06)
      cluster.add(hexPrism)

      const shadowPlane = new THREE.Mesh(
        new THREE.CircleGeometry(4.6, 48),
        new THREE.MeshBasicMaterial({ color: 0x181049, transparent: true, opacity: 0.45 }),
      )
      shadowPlane.position.set(2.2, -3.2, -2.2)
      shadowPlane.rotation.set(-Math.PI / 2.2, 0, -0.22)
      cluster.add(shadowPlane)

      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.14, 0.27, 24, 90),
        createMaterial(0xabaeff, { roughness: 0.24, metalness: 0.18 }),
      )
      ring.position.set(-3.15, -0.95, -0.15)
      ring.rotation.set(0.8, 0.55, 0.38)
      cluster.add(ring)

      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(1.3, 52, 52),
        createMaterial(0x6f61e7, { roughness: 0.24 }),
      )
      sphere.position.set(2.6, -1.0, 1.55)
      cluster.add(sphere)

      const sphereRibs = new THREE.Mesh(
        new THREE.SphereGeometry(1.31, 36, 36),
        new THREE.MeshStandardMaterial({
          color: 0xc4c0ff,
          wireframe: true,
          transparent: true,
          opacity: 0.24,
        }),
      )
      sphereRibs.position.copy(sphere.position)
      cluster.add(sphereRibs)

      const bubbleTop = new THREE.Mesh(
        new THREE.SphereGeometry(0.72, 32, 32),
        createMaterial(0xb0abff, { roughness: 0.18 }),
      )
      bubbleTop.position.set(2.8, 1.7, 0.2)
      cluster.add(bubbleTop)

      const bubbleLeft = new THREE.Mesh(
        new THREE.SphereGeometry(0.58, 32, 32),
        createMaterial(0x8b82f4, { roughness: 0.24 }),
      )
      bubbleLeft.position.set(-3.8, -0.2, 0.5)
      cluster.add(bubbleLeft)

      const bubbleBottom = new THREE.Mesh(
        new THREE.SphereGeometry(0.52, 30, 30),
        createMaterial(0x9e99ff, { roughness: 0.22 }),
      )
      bubbleBottom.position.set(1.7, -3.5, 0.7)
      cluster.add(bubbleBottom)

      const ambient = new THREE.AmbientLight(0xffffff, 0.72)
      const key = new THREE.DirectionalLight(0xbec4ff, 1.2)
      key.position.set(3.6, 3.8, 7)

      const fill = new THREE.PointLight(PURPLE, 1.05, 26)
      fill.position.set(-4, 2.2, 3.8)

      const rim = new THREE.PointLight(0xd7d4ff, 0.86, 24)
      rim.position.set(4.2, -2.2, 3)

      scene.add(ambient, key, fill, rim)

      const floatingObjects = [
        {
          mesh: mainCube,
          baseY: mainCube.position.y,
          baseRotX: mainCube.rotation.x,
          baseRotY: mainCube.rotation.y,
          dy: 0.14,
          rx: 0.03,
          ry: 0.03,
          phase: 0,
        },
        {
          mesh: tallCube,
          baseY: tallCube.position.y,
          baseRotX: tallCube.rotation.x,
          baseRotY: tallCube.rotation.y,
          dy: 0.1,
          rx: 0.025,
          ry: -0.03,
          phase: 0.8,
        },
        {
          mesh: darkCube,
          baseY: darkCube.position.y,
          baseRotX: darkCube.rotation.x,
          baseRotY: darkCube.rotation.y,
          dy: 0.12,
          rx: -0.022,
          ry: 0.03,
          phase: 1.4,
        },
        {
          mesh: lightCube,
          baseY: lightCube.position.y,
          baseRotX: lightCube.rotation.x,
          baseRotY: lightCube.rotation.y,
          dy: 0.08,
          rx: 0.02,
          ry: 0.02,
          phase: 2.1,
        },
        {
          mesh: hexPrism,
          baseY: hexPrism.position.y,
          baseRotX: hexPrism.rotation.x,
          baseRotY: hexPrism.rotation.y,
          dy: 0.11,
          rx: -0.02,
          ry: 0.026,
          phase: 1.1,
        },
        {
          mesh: ring,
          baseY: ring.position.y,
          baseRotX: ring.rotation.x,
          baseRotY: ring.rotation.y,
          dy: 0.1,
          rx: 0.02,
          ry: 0.025,
          phase: 0.5,
        },
        {
          mesh: sphere,
          baseY: sphere.position.y,
          baseRotX: sphere.rotation.x,
          baseRotY: sphere.rotation.y,
          dy: 0.12,
          rx: 0.018,
          ry: -0.022,
          phase: 1.9,
        },
        {
          mesh: bubbleTop,
          baseY: bubbleTop.position.y,
          baseRotX: bubbleTop.rotation.x,
          baseRotY: bubbleTop.rotation.y,
          dy: 0.08,
          rx: 0.02,
          ry: 0.02,
          phase: 2.5,
        },
        {
          mesh: bubbleLeft,
          baseY: bubbleLeft.position.y,
          baseRotX: bubbleLeft.rotation.x,
          baseRotY: bubbleLeft.rotation.y,
          dy: 0.09,
          rx: -0.02,
          ry: 0.024,
          phase: 1.6,
        },
        {
          mesh: bubbleBottom,
          baseY: bubbleBottom.position.y,
          baseRotX: bubbleBottom.rotation.x,
          baseRotY: bubbleBottom.rotation.y,
          dy: 0.09,
          rx: 0.02,
          ry: -0.022,
          phase: 0.7,
        },
      ]

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const clock = new THREE.Clock()
      let rafId = 0

      const resize = () => {
        const width = container.clientWidth || 1
        const height = container.clientHeight || 1
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        renderer.setSize(width, height)
      }

      const animate = () => {
        const t = clock.getElapsedTime()
        const speed = reduceMotion ? 0.25 : 1

        // Keep the silhouette stable while still feeling alive.
        cluster.rotation.y = -0.42 + Math.sin(t * 0.35 * speed) * 0.02
        cluster.rotation.x = Math.cos(t * 0.25 * speed) * 0.012

        floatingObjects.forEach(({ mesh, baseY, baseRotX, baseRotY, dy, rx, ry, phase }) => {
          mesh.position.y = baseY + Math.sin(t * speed + phase) * dy
          mesh.rotation.x = baseRotX + Math.sin(t * 0.55 * speed + phase) * rx
          mesh.rotation.y = baseRotY + Math.cos(t * 0.48 * speed + phase) * ry
        })

        sphereRibs.rotation.y = Math.sin(t * 0.4 * speed) * 0.3
        shadowPlane.scale.x = 1 + Math.sin(t * 1.3 * speed) * 0.02
        shadowPlane.scale.y = 1 + Math.cos(t * 1.15 * speed) * 0.02

        renderer.render(scene, camera)
        rafId = window.requestAnimationFrame(animate)
      }

      resize()
      animate()
      window.addEventListener('resize', resize)

      cleanupScene = () => {
        window.cancelAnimationFrame(rafId)
        window.removeEventListener('resize', resize)

        cluster.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose()
            if (Array.isArray(child.material)) {
              child.material.forEach((material) => material.dispose())
            } else {
              child.material.dispose()
            }
          }
        })

        renderer.dispose()
        if (renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement)
        }
      }
    }

    void bootScene()

    return () => {
      cancel = true
      cleanupScene()
    }
  }, [])

  return <div ref={sceneRef} className="three-login-canvas" aria-hidden="true" />
}

export default LoginThreeScene
