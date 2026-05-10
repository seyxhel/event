import React, { useEffect, useMemo, useRef, useState } from 'react'
import { apiUrl } from '../api'

type FeedbackRow = {
  id: number
  reference: string
  attendanceMode: 'onsite' | 'via_online'
  createdAt: string
}

const API_URL = apiUrl('/api/manage/feedback/')

function drawWheel(canvas: HTMLCanvasElement | null, items: FeedbackRow[]) {
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const dpr = window.devicePixelRatio || 1
  const size = Math.min(window.innerWidth * 0.6, 520)
  const radius = size / 2
  canvas.width = size * dpr
  canvas.height = size * dpr
  canvas.style.width = `${size}px`
  canvas.style.height = `${size}px`
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, size, size)

  const cx = size / 2
  const cy = size / 2
  const n = Math.max(items.length, 1)
  const angle = (2 * Math.PI) / n

  const colors = ['#fef3c7', '#fde68a', '#bbf7d0', '#bfdbfe', '#fbcfe8', '#e9d5ff']

  for (let i = 0; i < n; i++) {
    const start = i * angle - Math.PI / 2
    const end = start + angle
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, radius, start, end)
    ctx.closePath()
    ctx.fillStyle = colors[i % colors.length]
    ctx.fill()
    ctx.strokeStyle = '#e6f3ea'
    ctx.lineWidth = 2
    ctx.stroke()

    // label
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(start + angle / 2)
    ctx.fillStyle = '#134e4a'
    ctx.font = '14px system-ui'
    ctx.textAlign = 'right'
    ctx.fillText(items[i] ? items[i].reference : '—', radius - 12, 6)
    ctx.restore()
  }
}

export function RafflePage() {
  const [items, setItems] = useState<FeedbackRow[]>([])
  const [filter, setFilter] = useState<'all' | 'onsite' | 'via_online'>('all')
  const [isSpinning, setIsSpinning] = useState(false)
  const [selected, setSelected] = useState<FeedbackRow | null>(null)
  const [winners, setWinners] = useState<FeedbackRow[]>([])
  const [showModal, setShowModal] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const wheelRef = useRef<HTMLDivElement | null>(null)
  const [wheelSize, setWheelSize] = useState<number>(Math.min(window.innerWidth * 0.6, 520))

  useEffect(() => {
    fetch(API_URL)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.results)) {
          const mapped = data.results.map((row: any) => ({
            id: row.id,
            reference: row.reference,
            attendanceMode: row.attendanceMode || 'onsite',
            createdAt: row.createdAt,
          }))
          setItems(mapped)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    drawWheel(canvasRef.current, pool)
    // keep wheelSize in sync and redraw on resize
    const onResize = () => {
      setWheelSize(Math.min(window.innerWidth * 0.6, 520))
      drawWheel(canvasRef.current, pool)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [items, winners, filter])

  const pool = useMemo(() => {
    const active = items.filter((it) => !winners.some((w) => w.id === it.id))
    if (filter === 'all') return active
    return active.filter((it) => it.attendanceMode === filter)
  }, [items, winners, filter])

  function spin() {
    if (isSpinning) return
    if (pool.length === 0) return
    setIsSpinning(true)
    setSelected(null)

    // snapshot pool at start
    const snapshot = [...pool]
    const n = snapshot.length
    const chosenIndex = Math.floor(Math.random() * n)
    const sectorAngle = 360 / n
    const rotations = 6 + Math.floor(Math.random() * 6)
    const targetSectorCenter = chosenIndex * sectorAngle + sectorAngle / 2
    // CSS rotates clockwise for positive angles; we want the chosen sector to land at top (270deg)
    const finalRotation = rotations * 360 + (360 - targetSectorCenter) + 270
    const duration = 5 + Math.random() * 2 // seconds

    const el = wheelRef.current
    if (!el) {
      const choice = snapshot[chosenIndex]
      setSelected(choice)
      setWinners((prev) => [choice, ...prev])
      setIsSpinning(false)
      return
    }

    el.style.transition = `transform ${duration}s cubic-bezier(0.25, 0.1, 0.25, 1)`
    // force reflow
    // @ts-ignore
    void el.offsetWidth
    el.style.transform = `rotate(${finalRotation}deg)`

    const onEnd = () => {
      el.style.transition = ''
      // normalize rotation to 0..360
      const normalized = finalRotation % 360
      el.style.transform = `rotate(${normalized}deg)`
      const choice = snapshot[chosenIndex]
      setSelected(choice)
      setWinners((prev) => [choice, ...prev])
      setShowModal(true)
      setIsSpinning(false)
      el.removeEventListener('transitionend', onEnd)
    }

    el.addEventListener('transitionend', onEnd)
  }

  function createConfetti() {
    const confettiPieces = []
    for (let i = 0; i < 100; i++) {
      confettiPieces.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 1,
        color: ['#fbbf24', '#34d399', '#60a5fa', '#f87171', '#a78bfa'][Math.floor(Math.random() * 5)],
      })
    }
    return confettiPieces
  }

  const confettiPieces = useMemo(() => createConfetti(), [showModal])

  function returnToPool(id: number) {
    setWinners((prev) => prev.filter((w) => w.id !== id))
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Raffle</h1>

      <div className="mb-4 flex gap-3">
        <button
          className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`px-3 py-1 rounded ${filter === 'onsite' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}
          onClick={() => setFilter('onsite')}
        >
          Onsite
        </button>
        <button
          className={`px-3 py-1 rounded ${filter === 'via_online' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}
          onClick={() => setFilter('via_online')}
        >
          Via Online
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="col-span-2">
          <div className="glass-panel p-6 text-center">
            
            <div className="relative mx-auto w-full flex items-center justify-center" style={{height: wheelSize}}>
              <div
                ref={wheelRef}
                className="wheel-wrapper rounded-full shadow-lg"
                style={{ width: wheelSize, height: wheelSize, transformOrigin: '50% 50%', overflow: 'visible', zIndex: 10 }}
              >
                <canvas ref={canvasRef} style={{ display: 'block', borderRadius: '50%' }} />
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  top: `calc(50% - ${wheelSize / 2 + 12}px)`,
                  zIndex: 40,
                }}
              >
                <div style={{ width: 0, height: 0, borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderTop: '20px solid #ef4444' }} />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-4">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                onClick={spin}
                disabled={isSpinning || pool.length === 0}
              >
                {isSpinning ? 'Spinning...' : 'Spin'}
              </button>
              <button
                className="px-3 py-1 bg-gray-200 rounded"
                onClick={() => {
                  setWinners([])
                  setSelected(null)
                  // reset wheel rotation
                  if (wheelRef.current) wheelRef.current.style.transform = ''
                }}
              >
                Reset Winners
              </button>
            </div>

            {selected && (
              <div className="mt-4 text-center">
                <div className="text-lg font-bold">Selected</div>
                <div className="mt-2 p-3 bg-yellow-50 rounded inline-block">
                  <div className="font-medium">{selected.reference}</div>
                  <div className="text-sm text-gray-600">{selected.attendanceMode === 'onsite' ? 'Onsite' : 'Via Online'}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="glass-panel p-4">
            <h2 className="font-semibold mb-3">Winners</h2>
            <div className="space-y-2 max-h-72 overflow-auto">
              {winners.length === 0 && <div className="text-sm text-gray-500">No winners yet</div>}
              {winners.map((w) => (
                <div key={w.id} className="flex items-center justify-between border rounded p-2">
                  <div>
                    <div className="font-medium">{w.reference}</div>
                    <div className="text-xs text-gray-500">{w.attendanceMode === 'onsite' ? 'Onsite' : 'Via Online'}</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="px-2 py-1 bg-gray-200 rounded text-sm"
                      onClick={() => returnToPool(w.id)}
                    >
                      Return
                    </button>
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                      onClick={() => setWinners((prev) => prev.filter((x) => x.id !== w.id))}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showModal && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          {/* Confetti background */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {confettiPieces.map((piece: any) => (
              <div
                key={piece.id}
                style={{
                  position: 'absolute',
                  left: `${piece.left}%`,
                  top: '-10px',
                  width: '10px',
                  height: '10px',
                  backgroundColor: piece.color,
                  borderRadius: '50%',
                  animation: `fall ${piece.duration}s linear ${piece.delay}s forwards`,
                  opacity: 0.8,
                }}
              />
            ))}
          </div>

          {/* Modal */}
          <div className="relative z-10 glass-panel rounded-2xl p-8 text-center max-w-md shadow-2xl">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-[#1f4736] mb-2">Congratulations!</h2>
            <p className="text-lg text-[#5f7568] mb-6">You are the winner!</p>
            
            <div className="bg-[#f4faf6] rounded-lg p-4 mb-6 border border-[#b8d4c4]">
              <div className="text-sm text-[#5f7568] mb-2">Reference Number</div>
              <div className="font-mono text-2xl font-bold text-[#1f4736]">{selected.reference}</div>
              <div className="text-sm text-[#8ca093] mt-2">{selected.attendanceMode === 'onsite' ? '📍 Onsite' : '🌐 Via Online'}</div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="px-6 py-2 bg-[#3f8657] text-white rounded-lg font-semibold hover:bg-[#2d5d41] transition"
            >
              Awesome!
            </button>
          </div>

          <style>{`
            @keyframes fall {
              to {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
              }
            }
          `}</style>
        </div>
      )}
    </div>
  )
}
