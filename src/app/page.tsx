"use client"; // Ensures this component runs on the client-side
import { useState } from "react"; // For form state management
import { Link2, Loader2, Send } from "lucide-react"; // Icons for form
import Image from "next/image"; // For optimized image
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const [url, setUrl] = useState(""); // State for holding the pasted URL
  const [isLoading, setIsLoading] = useState(false); // Loading state for image
  const [imageLoaded, setImageLoaded] = useState(false); // State to track image load

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setImageLoaded(true); // Enable "Get Started" button after image loads
    }, 2000); // Simulating a 2-second loading time
  };


  return (
    <div className="h-screen w-screen flex justify-center">
      <div className="w-full max-w-lg p-6 space-y-6 bg-white rounded-lg shadow-md">
        {/* Title Section */}
        <h1 className="text-2xl text-center font-semibold pt-12">Welcome to TrendBite</h1>
        <p className="text-sm text-center text-gray-600">
          Paste your restaurant website or Instagram link, or fill out the form to get detailed marketing insights.
        </p>

        {/* Form Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {/* Input Field */}
            <div className="flex items-center border border-gray-300 px-2 rounded-lg w-full">
              <Link2 className="text-primary h-4 w-4" />
              <input
                type="text"
                placeholder="Paste your URL here"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full p-2 text-sm border-none focus:outline-none focus:ring-0"
              />
            </div>
            {/* Submit Button */}
            <Button onClick={handleSubmit}>
              <Send />
            </Button>
          </div>

          {/* Loading Effect */}
          {isLoading && (
            <div className="flex justify-center items-center space-x-2 pt-4">
              <Loader2 className="animate-spin text-primary h-6 w-6" />
              <p className="text-sm text-gray-600">Scraping Data From the Web</p>
            </div>
          )}
        </div>
        
        {/* Show the marketing insights and Get Started button */}
        {!isLoading && imageLoaded && (
          <div className="text-center space-y-4">
            {/* Simulated Image with Next.js Image Component */}
            <Image
              src="/home.png" // Placeholder image
              alt="Marketing Insights Image"
              width={900} // Define width
              height={900} // Define height
              className="w-full h-auto rounded-lg"
            />

            {/* Get Started Button */}
            <Link href={'/dashboard'}>
            <Button disabled={!imageLoaded}>
              Get Started <span className="pl-2">🚀</span>
            </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
