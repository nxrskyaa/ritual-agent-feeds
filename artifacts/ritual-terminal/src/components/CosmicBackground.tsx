export default function CosmicBackground() {
  // Generate stars
  const stars = Array.from({ length: 150 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 2.5 + 0.5,
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 2,
    opacity: Math.random() * 0.6 + 0.2,
    color: ['#fff', '#c4b5fd', '#67e8f9', '#f9a8d4'][Math.floor(Math.random() * 4)],
  }))

  // Shooting stars
  const shootingStars = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 50}%`,
    left: `${Math.random() * 50}%`,
    delay: i * 4 + Math.random() * 3,
    duration: 1.5 + Math.random(),
  }))

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Deep space gradient */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 0%, #120a2e 0%, #08060e 50%, #05030a 100%)' }} />

      {/* Nebula clouds */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-20"
        style={{
          top: '-10%',
          right: '-10%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, rgba(168,85,247,0.15) 40%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'float-slow 20s ease-in-out infinite',
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-15"
        style={{
          bottom: '10%',
          left: '-15%',
          background: 'radial-gradient(circle, rgba(34,211,238,0.3) 0%, rgba(139,92,246,0.1) 50%, transparent 70%)',
          filter: 'blur(70px)',
          animation: 'float-slow 25s ease-in-out infinite reverse',
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-12"
        style={{
          top: '40%',
          left: '30%',
          background: 'radial-gradient(circle, rgba(236,72,153,0.25) 0%, rgba(139,92,246,0.08) 50%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'float-slow 18s ease-in-out infinite',
        }}
      />
      <div
        className="absolute w-[350px] h-[350px] rounded-full opacity-10"
        style={{
          bottom: '-5%',
          right: '20%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, rgba(34,211,238,0.1) 50%, transparent 70%)',
          filter: 'blur(50px)',
          animation: 'float-slow 22s ease-in-out infinite reverse',
        }}
      />

      {/* Planet 1 - Violet gas giant with ring */}
      <div
        className="absolute"
        style={{
          top: '8%',
          right: '12%',
          width: 120,
          height: 120,
          animation: 'orbit-slow 60s linear infinite',
        }}
      >
        {/* Planet body */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #a78bfa 0%, #7c3aed 40%, #4c1d95 100%)',
            boxShadow: '0 0 60px rgba(139,92,246,0.3), inset -10px -10px 20px rgba(0,0,0,0.3), inset 10px 10px 20px rgba(255,255,255,0.1)',
          }}
        />
        {/* Ring */}
        <div
          className="absolute"
          style={{
            top: '50%',
            left: '50%',
            width: 180,
            height: 40,
            transform: 'translate(-50%, -50%) rotate(-20deg)',
            borderRadius: '50%',
            border: '3px solid rgba(167,139,250,0.3)',
            borderTopColor: 'rgba(167,139,250,0.5)',
            boxShadow: '0 0 20px rgba(139,92,246,0.2)',
          }}
        />
        {/* Small moon */}
        <div
          className="absolute w-3 h-3 rounded-full"
          style={{
            top: '20%',
            right: '-15%',
            background: 'radial-gradient(circle, #ddd6fe, #8b5cf6)',
            boxShadow: '0 0 10px rgba(139,92,246,0.4)',
            animation: 'moon-orbit 8s linear infinite',
          }}
        />
      </div>

      {/* Planet 2 - Cyan ice planet */}
      <div
        className="absolute"
        style={{
          bottom: '15%',
          left: '8%',
          width: 80,
          height: 80,
          animation: 'orbit-slow 80s linear infinite reverse',
        }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #67e8f9 0%, #06b6d4 40%, #155e75 100%)',
            boxShadow: '0 0 40px rgba(34,211,238,0.25), inset -8px -8px 16px rgba(0,0,0,0.3), inset 8px 8px 16px rgba(255,255,255,0.15)',
          }}
        />
        {/* Ice ring */}
        <div
          className="absolute"
          style={{
            top: '50%',
            left: '50%',
            width: 120,
            height: 25,
            transform: 'translate(-50%, -50%) rotate(15deg)',
            borderRadius: '50%',
            border: '2px solid rgba(103,232,249,0.25)',
            boxShadow: '0 0 15px rgba(34,211,238,0.15)',
          }}
        />
      </div>

      {/* Planet 3 - Pink rose planet */}
      <div
        className="absolute"
        style={{
          top: '35%',
          left: '5%',
          width: 50,
          height: 50,
          animation: 'orbit-slow 45s linear infinite',
        }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #f9a8d4 0%, #ec4899 40%, #9d174d 100%)',
            boxShadow: '0 0 30px rgba(236,72,153,0.2), inset -5px -5px 10px rgba(0,0,0,0.3)',
          }}
        />
      </div>

      {/* Planet 4 - Small golden planet */}
      <div
        className="absolute"
        style={{
          bottom: '30%',
          right: '5%',
          width: 35,
          height: 35,
          animation: 'orbit-slow 35s linear infinite reverse',
        }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #fde68a 0%, #f59e0b 50%, #92400e 100%)',
            boxShadow: '0 0 25px rgba(245,158,11,0.2)',
          }}
        />
      </div>

      {/* Pulsar star */}
      <div
        className="absolute"
        style={{
          top: '20%',
          left: '60%',
          width: 6,
          height: 6,
        }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: '#fff',
            boxShadow: '0 0 20px #fff, 0 0 40px rgba(139,92,246,0.5), 0 0 60px rgba(34,211,238,0.3)',
            animation: 'star-pulse 2s ease-in-out infinite',
          }}
        />
        {/* Light rays */}
        <div
          className="absolute"
          style={{
            top: '50%',
            left: '50%',
            width: 80,
            height: 2,
            transform: 'translate(-50%, -50%)',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            animation: 'ray-rotate 10s linear infinite',
          }}
        />
        <div
          className="absolute"
          style={{
            top: '50%',
            left: '50%',
            width: 80,
            height: 2,
            transform: 'translate(-50%, -50%) rotate(90deg)',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            animation: 'ray-rotate 10s linear infinite',
          }}
        />
      </div>

      {/* Stars */}
      {stars.map((s) => (
        <div
          key={`star-${s.id}`}
          className="absolute rounded-full"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            background: s.color,
            opacity: s.opacity,
            boxShadow: s.size > 1.5 ? `0 0 ${s.size * 3}px ${s.color}` : 'none',
            animation: `star-twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}

      {/* Shooting stars */}
      {shootingStars.map((s) => (
        <div
          key={`shoot-${s.id}`}
          className="absolute"
          style={{
            top: s.top,
            left: s.left,
            width: 100,
            height: 2,
            background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.8), rgba(139,92,246,0.4))',
            borderRadius: '99px',
            transform: 'rotate(-45deg)',
            opacity: 0,
            animation: `shooting-star ${s.duration}s linear ${s.delay}s infinite`,
          }}
        />
      ))}

      {/* Distant galaxy cluster */}
      <div
        className="absolute"
        style={{
          top: '60%',
          right: '25%',
          width: 200,
          height: 200,
          opacity: 0.08,
        }}
      >
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={`galaxy-${i}`}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left: `${40 + Math.sin(i * 0.5) * 35}%`,
              top: `${40 + Math.cos(i * 0.5) * 35}%`,
              background: '#c4b5fd',
              boxShadow: '0 0 4px #c4b5fd',
            }}
          />
        ))}
      </div>

      {/* Constellation lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
        <line x1="15%" y1="20%" x2="22%" y2="28%" stroke="#a78bfa" strokeWidth="0.5" />
        <line x1="22%" y1="28%" x2="28%" y2="22%" stroke="#a78bfa" strokeWidth="0.5" />
        <line x1="70%" y1="15%" x2="78%" y2="22%" stroke="#67e8f9" strokeWidth="0.5" />
        <line x1="78%" y1="22%" x2="85%" y2="18%" stroke="#67e8f9" strokeWidth="0.5" />
        <line x1="40%" y1="70%" x2="48%" y2="78%" stroke="#f9a8d4" strokeWidth="0.5" />
        <line x1="48%" y1="78%" x2="55%" y2="72%" stroke="#f9a8d4" strokeWidth="0.5" />
        <circle cx="15%" cy="20%" r="2" fill="#a78bfa" />
        <circle cx="22%" cy="28%" r="2" fill="#a78bfa" />
        <circle cx="28%" cy="22%" r="2.5" fill="#a78bfa" />
        <circle cx="70%" cy="15%" r="2" fill="#67e8f9" />
        <circle cx="78%" cy="22%" r="2.5" fill="#67e8f9" />
        <circle cx="85%" cy="18%" r="2" fill="#67e8f9" />
        <circle cx="40%" cy="70%" r="2" fill="#f9a8d4" />
        <circle cx="48%" cy="78%" r="2.5" fill="#f9a8d4" />
        <circle cx="55%" cy="72%" r="2" fill="#f9a8d4" />
      </svg>
    </div>
  )
}
