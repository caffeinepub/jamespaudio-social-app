import { useEffect, useState } from 'react';
import { Flame } from 'lucide-react';

export default function LoadingScreen() {
  const [beat, setBeat] = useState(false);

  useEffect(() => {
    // Heavy beat animation
    const interval = setInterval(() => {
      setBeat(true);
      setTimeout(() => setBeat(false), 150);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-orange-600 via-red-600 to-yellow-600 animate-pulse">
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Fire particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bottom-0 w-2 h-2 bg-yellow-400 rounded-full animate-fire-rise"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center space-y-6">
        <div className={`transition-transform duration-150 ${beat ? 'scale-125' : 'scale-100'}`}>
          <Flame className="h-32 w-32 text-yellow-300 mx-auto drop-shadow-2xl animate-bounce" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-5xl font-bold text-white drop-shadow-lg animate-pulse">
            JAMESPaudio
          </h1>
          <p className="text-xl text-yellow-100 drop-shadow-md">
            Loading your creative hub...
          </p>
        </div>

        <div className="flex gap-2 justify-center">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 bg-white rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fire-rise {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) scale(0);
            opacity: 0;
          }
        }
        .animate-fire-rise {
          animation: fire-rise linear infinite;
        }
      `}</style>
    </div>
  );
}
