import { Suspense, useRef, useMemo, useEffect, useState, Component } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, OrbitControls, Center, Stage } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

useGLTF.preload('/assets/animegirl.glb')

// Stable color constants — defined once, never re-created
const HOLO_BASE     = new THREE.Color(0x001806)
const HOLO_EMISSIVE = new THREE.Color(0x00ff41)
const SCAN_COLOR    = new THREE.Color(0x00ff41)

// ─── Error boundary ───────────────────────────────────────────────────────────
class SceneErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  componentDidCatch(error, info) {
    console.error('[CharacterView] 3D scene error:', error, info)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#0a0a0a', color: '#00ff41',
          fontFamily: 'monospace', fontSize: 11, gap: 8, padding: 24,
        }}>
          <div style={{ letterSpacing: '0.14em' }}>[SCENE ERROR]</div>
          <div style={{ color: '#444', fontSize: 10, textAlign: 'center', maxWidth: 340 }}>
            {this.state.error?.message ?? 'Unknown render error'}
          </div>
          <div style={{ color: '#333', fontSize: 9 }}>Check browser console for details.</div>
        </div>
      )
    }
    return this.props.children
  }
}

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
    // Stage places model bottom at y=0, so ring sits at floor level
    <mesh ref={ref} rotation={[-Math.PI/2, 0, 0]} position={[0, 0.02, 0]}>
      <ringGeometry args={[0.75, 0.78, 64]} />
      <meshBasicMaterial color="#00ff41" transparent opacity={0.12} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  )
}

// ─── Holographic character ────────────────────────────────────────────────────
function HoloCharacter({ showScanBeam }) {
  const { scene }   = useGLTF('/assets/animegirl.glb')
  console.log('Model loading state:', scene)

  const { size }    = useThree()
  const groupRef    = useRef()
  const boundsRef   = useRef({ yMin: 0, yMax: 1.7 })   // safe defaults (Stage puts bottom at y=0)

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

  useEffect(() => {
    if (!groupRef.current) return
    const box = new THREE.Box3().setFromObject(groupRef.current)
    if (!box.isEmpty()) {
      boundsRef.current = { yMin: box.min.y, yMax: box.max.y }
    }
  }, [clonedScene])

  const scale = Math.min(size.height / 540, 1) * 2

  useFrame(({ clock }) => {
    if (groupRef.current)
      groupRef.current.position.y = Math.sin(clock.elapsedTime * 0.52) * 0.046
  })

  return (
    <>
      {/*
        Stage: auto-fits camera via Bounds, provides city environment + preset
        lighting, places model bottom at y=0 via internal <Center top>.
        shadows={false} — contact shadows would show through the transparent holo material.
        makeDefault on OrbitControls is required for Stage's Bounds to call camera.fit().
      */}
      <Stage adjustCamera={true} intensity={0.5} environment="city" shadows={false}>
        <Center>
          <group ref={groupRef} scale={scale}>
            <primitive object={clonedScene} />
          </group>
        </Center>
      </Stage>
      {showScanBeam && <ScanBeam boundsRef={boundsRef} />}
      <TargetRing />
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
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      minHeight: 0,
      background: '#0a0a0a',
      overflow: 'hidden',
    }}>
      <SceneErrorBoundary>
        <Canvas
          shadows
          dpr={[1, 2]}
          frameloop="always"
          gl={{
            antialias:           true,
            toneMapping:         THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.25,
            outputColorSpace:    THREE.SRGBColorSpace,
          }}
          camera={{ position: [0, 0.8, 4.5], fov: 50, near: 0.1, far: 100 }}
          style={{ position: 'absolute', inset: 0 }}
        >
          {/* WebGL clear color — ensures #0a0a0a even before any scene geometry renders */}
          <color attach="background" args={['#0a0a0a']} />

          <fogExp2 attach="fog" args={[0x0a0a0a, 0.038]} />

          {/* Neon accent lights layered on top of Stage's built-in city lighting */}
          <pointLight color="#00ff41" position={[0.7, 2.4, -2]} intensity={2.8} />
          <pointLight color="#00cc34" position={[-0.9, -0.6, 1.8]} intensity={1.6} />

          {/* Floor reference grid — Stage places model bottom at y=0 */}
          <gridHelper args={[20, 20, '#00ff41', '#1a1a1a']} position={[0, 0, 0]} />

          <Suspense fallback={<Loader3D />}>
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

          {/* makeDefault required for Stage's Bounds to call camera.fit() on load */}
          <OrbitControls
            makeDefault
            target={[0, 1.0, 0]}
            minPolarAngle={Math.PI * 0.28}
            maxPolarAngle={Math.PI * 0.66}
            minDistance={1.6}
            maxDistance={8}
            autoRotate={autoRotate}
            autoRotateSpeed={0.45}
            enablePan={false}
            enableDamping
            dampingFactor={0.06}
          />
        </Canvas>
      </SceneErrorBoundary>

      <div className="vignette" />
      <DialogueOverlay show={dialogue} />
      <MarketPulse />
      <ControlHint />
    </div>
  )
}
