import { Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function PhoneProtectionPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    setScanComplete(false);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 3000);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="relative h-48 bg-gradient-to-br from-protection-primary via-protection-secondary to-protection-accent overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <img src="/assets/generated/security-shield-transparent.dim_64x64.png" alt="Security" className="h-32 w-32" />
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Shield className="h-10 w-10" />
              Phone Protection
            </h1>
            <p className="text-white/90">Keep your device secure and protected</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="container mx-auto px-4 py-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Status</CardTitle>
                <CardDescription>Check your device security status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center py-8">
                  <img 
                    src="/assets/generated/security-shield-transparent.dim_64x64.png" 
                    alt="Security Shield" 
                    className={`h-32 w-32 ${isScanning ? 'animate-pulse' : ''}`}
                  />
                </div>
                
                {!scanComplete && !isScanning && (
                  <Button onClick={handleScan} className="w-full gap-2">
                    <Shield className="h-4 w-4" />
                    Run Security Scan
                  </Button>
                )}

                {isScanning && (
                  <div className="text-center space-y-2">
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary animate-pulse" style={{ width: '60%' }} />
                    </div>
                    <p className="text-sm text-muted-foreground">Scanning your device...</p>
                  </div>
                )}

                {scanComplete && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-semibold">Your device is secure!</span>
                    </div>
                    <Button onClick={handleScan} variant="outline" className="w-full">
                      Scan Again
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Security Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Keep your software up to date</li>
                    <li>• Use strong, unique passwords</li>
                    <li>• Enable two-factor authentication</li>
                    <li>• Be cautious with app permissions</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    Warning Signs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Unexpected battery drain</li>
                    <li>• Unusual data usage</li>
                    <li>• Slow performance</li>
                    <li>• Unknown apps installed</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
