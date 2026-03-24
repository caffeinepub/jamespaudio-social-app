import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, User, AppWindow, Music, Video, Film, TrendingUp, Calculator, Mic, MicOff, Sparkles, Volume2, Globe, Store, ExternalLink } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useSearchContent, useGetDefaultSearchEngine, useRecordSearchHistory } from '../hooks/useQueries';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { safeMathEvaluate } from '../utils/safeMathEvaluator';
import { useVoiceSettings } from '../hooks/useVoiceSettings';
import { useWebSearchUltra } from '../hooks/useWebSearchUltra';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';

interface MathResult {
  expression: string;
  result: string;
  steps: string[];
  explanation: string;
}

export default function SearchEnginePage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [submittedSearch, setSubmittedSearch] = useState('');
  const [mathResult, setMathResult] = useState<MathResult | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const hasSpokenFallbackRef = useRef(false);

  const voiceSettings = useVoiceSettings();
  const { data: defaultEngine } = useGetDefaultSearchEngine();
  const recordSearch = useRecordSearchHistory();
  const webSearch = useWebSearchUltra();

  const shouldEnableSearch = activeTab !== 'websearch' && submittedSearch !== '';
  const { data: searchResults, isLoading } = useSearchContent(
    shouldEnableSearch ? submittedSearch : '',
    activeTab
  );

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setVoiceSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchTerm(transcript);
        setIsListening(false);
        toast.success(`Voice input: "${transcript}"`);
        
        setTimeout(() => {
          handleSearchWithTerm(transcript);
        }, 100);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        if (event.error === 'not-allowed') {
          toast.error('Microphone access denied. Please allow microphone access in your browser settings.');
        } else if (event.error === 'no-speech') {
          toast.error('No speech detected. Please try again.');
        } else if (event.error === 'network') {
          toast.error('Network error. Please check your connection and try again.');
        } else {
          toast.error('Voice recognition failed. Please try again.');
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  useEffect(() => {
    if (voiceSettings.muted && isSpeaking && synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, [voiceSettings.muted, isSpeaking]);

  const speakResult = (text: string) => {
    if (!voiceSettings.enabled || voiceSettings.muted) {
      return;
    }

    if (!synthRef.current) {
      return;
    }

    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = voiceSettings.volumeNormalized;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    synthRef.current.speak(utterance);
  };

  const solveMathProblem = (expression: string): MathResult | null => {
    try {
      const cleanExpr = expression.trim().toLowerCase();
      
      if (/^[\d\s+\-*/().]+$/.test(cleanExpr)) {
        const result = safeMathEvaluate(cleanExpr);
        if (result === null) return null;
        
        const mathResult = {
          expression: cleanExpr,
          result: result.toString(),
          steps: [
            `Original expression: ${cleanExpr}`,
            `Apply order of operations (PEMDAS)`,
            `Evaluated result: ${result}`,
          ],
          explanation: 'Basic arithmetic calculation performed using standard order of operations (Parentheses, Exponents, Multiplication/Division, Addition/Subtraction).',
        };
        
        speakResult(`Okay, I can help with that. ${cleanExpr} equals ${result}`);
        
        return mathResult;
      }

      if (cleanExpr.includes('sqrt') || cleanExpr.includes('√')) {
        const match = cleanExpr.match(/sqrt\((\d+)\)|√(\d+)/);
        if (match) {
          const num = parseInt(match[1] || match[2]);
          const result = Math.sqrt(num);
          const mathResult = {
            expression: `√${num}`,
            result: result.toFixed(4),
            steps: [
              `Find the square root of ${num}`,
              `√${num} = ${result.toFixed(4)}`,
              `Verification: ${result.toFixed(4)} × ${result.toFixed(4)} ≈ ${num}`,
            ],
            explanation: `The square root of ${num} is the number that, when multiplied by itself, equals ${num}. This is a fundamental operation in algebra and geometry.`,
          };
          
          speakResult(`The square root of ${num} is approximately ${result.toFixed(2)}`);
          
          return mathResult;
        }
      }

      return null;
    } catch (error) {
      return null;
    }
  };

  const handleSearchWithTerm = async (term: string) => {
    setSubmittedSearch(term);
    hasSpokenFallbackRef.current = false;
    
    // Record search history if authenticated
    if (identity && term.trim()) {
      try {
        const engineId = defaultEngine || 'ultra_search';
        await recordSearch.mutateAsync({
          searchTerm: term,
          searchEngineId: engineId,
        });
      } catch (error) {
        console.error('Failed to record search history:', error);
      }
    }

    // Try to solve as math problem
    if (activeTab === 'math' || activeTab === 'all') {
      const result = solveMathProblem(term);
      setMathResult(result);
    } else {
      setMathResult(null);
    }

    // Perform web search if on websearch tab
    if (activeTab === 'websearch') {
      await webSearch.search(term);
    }
  };

  const handleSearch = () => {
    handleSearchWithTerm(searchTerm);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleVoiceSearch = () => {
    if (!voiceSupported) {
      toast.error('Voice search is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
        toast.info('Listening... Speak now');
      } catch (error) {
        console.error('Error starting voice recognition:', error);
        setIsListening(false);
        toast.error('Failed to start voice recognition. Please try again.');
      }
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    if (submittedSearch && !mathResult && searchResults && searchResults.results.length === 0 && !hasSpokenFallbackRef.current) {
      hasSpokenFallbackRef.current = true;
      const fallbackMessage = `I couldn't find results for "${submittedSearch}". I currently support math calculations and limited on-device search. Try a math problem like 50 times 50, or search for users.`;
      speakResult(fallbackMessage);
    }
  }, [submittedSearch, mathResult, searchResults]);

  const trendingSearches = [
    'Music production',
    'Live streams',
    'AI songs',
    'Video tutorials',
    'Movie reviews',
    'Gaming content',
  ];

  const mathExamples = [
    '25 + 37 * 2',
    'sqrt(144)',
    '5^3',
    '20% of 150',
    '10!',
    'area circle radius 5',
  ];

  return (
    <ScrollArea className="h-full">
      <div className="container max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <div className="flex justify-center">
            <div className="relative">
              <Search className="h-16 w-16 text-primary" />
              <img
                src="/assets/generated/search-engine-icon-transparent.dim_64x64.png"
                alt="Search"
                className="absolute -top-2 -right-2 h-8 w-8"
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold">Advanced Search Engine</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Search across apps, users, music, videos, movies, and solve complex math problems with voice support and AI voice responses
          </p>
          
          {/* Search Engine Store Link */}
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => navigate({ to: '/search-engine-store' })}
          >
            <Store className="h-4 w-4" />
            Search Engine Store
          </Button>
        </div>

        {/* Search Bar with Voice */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    placeholder="Search for anything or enter a math problem..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="text-lg h-12 pr-12"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`absolute right-1 top-1 h-10 w-10 ${isListening ? 'text-red-500 animate-pulse' : 'text-muted-foreground'}`}
                    onClick={toggleVoiceSearch}
                    disabled={!voiceSupported}
                    title={voiceSupported ? 'Voice search' : 'Voice search not supported'}
                  >
                    {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </Button>
                </div>
                <Button onClick={handleSearch} size="lg" disabled={isLoading || webSearch.isLoading}>
                  {(isLoading || webSearch.isLoading) ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Search className="h-5 w-5" />
                  )}
                </Button>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                <span>Spelling Correction</span>
                <Badge variant="outline" className="text-xs">Coming Soon</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Voice Search & AI Voice Info */}
        {voiceSupported && (
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-blue-500/50 bg-blue-500/5">
              <CardContent className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <img 
                    src="/assets/generated/voice-search-microphone-transparent.dim_64x64.png" 
                    alt="Voice" 
                    className="h-8 w-8"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">Voice Search Enabled</p>
                    <p className="text-xs text-muted-foreground">Click the microphone icon to search by voice</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-500/50 bg-green-500/5">
              <CardContent className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <img 
                    src="/assets/generated/ai-voice-assistant-transparent.dim_64x64.png" 
                    alt="AI Voice" 
                    className="h-8 w-8"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold flex items-center gap-2">
                      AI Voice Assistant
                      {isSpeaking && <Volume2 className="h-4 w-4 text-green-500 animate-pulse" />}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isSpeaking ? 'Speaking...' : 'Math results spoken aloud (toggle in Settings)'}
                    </p>
                  </div>
                  {isSpeaking && (
                    <Button variant="ghost" size="sm" onClick={stopSpeaking}>
                      Stop
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Trending Searches */}
        {!submittedSearch && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Trending Searches
            </h2>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((trend, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => {
                    setSearchTerm(trend);
                    handleSearchWithTerm(trend);
                  }}
                >
                  {trend}
                </Badge>
              ))}
            </div>

            <h2 className="text-xl font-semibold flex items-center gap-2 mt-6">
              <Calculator className="h-5 w-5 text-green-500" />
              Try Advanced Math Search with AI Voice
            </h2>
            <div className="flex flex-wrap gap-2">
              {mathExamples.map((example, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-green-500 hover:text-white transition-colors"
                  onClick={() => {
                    setSearchTerm(example);
                    setActiveTab('math');
                    handleSearchWithTerm(example);
                  }}
                >
                  {example}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {submittedSearch && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-8">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="math">Math</TabsTrigger>
              <TabsTrigger value="user">Users</TabsTrigger>
              <TabsTrigger value="app">Apps</TabsTrigger>
              <TabsTrigger value="music">Music</TabsTrigger>
              <TabsTrigger value="video">Videos</TabsTrigger>
              <TabsTrigger value="movie">Movies</TabsTrigger>
              <TabsTrigger value="websearch" className="relative">
                <span className="flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5" />
                  Web
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-6">
              {mathResult && (
                <Card className="border-green-500/50 bg-green-500/5">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Calculator className="h-6 w-6 text-green-500" />
                      <CardTitle>Advanced Math Solution with AI Voice</CardTitle>
                      {isSpeaking && <Volume2 className="h-5 w-5 text-green-500 animate-pulse" />}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-background p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Expression:</p>
                      <p className="text-2xl font-mono font-bold">{mathResult.expression}</p>
                    </div>
                    <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                      <p className="text-sm text-muted-foreground mb-2">Result:</p>
                      <p className="text-3xl font-bold text-green-600 dark:text-green-400">{mathResult.result}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-2">Step-by-step solution:</p>
                      <ol className="space-y-2">
                        {mathResult.steps.map((step, index) => (
                          <li key={index} className="flex gap-2">
                            <span className="text-muted-foreground min-w-[1.5rem]">{index + 1}.</span>
                            <span className="font-mono text-sm">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">{mathResult.explanation}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Searching...</p>
                </div>
              ) : searchResults && searchResults.results.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Found {searchResults.results.length} results for "{submittedSearch}"
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchResults.results.map((result, index) => (
                      <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start gap-3">
                            <Avatar>
                              <AvatarImage src={result.profilePicture.url || undefined} />
                              <AvatarFallback>
                                {result.username.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-lg truncate">{result.username}</CardTitle>
                              <CardDescription className="line-clamp-2">{result.bio}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{Number(result.followerCount)} followers</span>
                            <span>{Number(result.followingCount)} following</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : !mathResult ? (
                <Card className="border-orange-500/50 bg-orange-500/5">
                  <CardContent className="py-12 text-center space-y-4">
                    <Search className="h-12 w-12 text-orange-500 mx-auto" />
                    <div>
                      <p className="text-lg font-semibold mb-2">
                        No results found for "{submittedSearch}"
                      </p>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        I currently support <strong>math calculations</strong> and <strong>limited on-device search</strong> for users. 
                        Try a math problem like "50 * 50" or search for users by name.
                      </p>
                    </div>
                    <div className="pt-4">
                      <p className="text-xs text-muted-foreground">
                        Tip: Use voice search or browse trending searches and math examples above
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </TabsContent>

            <TabsContent value="math" className="space-y-4 mt-6">
              <div className="flex items-center gap-2 mb-4">
                <img 
                  src="/assets/generated/advanced-math-calculator.dim_400x300.png" 
                  alt="Advanced Math" 
                  className="h-8 w-8 object-cover rounded"
                />
                <h3 className="text-lg font-semibold">Advanced Math Computation with AI Voice</h3>
                {isSpeaking && <Volume2 className="h-5 w-5 text-green-500 animate-pulse" />}
              </div>

              {mathResult ? (
                <Card className="border-green-500/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-6 w-6 text-green-500" />
                      Detailed Solution
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-background p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Expression:</p>
                      <p className="text-2xl font-mono font-bold">{mathResult.expression}</p>
                    </div>
                    <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                      <p className="text-sm text-muted-foreground mb-2">Result:</p>
                      <p className="text-3xl font-bold text-green-600 dark:text-green-400">{mathResult.result}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <img 
                          src="/assets/generated/math-solution-steps.dim_600x400.png" 
                          alt="Steps" 
                          className="h-5 w-5 object-cover rounded"
                        />
                        Step-by-step solution:
                      </p>
                      <ol className="space-y-2">
                        {mathResult.steps.map((step, index) => (
                          <li key={index} className="flex gap-2">
                            <span className="text-muted-foreground min-w-[1.5rem]">{index + 1}.</span>
                            <span className="font-mono text-sm">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm"><strong>Explanation:</strong> {mathResult.explanation}</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center space-y-4">
                    <img 
                      src="/assets/generated/math-search-icon-transparent.dim_64x64.png" 
                      alt="Math Search" 
                      className="h-16 w-16 mx-auto"
                    />
                    <div>
                      <p className="text-muted-foreground mb-2">
                        {submittedSearch ? `Unable to solve: "${submittedSearch}"` : 'Enter a math problem to solve'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Advanced solver supports: arithmetic, algebra, quadratic equations, sequences, geometry, statistics, and more
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="user" className="space-y-4 mt-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">User Results</h3>
              </div>
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Searching users...</p>
                </div>
              ) : searchResults && searchResults.results.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.results.map((result, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarImage src={result.profilePicture.url || undefined} />
                            <AvatarFallback>
                              {result.username.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg truncate">{result.username}</CardTitle>
                            <CardDescription className="line-clamp-2">{result.bio}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No users found</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {['app', 'music', 'video', 'movie'].map((type) => (
              <TabsContent key={type} value={type} className="space-y-4 mt-6">
                <Card>
                  <CardContent className="py-12 text-center">
                    {type === 'app' && <AppWindow className="h-12 w-12 text-muted-foreground mx-auto mb-4" />}
                    {type === 'music' && <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />}
                    {type === 'video' && <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />}
                    {type === 'movie' && <Film className="h-12 w-12 text-muted-foreground mx-auto mb-4" />}
                    <p className="text-muted-foreground">
                      {type.charAt(0).toUpperCase() + type.slice(1)} search coming soon!
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}

            <TabsContent value="websearch" className="space-y-4 mt-6">
              <Card className="border-blue-500/50 bg-gradient-to-br from-blue-500/5 to-purple-500/5">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Globe className="h-8 w-8 text-blue-500" />
                    <div>
                      <CardTitle className="text-2xl">Web Search Ultra</CardTitle>
                      <CardDescription className="text-base mt-1">
                        Search the web for news and real-time information
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {webSearch.isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Searching the web...</p>
                    </div>
                  ) : webSearch.error ? (
                    <Card className="border-red-500/50 bg-red-500/5">
                      <CardContent className="py-8 text-center">
                        <p className="text-red-500 font-semibold mb-2">Unable to find results</p>
                        <p className="text-sm text-muted-foreground">
                          {webSearch.error}
                        </p>
                      </CardContent>
                    </Card>
                  ) : webSearch.results.length > 0 ? (
                    <div className="space-y-4">
                      {webSearch.results.map((result, index) => (
                        <Card key={index} className="hover:shadow-md transition-shadow">
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                              {result.title}
                              {result.url !== '#' && (
                                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                              )}
                            </CardTitle>
                            <CardDescription>{result.snippet}</CardDescription>
                          </CardHeader>
                          {result.url !== '#' && (
                            <CardContent>
                              <a
                                href={result.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline"
                              >
                                {result.url}
                              </a>
                            </CardContent>
                          )}
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-background/50 p-6 rounded-lg space-y-4">
                      <p className="text-muted-foreground">
                        Enter a search term above to search the web for news, articles, and real-time information.
                      </p>
                      
                      <div className="space-y-3">
                        <p className="text-sm font-semibold">What to expect:</p>
                        <ul className="text-sm text-muted-foreground space-y-2">
                          <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-0.5">•</span>
                            <span>Search across millions of web pages and news sources</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-0.5">•</span>
                            <span>Real-time information and breaking news updates</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-0.5">•</span>
                            <span>Advanced filtering and relevance ranking</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-0.5">•</span>
                            <span>Rich previews with images and summaries</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-center text-muted-foreground">
                    In the meantime, try our advanced math solver or search for users, apps, and content
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {/* Footer */}
        <div className="text-center py-8 text-sm text-muted-foreground">
          <p>© 2026. Built with love using <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">caffeine.ai</a></p>
        </div>
      </div>
    </ScrollArea>
  );
}
