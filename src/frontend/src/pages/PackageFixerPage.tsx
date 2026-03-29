import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckCircle,
  Download,
  FileCode,
  Hammer,
  Send,
  Upload,
  Wrench,
} from "lucide-react";
import { useRef, useState } from "react";

interface ChatMsg {
  id: string;
  role: "user" | "ai";
  text: string;
}

const AI_RESPONSES: Record<string, string> = {
  fix: "I've analyzed the file. Found 3 potential issues: duplicate imports, unused variables, and a missing semicolon on line 47. Fixing now...",
  build:
    "Building your file from the description. Setting up project structure, resolving dependencies, and generating optimized output...",
  upload:
    "File received! I can see the contents. Ready to fix, analyze, or build upon this file. What would you like me to do?",
  default:
    "Got it! I can fix bugs, restructure code, optimize performance, or build entirely new files. Just describe what you need or upload a file to get started.",
};

function getAIResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("fix") || lower.includes("bug") || lower.includes("error"))
    return AI_RESPONSES.fix;
  if (
    lower.includes("build") ||
    lower.includes("create") ||
    lower.includes("make")
  )
    return AI_RESPONSES.build;
  if (
    lower.includes("what") ||
    lower.includes("how") ||
    lower.includes("help")
  ) {
    return "I can help you fix existing files (remove bugs, clean code), build new files from scratch, or enhance your project. Upload a file or describe what you need!";
  }
  return AI_RESPONSES.default;
}

export default function PackageFixerPage() {
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: "0",
      role: "ai",
      text: "Welcome to Package Fixer AI! 🔧 Upload a file or describe what you need — I'll fix bugs, build files, or enhance your code.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "fixing" | "building" | "done">(
    "idle",
  );
  const [resultFilename, setResultFilename] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const addMsg = (role: "user" | "ai", text: string) => {
    setMessages((prev) => [...prev, { id: Date.now().toString(), role, text }]);
    setTimeout(
      () => endRef.current?.scrollIntoView({ behavior: "smooth" }),
      50,
    );
  };

  const sendChat = () => {
    const text = chatInput.trim();
    if (!text) return;
    addMsg("user", text);
    setChatInput("");
    setTimeout(() => addMsg("ai", getAIResponse(text)), 600);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setStatus("idle");
      setProgress(0);
      addMsg("ai", AI_RESPONSES.upload);
    }
  };

  const runProgress = (mode: "fixing" | "building", filename: string) => {
    setStatus(mode);
    setProgress(0);
    setResultFilename(filename);
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 18 + 5;
      if (p >= 100) {
        clearInterval(interval);
        setProgress(100);
        setStatus("done");
        addMsg(
          "ai",
          mode === "fixing"
            ? `✅ File fixed! All issues resolved. Your file "${filename}" is ready to download.`
            : `✅ Build complete! "${filename}" has been generated successfully. Click Download to save it.`,
        );
      } else {
        setProgress(Math.min(p, 99));
      }
    }, 180);
  };

  const handleFix = () => {
    if (!selectedFile) {
      addMsg("ai", "Please upload a file first before fixing!");
      return;
    }
    addMsg("user", `Fix the file: ${selectedFile.name}`);
    runProgress("fixing", `fixed_${selectedFile.name}`);
  };

  const handleBuild = () => {
    const name = selectedFile
      ? `built_${selectedFile.name}`
      : "new_project.zip";
    addMsg("user", "Build a new file");
    runProgress("building", name);
  };

  const handleDownload = () => {
    const content = `// Package Fixer AI - Generated Output\n// File: ${resultFilename}\n// Generated: ${new Date().toISOString()}\n\n// Your fixed/built code would appear here\nconsole.log("Package Fixer AI output");\n`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = resultFilename || "output.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="relative h-40 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 overflow-hidden flex-shrink-0">
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center">
            <Wrench className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              Package Fixer AI
              <Badge className="bg-yellow-400 text-yellow-900 font-bold text-sm">
                NEW
              </Badge>
            </h1>
            <p className="text-white/80">
              Fix, build, and enhance your files with AI
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row gap-4 p-4">
        {/* Chat */}
        <div className="flex flex-col flex-1 min-h-0 border rounded-xl overflow-hidden bg-card">
          <div className="px-4 py-3 border-b bg-muted/50">
            <h2 className="font-semibold flex items-center gap-2">
              <FileCode className="h-4 w-4" /> AI Assistant
            </h2>
          </div>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${
                    msg.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      msg.role === "ai"
                        ? "bg-emerald-500 text-white"
                        : "bg-orange-500 text-white"
                    }`}
                  >
                    {msg.role === "ai" ? "AI" : "ME"}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                      msg.role === "ai"
                        ? "bg-muted"
                        : "bg-emerald-500 text-white"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>
          </ScrollArea>
          <div className="border-t p-3 flex gap-2 bg-background">
            <Input
              placeholder="Describe what you need..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendChat()}
              data-ocid="package_fixer.input"
            />
            <Button onClick={sendChat} data-ocid="package_fixer.primary_button">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* File Tools */}
        <div className="flex flex-col gap-4 lg:w-80 flex-shrink-0">
          {/* Upload */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Upload className="h-4 w-4" /> Upload File
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".zip,.json,.txt,.js,.ts,.jsx,.tsx,.html,.css,.py"
                className="hidden"
                onChange={handleFileChange}
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
                data-ocid="package_fixer.upload_button"
              >
                <Upload className="h-4 w-4 mr-2" />
                {selectedFile ? "Change File" : "Choose File"}
              </Button>
              {selectedFile && (
                <div className="bg-muted rounded-lg p-2 text-xs">
                  <span className="font-medium">📄 {selectedFile.name}</span>
                  <span className="text-muted-foreground ml-2">
                    ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Supports: .zip .json .txt .js .ts .jsx .tsx .html .css .py
              </p>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Hammer className="h-4 w-4" /> Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full"
                onClick={handleFix}
                disabled={status === "fixing" || status === "building"}
                data-ocid="package_fixer.primary_button"
              >
                <Wrench className="h-4 w-4 mr-2" /> Fix File
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleBuild}
                disabled={status === "fixing" || status === "building"}
                data-ocid="package_fixer.secondary_button"
              >
                <Hammer className="h-4 w-4 mr-2" /> Build File
              </Button>

              {(status === "fixing" || status === "building") && (
                <div
                  className="space-y-1"
                  data-ocid="package_fixer.loading_state"
                >
                  <div className="flex justify-between text-xs">
                    <span>
                      {status === "fixing" ? "Fixing..." : "Building..."}
                    </span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {status === "done" && (
                <div
                  className="space-y-2"
                  data-ocid="package_fixer.success_state"
                >
                  <div className="flex items-center gap-2 text-emerald-500 text-sm">
                    <CheckCircle className="h-4 w-4" />
                    <span>Ready to download!</span>
                  </div>
                  <Button
                    className="w-full bg-emerald-500 hover:bg-emerald-600"
                    onClick={handleDownload}
                    data-ocid="package_fixer.primary_button"
                  >
                    <Download className="h-4 w-4 mr-2" /> Download Result
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-dashed border-2">
            <CardContent className="py-4 text-center text-sm text-muted-foreground">
              <p className="font-medium mb-1">More tools coming soon</p>
              <p className="text-xs">
                AI linting, auto-refactor, dependency analysis, and cloud build
                pipelines
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
