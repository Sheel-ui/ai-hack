"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";

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
      setData(jsonData);
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
            <div className="flex items-center p-4">
              <Image
                src={item.profile_pic_url || "/default-profile-pic.jpg"}
                alt={item.username}
                width={40}
                height={40}
                className="rounded-full"
              />
              <a href={item.profile_url} target="_blank" rel="noopener noreferrer" className="ml-3 font-semibold hover:underline">
                {item.username}
              </a>
            </div>

            {/* Thumbnail */}
            <CardContent className="p-0">
              <Image
                src={item.thumbnail_url || "/thumbnail-placeholder.jpg"}
                alt="Reel Thumbnail"
                width={400}
                height={400}
                className="w-full h-80 object-cover"
              />
            </CardContent>

            {/* Likes & Comments */}
            <CardFooter className="flex flex-col items-start p-4">
              <p className="text-sm font-semibold">❤️ {item.likesCount} Likes</p>
              <p className="text-sm text-gray-500">💬 {item.commentsCount} Comments</p>
              {/* Caption */}
              <p className="text-sm text-gray-700 mt-2">
                <span className="font-semibold">{item.username}</span> {item.caption || "No caption available"}
              </p>
              {/* Watch Reel Link */}
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline mt-2">
                Watch Reel
              </a>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
