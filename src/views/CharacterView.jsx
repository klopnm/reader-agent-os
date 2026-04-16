import { Suspense, useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, OrbitControls, Center, Grid, Environment } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

useGLTF.preload('/assets/animegirl.glb')

// Stable color constants — defined once, never re-created
const HOLO_BASE     = new THREE.Color(0x001806)
const HOLO_EMISSIVE = new THREE.Color(0x00ff41)
const SCAN_COLOR    = new THREE.Color(0x00ff41)

// ─── Atmospheric point cloud ──────────────────────────────────────────────────
function AtmosphericParticles() {
  const ref = useRef()
  const geo = useMemo(() => {
    const g   = new THREE.BufferGeometry()
    const pos = new Float32Array(300 * 3)
    for (let i = 0; i < 300; i++) {
      const r = 2.2 + Math.random() * 1.4
      const θ = Math.random() * Math.PI * 2
      const φ = Math.acos(2 * Math.random() - 1)
      pos[i*3]   = r * Math.sin(φ) * Math.cos(θ)
      pos[i*3+1] = (Math.random() - 0.5) * 4.5
      pos[i*3+2] = r * Math.sin(φ) * Math.sin(θ)
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return g
  }, [])

  useFrame(() => {
    if (!ref.current) return
    ref.current.rotation.y += 0.0003
    ref.current.rotation.x += 0.00007
  })

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        size={0.04} color="#00ff41"
        transparent opacity={0.28} sizeAttenuation
      />
    </points>
  )
}

// ─── Scan beam ────────────────────────────────────────────────────────────────
// Reads from boundsRef each frame so bounds updates never trigger re-renders
function ScanBeam({ boundsRef }) {
  const beamRef  = useRef()
  const glowRef  = useRef()
  const trailRef = useRef()
  const dir = useRef(1)
  const y   = useRef(boundsRef.current.yMin)

  useFrame((_, dt) => {
    const { yMin, yMax } = boundsRef.current
    y.current += dt * 0.88 * dir.current
    if (y.current >= yMax) { y.current = yMax; dir.current = -1 }
    if (y.current <= yMin) { y.current = yMin; dir.current =  1 }
    const v = y.current
    if (beamRef.current)  beamRef.current.position.y  = v
    if (glowRef.current)  glowRef.current.position.y  = v
    if (trailRef.current) trailRef.current.position.y = v - dir.current * 0.11
  })

  return (
    <group renderOrder={10}>
      <mesh ref={glowRef}  rotation={[-Math.PI/2, 0, 0]}>
        <planeGeometry args={[3.2, 0.26]} />
        <meshBasicMaterial color={SCAN_COLOR} transparent opacity={0.07} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={trailRef} rotation={[-Math.PI/2, 0, 0]}>
        <planeGeometry args={[3.2, 0.10]} />
        <meshBasicMaterial color={SCAN_COLOR} transparent opacity={0.13} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={beamRef}  rotation={[-Math.PI/2, 0, 0]}>
        <planeGeometry args={[3.2, 0.016]} />
        <meshBasicMaterial color={SCAN_COLOR} transparent opacity={0.95} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

// ─── Target ring ──────────────────────────────────────────────────────────────
function TargetRing() {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.elapsedTime * 0.28
    ref.current.material.opacity = 0.1 + Math.sin(clock.elapsedTime * 1.4) * 0.05
  })
  return (
    <mesh ref={ref} rotation={[-Math.PI/2, 0, 0]} position={[0, -1.42, 0]}>
      <ringGeometry args={[0.75, 0.78, 64]} />
      <meshBasicMaterial color="#00ff41" transparent opacity={0.12} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  )
}

// ─── Holographic character ────────────────────────────────────────────────────
function HoloCharacter({ showScanBeam }) {
  const { scene }   = useGLTF('/assets/animegirl.glb')
  const { size }    = useThree()
  const groupRef    = useRef()
  const boundsRef   = useRef({ yMin: -1.5, yMax: 1.7 })   // safe defaults

  // FIX #1 & #2: single useMemo — clone AND apply holographic materials in one
  // pass. Returns the configured scene; no side-effects outside the memo.
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true)
    clone.traverse(child => {
      if (!child.isMesh) return
      const src = child.material
      child.material = new THREE.MeshStandardMaterial({
        map:               src.map          ?? null,
        normalMap:         src.normalMap    ?? null,
        roughnessMap:      src.roughnessMap ?? null,
        metalnessMap:      src.metalnessMap ?? null,
        aoMap:             src.aoMap        ?? null,
        color:             HOLO_BASE,
        emissive:          HOLO_EMISSIVE,
        emissiveMap:       src.map          ?? null,
        emissiveIntensity: 0.24,
        roughness:         0.16,
        metalness:         0.94,
        transparent:       true,
        opacity:           0.87,
        envMapIntensity:   2.2,
      })
      child.castShadow = true
    })
    return clone
  }, [scene])

  // FIX #3: useEffect (not useLayoutEffect) — the R3F render loop has applied
  // transforms by the time this fires, so Box3 returns real world bounds.
  useEffect(() => {
    if (!groupRef.current) return
    const box = new THREE.Box3().setFromObject(groupRef.current)
    if (!box.isEmpty()) {
      boundsRef.current = { yMin: box.min.y, yMax: box.max.y }
    }
  }, [clonedScene])

  // Responsive scale: use the actual rendered canvas size from useThree so it
  // reacts to window / panel resizes without reading window.innerWidth directly.
  const scale = Math.min(size.height / 540, 1) * 2

  // Subtle float animation
  useFrame(({ clock }) => {
    if (groupRef.current)
      groupRef.current.position.y = Math.sin(clock.elapsedTime * 0.52) * 0.046
  })

  return (
    <>
      <group ref={groupRef} scale={scale}>
        <Center>
          <primitive object={clonedScene} />
        </Center>
        {showScanBeam && <ScanBeam boundsRef={boundsRef} />}
      </group>
      <TargetRing />
    </>
  )
}

// ─── Lights ───────────────────────────────────────────────────────────────────
// FIX #5: ambient was #070f07 ≈ RGB(7,15,7) — essentially black.
// Raised to a visible level so the model is never fully dark.
function SceneLights() {
  const rimRef = useRef()
  useFrame(({ clock }) => {
    if (rimRef.current)
      rimRef.current.intensity = 2.8 + Math.sin(clock.elapsedTime * 1.15) * 0.45
  })
  return (
    <>
      {/* 60% void — dim ambient so nothing is pitch-black */}
      <ambientLight color="#0a1a0a" intensity={1.5} />
      {/* 30% slate — soft key from above-front for form */}
      <pointLight color="#1a301a" position={[0, 3.5, 2.5]} intensity={8} />
      {/* 10% neon rim — pulsing from behind-top */}
      <pointLight ref={rimRef} color="#00ff41" position={[0.7, 2.4, -2]} intensity={2.8} />
      {/* 10% neon fill — from below-front to light underside */}
      <pointLight color="#00cc34" position={[-0.9, -0.6, 1.8]} intensity={1.6} />
      <directionalLight color="#0d200d" position={[2, 4, 2]} intensity={1.6} />
    </>
  )
}

// ─── 3-D loading spinner (Suspense fallback inside Canvas) ────────────────────
function Loader3D() {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.elapsedTime * 2.2
  })
  return (
    <mesh ref={ref}>
      <torusGeometry args={[0.42, 0.03, 8, 32]} />
      <meshBasicMaterial color="#00ff41" wireframe />
    </mesh>
  )
}

// ─── Dialogue overlay ─────────────────────────────────────────────────────────
const DIALOGUES = [
  "Initializing neural pathways... COMPLETE.",
  "The chart doesn't lie. The deployer's history does.",
  "I've analyzed 12,847 launches. I remember every rug.",
  "Every block is a lesson. Every rug, a data point.",
  "Reading between the blocks. Pattern recognized.",
  "Built from their mistakes. Protecting your stack.",
  "Bonding curve velocity anomaly detected. Flagging.",
  "Learning. Always learning. She reads everything.",
  "Deployer fingerprint matched. 2 prior rugs. Caution.",
  "Organic volume confirmed. 47 unique wallets. Clean.",
]
const GLITCH_CHARS = '!@#$%^&*<>[]{}|/\\?=+'

function DialogueOverlay({ show }) {
  const [idx,     setIdx]    = useState(0)
  const [opacity, setOpacity] = useState(1)
  const [display, setDisplay] = useState(DIALOGUES[0])
  const [glitch,  setGlitch]  = useState(false)

  useEffect(() => {
    const id = setInterval(() => {
      setOpacity(0)
      setTimeout(() => {
        setIdx(i => {
          const n = (i + 1) % DIALOGUES.length
          setDisplay(DIALOGUES[n])
          return n
        })
        setOpacity(1)
      }, 380)
    }, 5000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      if (Math.random() > 0.65) {
        const corrupt = DIALOGUES[idx].split('').map(c =>
          Math.random() > 0.72
            ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
            : c
        ).join('')
        setGlitch(true)
        setDisplay(corrupt)
        setTimeout(() => { setGlitch(false); setDisplay(DIALOGUES[idx]) }, 115)
      }
    }, 3800)
    return () => clearInterval(id)
  }, [idx])

  if (!show) return null
  return (
    <div style={{
      position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
      zIndex: 5, pointerEvents: 'none',
      padding: '8px 20px',
      background: 'rgba(10,10,10,0.88)',
      border: '1px solid rgba(0,255,65,0.12)',
      borderRadius: 2, opacity,
      transition: 'opacity 0.38s ease',
      maxWidth: '70%', whiteSpace: 'nowrap',
    }}>
      <div style={{
        fontSize: 11, letterSpacing: '0.04em', textAlign: 'center',
        fontFamily: 'inherit',
        color:       glitch ? '#00ff41' : '#888',
        textShadow:  glitch ? '0 0 8px #00ff41' : 'none',
        transition:  glitch ? 'none' : 'color 0.3s',
      }}>
        {display}
      </div>
    </div>
  )
}

// ─── Market pulse panel ───────────────────────────────────────────────────────
function MarketPulse() {
  const [dots, setDots] = useState('')
  useEffect(() => {
    const seq = ['', '.', '..', '...']
    let i = 0
    const id = setInterval(() => { i = (i + 1) % seq.length; setDots(seq[i]) }, 800)
    return () => clearInterval(id)
  }, [])

  const row = (label, value, cls) => (
    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5px 0', fontSize: 9 }}>
      <span style={{ color: '#444' }}>{label}</span>
      <span style={{ color: cls === 'up' ? '#00ff41' : cls === 'dn' ? '#ff3333' : '#888' }}>{value}</span>
    </div>
  )

  return (
    <div style={{
      position: 'absolute', bottom: 52, right: 14, zIndex: 5, pointerEvents: 'none',
      padding: '8px 12px', minWidth: 155,
      background: 'rgba(10,10,10,0.92)',
      border: '1px solid rgba(0,255,65,0.1)',
      borderRadius: 2,
    }}>
      <div style={{ fontSize: 9, color: '#00ff41', letterSpacing: '0.14em', marginBottom: 5 }}>
        MARKET PULSE{dots}
      </div>
      <div style={{ borderTop: '1px solid #1e1e1e', paddingTop: 5 }}>
        {row('$READER',   'TBA')}
        {row('Vol 24h',   '---')}
        {row('Holders',   '---')}
        {row('Liquidity', 'Pump.fun')}
      </div>
      <div style={{ borderTop: '1px solid #1e1e1e', marginTop: 5, paddingTop: 4, fontSize: 9, color: '#333', textAlign: 'center' }}>
        Pump.fun · Solana
      </div>
    </div>
  )
}

function ControlHint() {
  return (
    <div style={{
      position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)',
      zIndex: 5, pointerEvents: 'none',
      fontSize: 9, color: '#2a2a2a', letterSpacing: '0.08em',
    }}>
      Drag to rotate · Scroll to zoom
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function CharacterView({ settings = {} }) {
  const {
    particles  = true,
    autoRotate = true,
    dialogue   = true,
    scanBeam   = true,
  } = settings

  return (
    // FIX: explicit height so Canvas always has a non-zero container to measure
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      minHeight: 0,       // required in a flex child so height: 100% resolves
      background: '#0a0a0a',
      overflow: 'hidden',
    }}>
      <Canvas
        shadows
        dpr={[1, 2]}        // handle HiDPI screens correctly
        frameloop="always"
        gl={{
          antialias:           true,
          toneMapping:         THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.25,
          outputColorSpace:    THREE.SRGBColorSpace,
        }}
        camera={{ position: [0, 0.1, 2.85], fov: 55, near: 0.1, far: 100 }}
        style={{ position: 'absolute', inset: 0 }}
        // FIX #1: scene prop removed — fog is set declaratively inside via
        // <fogExp2> so no inline object literal is recreated on every render.
      >
        {/* FIX #1: fog as a stable JSX primitive attached to the scene */}
        <fogExp2 attach="fog" args={[0x0a0a0a, 0.042]} />

        <SceneLights />

        <Grid
          position={[0, -1.46, 0]}
          args={[30, 30]}
          cellSize={0.32}
          cellThickness={0.35}
          cellColor="#001a07"
          sectionSize={1.6}
          sectionThickness={0.7}
          sectionColor="#003314"
          fadeDistance={8}
          fadeStrength={2.5}
          infiniteGrid
        />

        {/*
          FIX #4: Environment is now INSIDE Suspense.
          Previously it was outside, so when its HDR map loaded it triggered a
          scene.environment update that caused a dark frame independent of the
          model's load state.
        */}
        <Suspense fallback={<Loader3D />}>
          <Environment preset="night" background={false} />
          <HoloCharacter showScanBeam={scanBeam} />
          {particles && <AtmosphericParticles />}
        </Suspense>

        <EffectComposer>
          <Bloom
            luminanceThreshold={0.12}
            luminanceSmoothing={0.88}
            intensity={1.7}
            mipmapBlur
          />
        </EffectComposer>

        <OrbitControls
          target={[0, 0.2, 0]}
          minPolarAngle={Math.PI * 0.28}
          maxPolarAngle={Math.PI * 0.66}
          minDistance={1.6}
          maxDistance={6}
          autoRotate={autoRotate}
          autoRotateSpeed={0.45}
          enablePan={false}
          enableDamping
          dampingFactor={0.06}
        />
      </Canvas>

      <div className="vignette" />
      <DialogueOverlay show={dialogue} />
      <MarketPulse />
      <ControlHint />
    </div>
  )
}
