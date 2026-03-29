import { Flame } from "lucide-react";
import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [beat, setBeat] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setBeat(true);
      setTimeout(() => setBeat(false), 150);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-orange-600 via-red-600 to-yellow-600 animate-pulse">
      <div className="absolute inset-0 bg-black/20" />

      <div className="absolute inset-0 overflow-hidden">
        {[
          "0%",
          "5%",
          "10%",
          "16%",
          "21%",
          "26%",
          "32%",
          "37%",
          "42%",
          "47%",
          "53%",
          "58%",
          "63%",
          "69%",
          "74%",
          "79%",
          "85%",
          "90%",
          "95%",
          "0%",
        ].map((pos, i) => (
          <div
            key={pos + String(i)}
            className="absolute bottom-0 w-2 h-2 bg-yellow-400 rounded-full animate-fire-rise"
            style={{
              left: pos,
              animationDelay: `${(i * 0.1) % 2}s`,
              animationDuration: `${2 + (i % 4) * 0.5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center space-y-6">
        <div
          className={`transition-transform duration-150 ${
            beat ? "scale-125" : "scale-100"
          }`}
        >
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
          {["0s", "0.15s", "0.3s"].map((delay) => (
            <div
              key={delay}
              className="w-3 h-3 bg-white rounded-full animate-bounce"
              style={{ animationDelay: delay }}
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
