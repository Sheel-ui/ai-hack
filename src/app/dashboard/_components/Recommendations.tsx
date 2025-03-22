"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from "@/components/ui/card"; // Assuming this is your card component
import Image from "next/image";

// Type for the data
type RestaurantData = {
  lead: string;
  username: string;
  followers: string;
  userLink: string;
  phones: string;
  emails: string;
  summary: string;
  instagram_data: {
    inputUrl: string;
    id: string;
    username: string;
    url: string;
    fullName: string;
    biography: string;
    externalUrls: string[];
    followersCount: number;
    followsCount: number;
    hasChannel: boolean;
    highlightReelCount: number;
    isBusinessAccount: boolean;
    joinedRecently: boolean;
    businessCategoryName: string;
    private: boolean;
    verified: boolean;
    profilePicUrl: string;
    profilePicUrlHD: string;
    igtvVideoCount: number;
  };
};

export default function Recommendations() {
  const [data, setData] = useState<RestaurantData[]>([]);

  // Load data from JSON file
  useEffect(() => {
    const loadData = async () => {
      const response = await fetch("/combined_data.json");
      const jsonData = await response.json();
      setData(jsonData);
    };

    loadData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((item, index) => (
        <Card key={index} className="max-w-xs">
          <CardHeader>
            <CardTitle>{item.instagram_data?.fullName || "No Name Available"}</CardTitle>
            <CardDescription>{item.instagram_data?.businessCategoryName || "No Category Available"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <Image
                src={item.instagram_data?.profilePicUrl || "/default-profile-pic.jpg"} // Fallback if profile picture is missing
                alt={item.instagram_data?.fullName || "Default Image"}
                width={100}
                height={100}
                className="rounded-full"
              />
              <p className="text-sm text-gray-600 mt-2">{item.instagram_data?.biography || "No biography available"}</p>
              <p className="text-sm text-gray-500 mt-1">Followers: {item.instagram_data?.followersCount || "N/A"}</p>
              <p className="text-sm text-gray-500 mt-1">Follows: {item.instagram_data?.followsCount || "N/A"}</p>
              <p className="text-sm text-gray-500 mt-1">Business Account: {item.instagram_data?.isBusinessAccount ? "Yes" : "No"}</p>
              <p className="text-sm text-gray-500 mt-1">Verified: {item.instagram_data?.verified ? "Yes" : "No"}</p>
              <p className="text-sm text-gray-500 mt-1">Phone: {item.phones || "Not Available"}</p>
              <p className="text-sm text-gray-500 mt-1">Email: {item.emails || "Not Available"}</p>
            </div>
          </CardContent>
          <CardFooter>
            <a href={item.instagram_data?.url || "#"} className="text-primary hover:underline">
              View Instagram
            </a>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
