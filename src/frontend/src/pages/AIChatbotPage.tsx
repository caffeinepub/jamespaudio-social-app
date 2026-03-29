import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bot,
  Calculator,
  LineChart as LineChartIcon,
  Mic,
  MicOff,
  RefreshCw,
  Send,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
  timestamp: Date;
}

const GRAPH_DATA = [
  { x: 1, y: 2, sin: 0.84, cos: 0.54 },
  { x: 2, y: 4, sin: 0.91, cos: -0.42 },
  { x: 3, y: 1, sin: 0.14, cos: -0.99 },
  { x: 4, y: 6, sin: -0.76, cos: -0.65 },
  { x: 5, y: 3, sin: -0.96, cos: 0.28 },
  { x: 6, y: 8, sin: -0.28, cos: 0.96 },
  { x: 7, y: 5, sin: 0.66, cos: 0.75 },
  { x: 8, y: 9, sin: 0.99, cos: 0.15 },
];

const UNIT_PRESETS = [
  { from: "km", to: "miles", factor: 0.621371, label: "Kilometers → Miles" },
  { from: "kg", to: "lbs", factor: 2.20462, label: "Kilograms → Pounds" },
  { from: "°C", to: "°F", factor: null, label: "Celsius → Fahrenheit" },
  { from: "USD", to: "EUR", factor: 0.92, label: "USD → EUR" },
];

function generateAIResponse(input: string): string {
  const lower = input.toLowerCase();
  if (/\d/.test(input) && /[+\-*/=]/.test(input)) {
    try {
      const cleaned = input.replace(/[^0-9+\-*/().^ ]/g, "");
      const result = Function(`"use strict"; return (${cleaned})`)();
      return `I calculated that: **${input.trim()} = ${result}**. Great math question! Would you like me to explain the steps?`;
    } catch {
      return "I'd love to help with that math! Could you write it as an expression like 5 + 3 * 2?";
    }
  }
  if (
    lower.includes("graph") ||
    lower.includes("chart") ||
    lower.includes("plot")
  ) {
    return "Sure! I've prepared a graph for you. Check the **Graph** tab on the right to see the visualization. You can see sin/cos wave patterns and custom data points.";
  }
  if (
    lower.includes("hello") ||
    lower.includes("hi") ||
    lower.includes("hey")
  ) {
    return "Hello! I'm your JAMESPaudio AI assistant. I can help with math, graphing, unit conversions, search, and general questions. What would you like to explore today?";
  }
  if (lower.includes("search")) {
    return "The search feature is integrated with JAMESPaudio Search Engine (Pro required). For web results, try the Search Engine page and select Google, Bing, or DuckDuckGo as your engine.";
  }
  if (lower.includes("convert") || lower.includes("unit")) {
    return "I can help with unit conversions! Check the **Converter** tab on the right for quick conversions between km/miles, kg/lbs, Celsius/Fahrenheit, and currencies.";
  }
  if (lower.includes("calc") || lower.includes("calculat")) {
    return "Open the **Calculator** tab on the right to use the interactive calculator. Or just type a math expression here and I'll solve it instantly!";
  }
  if (
    lower.includes("vip") ||
    lower.includes("pro") ||
    lower.includes("plan")
  ) {
    return "JAMESPaudio offers Free, Pro, Ultra, and Ultimate plans. VIP gives you access to advanced search, exclusive chat effects, and premium AI tools. Check the **VIP Membership** page for details!";
  }
  const responses = [
    "That's a great question! I'm processing your request based on JAMESPaudio's knowledge base. Could you provide more details so I can give you a more precise answer?",
    "Interesting! Based on my analysis, I'd suggest exploring this further. Feel free to ask me to graph data, solve math, or convert units as well!",
    "Got it! I'm here to help with anything on JAMESPaudio — from math and science to music and social features. What else would you like to know?",
    "I understand. My AI tools include a calculator, graphing engine, and unit converter. Try asking me to 'calculate 15% of 200' or 'convert 10 km to miles'!",
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

export default function AIChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      text: "Hi! I'm your JAMESPaudio AI assistant 🤖 I can help with math, graphing, unit conversions, and more. Type a question or tap the mic to speak!",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceMuted, setVoiceMuted] = useState(() => {
    const saved = localStorage.getItem("aiVoiceMuted");
    return saved ? JSON.parse(saved) : false;
  });
  const [calcInput, setCalcInput] = useState("");
  const [calcResult, setCalcResult] = useState("");
  const [converterValue, setConverterValue] = useState("");
  const [converterResult, setConverterResult] = useState("");
  const [selectedPreset, setSelectedPreset] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // eslint-disable-next-line
  }, []); // Only run on messages change to scroll

  useEffect(() => {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (SR) {
      recognitionRef.current = new SR();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  const speakText = (text: string) => {
    if (voiceMuted || !window.speechSynthesis) return;
    const clean = text.replace(/\*\*/g, "");
    const utt = new SpeechSynthesisUtterance(clean);
    utt.rate = 1;
    utt.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utt);
  };

  const sendMessage = () => {
    const text = inputText.trim();
    if (!text) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text,
      timestamp: new Date(),
    };
    const aiText = generateAIResponse(text);
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "ai",
      text: aiText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInputText("");
    setTimeout(() => speakText(aiText), 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleMic = () => {
    if (!recognitionRef.current) {
      toast.error("Voice input not supported in this browser");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      toast.info("Listening...");
    }
  };

  const calcPress = (val: string) => {
    if (val === "=") {
      try {
        const r = Function(`"use strict"; return (${calcInput})`)();
        setCalcResult(String(r));
      } catch {
        setCalcResult("Error");
      }
    } else if (val === "C") {
      setCalcInput("");
      setCalcResult("");
    } else if (val === "⌫") {
      setCalcInput((prev) => prev.slice(0, -1));
    } else {
      setCalcInput((prev) => prev + val);
    }
  };

  const doConvert = () => {
    const num = Number.parseFloat(converterValue);
    if (Number.isNaN(num)) {
      setConverterResult("Invalid");
      return;
    }
    const preset = UNIT_PRESETS[selectedPreset];
    if (!preset.factor) {
      // Celsius to Fahrenheit
      setConverterResult(`${((num * 9) / 5 + 32).toFixed(2)} °F`);
    } else {
      setConverterResult(`${(num * preset.factor).toFixed(4)} ${preset.to}`);
    }
  };

  const calcKeys = [
    "7",
    "8",
    "9",
    "/",
    "4",
    "5",
    "6",
    "*",
    "1",
    "2",
    "3",
    "-",
    "0",
    ".",
    "⌫",
    "+",
    "C",
    "(",
    ")",
    "=",
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="relative h-40 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 overflow-hidden flex-shrink-0">
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center">
            <Bot className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">AI Chatbot</h1>
            <p className="text-white/80">
              Your intelligent assistant with tools
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Badge className="bg-yellow-400 text-yellow-900 font-bold">
              NEW
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => setVoiceMuted((v: boolean) => !v)}
              data-ocid="chatbot.toggle"
            >
              {voiceMuted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex gap-0 lg:gap-4 p-0 lg:p-4">
        {/* Chat Area */}
        <div className="flex flex-col flex-1 min-w-0 border-r lg:border lg:rounded-xl overflow-hidden bg-card">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === "ai"
                        ? "bg-indigo-500 text-white"
                        : "bg-orange-500 text-white"
                    }`}
                  >
                    {msg.role === "ai" ? (
                      <Bot className="h-4 w-4" />
                    ) : (
                      <span className="text-xs font-bold">ME</span>
                    )}
                  </div>
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                      msg.role === "ai"
                        ? "bg-muted text-foreground rounded-tl-sm"
                        : "bg-indigo-500 text-white rounded-tr-sm"
                    }`}
                  >
                    {msg.text
                      .split("**")
                      .map((part, i) =>
                        i % 2 === 1 ? (
                          <strong key={part.substring(0, 12)}>{part}</strong>
                        ) : (
                          part
                        ),
                      )}
                    <div className="text-xs mt-1 opacity-60">
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="border-t p-3 flex gap-2 bg-background">
            <Button
              variant={isListening ? "destructive" : "outline"}
              size="icon"
              onClick={toggleMic}
              data-ocid="chatbot.toggle"
            >
              {isListening ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
            <Input
              placeholder="Ask me anything..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
              data-ocid="chatbot.input"
            />
            <Button onClick={sendMessage} data-ocid="chatbot.primary_button">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tools Panel */}
        <div className="hidden lg:flex flex-col w-80 xl:w-96 flex-shrink-0">
          <Tabs defaultValue="calculator" className="flex flex-col h-full">
            <TabsList className="grid grid-cols-3 mx-0">
              <TabsTrigger value="calculator" data-ocid="chatbot.tab">
                <Calculator className="h-4 w-4 mr-1" />
                Calc
              </TabsTrigger>
              <TabsTrigger value="graph" data-ocid="chatbot.tab">
                <LineChartIcon className="h-4 w-4 mr-1" />
                Graph
              </TabsTrigger>
              <TabsTrigger value="converter" data-ocid="chatbot.tab">
                <RefreshCw className="h-4 w-4 mr-1" />
                Convert
              </TabsTrigger>
            </TabsList>

            {/* Calculator */}
            <TabsContent value="calculator" className="flex-1 mt-2">
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Calculator</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="bg-muted rounded-lg p-3 text-right font-mono">
                    <div className="text-xs text-muted-foreground min-h-4">
                      {calcInput || "0"}
                    </div>
                    <div className="text-2xl font-bold">{calcResult || ""}</div>
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {calcKeys.map((k) => (
                      <Button
                        key={k}
                        variant={
                          k === "="
                            ? "default"
                            : ["C", "⌫"].includes(k)
                              ? "destructive"
                              : "outline"
                        }
                        size="sm"
                        className="h-10 font-mono text-sm"
                        onClick={() => calcPress(k)}
                        data-ocid="chatbot.button"
                      >
                        {k}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Graph */}
            <TabsContent value="graph" className="flex-1 mt-2">
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Graph Visualizer</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={GRAPH_DATA}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="x" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="y"
                        stroke="#6366f1"
                        strokeWidth={2}
                        dot
                      />
                      <Line
                        type="monotone"
                        dataKey="sin"
                        stroke="#f97316"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Ask me to "graph" something to see data plots
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Converter */}
            <TabsContent value="converter" className="flex-1 mt-2">
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Unit Converter</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {UNIT_PRESETS.map((p, i) => (
                    <button
                      key={p.label}
                      type="button"
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm border transition-colors ${
                        selectedPreset === i
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:bg-muted"
                      }`}
                      onClick={() => setSelectedPreset(i)}
                      data-ocid="chatbot.button"
                    >
                      {p.label}
                    </button>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder={`Enter ${UNIT_PRESETS[selectedPreset].from}`}
                      value={converterValue}
                      onChange={(e) => setConverterValue(e.target.value)}
                      data-ocid="chatbot.input"
                    />
                    <Button
                      size="sm"
                      onClick={doConvert}
                      data-ocid="chatbot.primary_button"
                    >
                      Go
                    </Button>
                  </div>
                  {converterResult && (
                    <div className="bg-muted rounded-lg p-3 text-center font-bold text-lg">
                      {converterResult}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
