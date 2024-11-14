import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 flex flex-col items-center justify-center relative"
    >
      {/* Content */}
      <div className="z-10 text-center space-y-8 px-4 max-w-3xl">
        <h1 className="text-6xl font-bold text-white tracking-tight">
          AI Podcast Generator
          <span className="block text-purple-400 mt-2">Transform Text into Talk</span>
        </h1>
        
        <p className="text-xl text-purple-200 leading-relaxed">
          Create engaging podcasts instantly with the power of AI. Turn any topic into a professionally narrated audio experience with just a few clicks.
        </p>

        <div className="animate-bounce">
          <Button 
            onClick={() => navigate("/create")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg rounded-full transition-all duration-200 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-purple-500/50"
          >
            Get Started
          </Button>
        </div>

        <div className="mt-12 flex gap-8 justify-center text-purple-300/80">
          <div className="text-center">
            <div className="text-3xl font-bold">Instant</div>
            <div className="text-sm">Generation</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">Natural</div>
            <div className="text-sm">Voice</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">Easy</div>
            <div className="text-sm">Download</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
