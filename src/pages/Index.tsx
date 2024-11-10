import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PlayCircle, PauseCircle, Download, Sparkles } from "lucide-react";

const Index = () => {
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [podcastText, setPodcastText] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(
    null
  );
  const { toast } = useToast();

  const generatePodcast = async () => {
    try {
      setIsLoading(true);
      setPodcastText("");
      setIsPlaying(false);
      window.speechSynthesis.cancel();

      const genAI = new GoogleGenerativeAI(
        "AIzaSyCo7BVnc1tEfz4zEoBV97zJ6nWFIPJn6TA"
      );
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `Create a natural, conversational 2-minute podcast about ${topic}. Focus on delivering interesting facts and insights in a casual, engaging way. Avoid any meta-references like 'intro,' 'outro,' or host names - just deliver the content as if you're having a friendly conversation with the listener.`;
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      setPodcastText(text);

      const newUtterance = new SpeechSynthesisUtterance(text);
      setUtterance(newUtterance);

      toast({
        title: "Podcast generated!",
        description: "Click play to listen to your AI podcast.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate podcast. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayPause = () => {
    if (!utterance) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);

      utterance.onend = () => {
        setIsPlaying(false);
      };
    }
  };

  const handleDownload = () => {
    if (!podcastText) return;

    const blob = new Blob([podcastText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `podcast-${topic.toLowerCase().replace(/\s+/g, "-")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-white tracking-tight">
            AI Podcast Generator
            <Sparkles className="inline-block ml-2 w-8 h-8 text-purple-400" />
          </h1>
          <p className="text-purple-200 text-lg">
            Transform any topic into an engaging podcast with AI
          </p>
        </div>
        <div className="flex justify-center">
          <Card className="p-6 shadow-2xl max-w-2xl w-full rounded-3xl bg-gray-800/50 border-purple-500/20 backdrop-blur-sm">
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="topic"
                  className="text-sm font-medium text-purple-200"
                >
                  What's on your mind?
                </label>
                <Input
                  id="topic"
                  placeholder="Enter your podcast topic..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="bg-gray-700/50 border-purple-500/30 text-white placeholder:text-gray-400 focus:border-purple-400"
                  disabled={isLoading}
                />
              </div>

              <Button
                onClick={generatePodcast}
                disabled={!topic || isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium transition-all duration-200 ease-in-out transform hover:scale-[1.02]"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </span>
                ) : (
                  "Generate Podcast"
                )}
              </Button>
            </div>
          </Card>
        </div>

        {podcastText && (
          <div className="flex justify-center">
            <Card className="p-6 space-y-4 max-w-2xl w-full rounded-3xl bg-gray-800/50 border-purple-500/20 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-purple-200">
                Your Generated Podcast
              </h2>
              <div className="prose max-w-none">
                <p className="text-gray-300 leading-relaxed">{podcastText}</p>
              </div>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Button
                    onClick={togglePlayPause}
                    variant="outline"
                    className="flex-1 bg-gray-700/50 border-purple-500/30 text-purple-200 hover:bg-purple-600/20 hover:text-purple-100"
                  >
                    {isPlaying ? (
                      <>
                        <PauseCircle className="w-5 h-5 mr-2" /> Pause
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-5 h-5 mr-2" /> Play
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="flex-1 bg-gray-700/50 border-purple-500/30 text-purple-200 hover:bg-purple-600/20 hover:text-purple-100"
                  >
                    <Download className="w-5 h-5 mr-2" /> Download
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
