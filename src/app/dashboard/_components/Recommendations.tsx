"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";

// Updated type for the data
type InfluencerData = {
  username: string;
  profile_url: string;
  profile_pic_url: string;
  thumbnail_url?: string;
  shortCode: string;
  caption: string;
  likesCount: number;
  commentsCount: number;
  url: string;
};

export default function Recommendations() {
  const [data, setData] = useState<InfluencerData[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const response = await fetch("/reels.json");
      const jsonData = await response.json();

      // Replace -1 likesCount with a random number between 1000-2000
      const updatedData = jsonData.map((item: InfluencerData) => ({
        ...item,
        likesCount: item.likesCount === -1 ? Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000 : item.likesCount,
      }));

      setData(updatedData);
    };

    loadData();
  }, []);

  return (
    <div className="pl-16 pr-12">
      <p className="py-8 text-2xl font-bold pl-2">Trending Reels</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((item, index) => (
          <Card key={index} className="max-w-sm border rounded-lg overflow-hidden shadow-lg">
            {/* Header: Profile pic & username */}
            <div className="flex items-center px-4">
              <Image
                src={item.profile_pic_url || "/default-profile-pic.jpg"}
                alt={item.username}
                width={32}
                height={32}
                className="rounded-full"
              />
              <a href={item.profile_url} target="_blank" rel="noopener noreferrer" className="ml-3 font-semibold hover:underline">
                {item.username}
              </a>
            </div>

            {/* Thumbnail as a link */}
            <CardContent className="p-0">
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                <Image
                  src={item.thumbnail_url || "/thumbnail-placeholder.jpg"}
                  alt="Reel Thumbnail"
                  width={400}
                  height={400}
                  className="w-full h-80 object-cover"
                />
              </a>
            </CardContent>

            {/* Likes & Comments in one line */}
            <CardFooter className="flex flex-col items-start px-4 py-2">
              <div className="flex items-center space-x-4 text-sm font-semibold">
                <div className="flex items-center space-x-1">
                  <Heart className="size-5 text-red-500" fill="red" stroke="none" />
                  <span>{item.likesCount}</span>
                </div>

                <div className="flex items-center space-x-1">
                  <MessageCircle className="size-5" />
                  <span>{item.commentsCount}</span>
                </div>
              </div>

              {/* Caption with truncation */}
              <p className="text-sm text-gray-700 mt-2 line-clamp-2 overflow-hidden">
                <span className="font-semibold">{item.username}</span> {item.caption || "No caption available"}
              </p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
