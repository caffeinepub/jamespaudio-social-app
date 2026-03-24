import { useState } from 'react';
import { Coins, Copy, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function RobuxSimulatorPage() {
  const [amount, setAmount] = useState('');
  const [username, setUsername] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!amount || !username) {
      toast.error('Please enter both amount and username');
      return;
    }

    const code = `ROBUX-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${amount}`;
    setGeneratedCode(code);
    toast.success('Pretend code generated! (This is just for fun)');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="relative h-48 bg-gradient-to-br from-robux-primary via-robux-secondary to-robux-accent overflow-hidden">
        <img src="/assets/generated/robux-coin-transparent.dim_64x64.png" alt="Robux" className="absolute right-10 top-10 h-24 w-24 opacity-30 animate-pulse" />
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Coins className="h-10 w-10" />
              Robux Simulator
            </h1>
            <p className="text-white/90">Fun pretend code generator (Not real!)</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="container mx-auto px-4 py-6 space-y-6">
            <Card className="border-warning bg-warning/5">
              <CardContent className="pt-6">
                <p className="text-sm text-center font-semibold">
                  ⚠️ This is a fun simulator only! These codes are not real and cannot be used in Roblox.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Generate Pretend Code</CardTitle>
                <CardDescription>Create a fun fake Robux code for entertainment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center py-4">
                  <img 
                    src="/assets/generated/robux-coin-transparent.dim_64x64.png" 
                    alt="Robux Coin" 
                    className="h-24 w-24"
                  />
                </div>

                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount (e.g., 1000)"
                  />
                </div>

                <div>
                  <Label htmlFor="username">Roblox Username (Pretend)</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter a username"
                  />
                </div>

                <Button onClick={handleGenerate} className="w-full gap-2">
                  <Coins className="h-4 w-4" />
                  Generate Pretend Code
                </Button>

                {generatedCode && (
                  <div className="space-y-3 p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-center gap-2">
                      <img 
                        src="/assets/generated/roblox-avatar-example.dim_200x200.png" 
                        alt="Avatar" 
                        className="h-12 w-12 rounded-full"
                      />
                      <div>
                        <p className="font-semibold">{username}</p>
                        <p className="text-sm text-muted-foreground">{amount} Robux (Pretend)</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Input value={generatedCode} readOnly className="font-mono" />
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={handleCopy}
                      >
                        {copied ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    <p className="text-xs text-center text-muted-foreground">
                      Remember: This is just for fun and cannot be used in Roblox!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
