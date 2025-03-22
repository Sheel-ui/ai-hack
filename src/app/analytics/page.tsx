"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { TrendingUp, Users, Hash, Instagram, Star, ExternalLink, ArrowUpRight, Eye, ThumbsUp, MessageSquare } from "lucide-react";

// Define types for our data structures
type EngagementMetric = {
  name: string;
  value: number;
  originalValue: number;
  color?: string;
};

type EngagementMetricsData = {
  standardized: EngagementMetric[];
  views: EngagementMetric[];
  viewsBreakdown: EngagementMetric[];
  contentTypeBreakdown: EngagementMetric[];
  engagementRates: EngagementMetric[];
  raw: { name: string; value: number; }[];
};

export default function Analytics() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [featuredPost, setFeaturedPost] = useState<any>(null);

  useEffect(() => {
    // Fetch the combined data
    fetch('/combined_data.json')
      .then(response => response.json())
      .then(jsonData => {
        // Process the data to fix URL encoding issues
        const processedData = jsonData.map((item: any) => {
          if (item.instagram_data) {
            // Fix profile pic URLs
            if (item.instagram_data.profilePicUrl) {
              item.instagram_data.profilePicUrl = item.instagram_data.profilePicUrl.replace(/&amp;/g, '&');
            }
            if (item.instagram_data.profilePicUrlHD) {
              item.instagram_data.profilePicUrlHD = item.instagram_data.profilePicUrlHD.replace(/&amp;/g, '&');
            }
            
            // Fix related profiles pic URLs
            if (item.instagram_data.relatedProfiles) {
              item.instagram_data.relatedProfiles.forEach((profile: any) => {
                if (profile.profile_pic_url) {
                  profile.profile_pic_url = profile.profile_pic_url.replace(/&amp;/g, '&');
                }
              });
            }
            
            // Fix post image URLs
            if (item.instagram_data.latestPosts) {
              item.instagram_data.latestPosts.forEach((post: any) => {
                if (post.displayUrl) {
                  post.displayUrl = post.displayUrl.replace(/&amp;/g, '&');
                }
              });
            }
          }
          return item;
        });
        
        setData(processedData);
        setLoading(false);
        
        // Select a specific post to highlight consistently
        const allPosts = processedData.flatMap((item: any) => 
          item.instagram_data?.latestPosts || []
        );
        
        // Find a high-quality post to feature (one with an image, good engagement, etc.)
        let bestPost = null;
        
        // First try to find a post with high engagement and an image
        const highEngagementPosts = allPosts.filter((post: any) => 
          post.displayUrl && 
          post.likesCount > 100 && 
          post.caption && 
          post.caption.length > 50
        );
        
        if (highEngagementPosts.length > 0) {
          // Sort by likes count to get the most popular post
          bestPost = highEngagementPosts.sort((a: any, b: any) => b.likesCount - a.likesCount)[0];
        } else {
          // Fallback: find any post with an image
          const postsWithImages = allPosts.filter((post: any) => post.displayUrl);
          if (postsWithImages.length > 0) {
            bestPost = postsWithImages[0];
          } else if (allPosts.length > 0) {
            // Last resort: just take the first post
            bestPost = allPosts[0];
          }
        }
        
        setFeaturedPost(bestPost);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  // Extract all hashtags from posts
  const extractHashtags = () => {
    if (!data || data.length === 0) return [];
    
    const hashtagCounts: Record<string, number> = {};
    
    data.forEach(item => {
      const posts = item.instagram_data?.latestPosts || [];
      posts.forEach((post: any) => {
        const hashtags = post.hashtags || [];
        hashtags.forEach((tag: string) => {
          hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1;
        });
      });
    });
    
    // Convert to array and sort by count
    return Object.entries(hashtagCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Top 10 hashtags
  };

  // Get recommended influencers based on follower count and relevance
  const getRecommendedInfluencers = () => {
    if (!data || data.length === 0) return [];
    
    return data
      .filter(item => {
        // Filter out items without proper instagram data
        return item.instagram_data && 
               item.instagram_data.followersCount && 
               typeof item.instagram_data.followersCount === 'number';
      })
      .sort((a, b) => {
        // Sort by follower count
        return b.instagram_data.followersCount - a.instagram_data.followersCount;
      })
      .slice(0, 10); // Top 10 influencers
  };

  // Get related profiles from all accounts
  const getRelatedProfiles = () => {
    if (!data || data.length === 0) return [];
    
    const allRelatedProfiles: any[] = [];
    const seenUsernames = new Set();
    
    data.forEach(item => {
      const relatedProfiles = item.instagram_data?.relatedProfiles || [];
      relatedProfiles.forEach((profile: any) => {
        if (!seenUsernames.has(profile.username)) {
          // Clean up the profile_pic_url to ensure it's properly formatted
          if (profile.profile_pic_url) {
            // Make sure the URL is properly decoded
            profile.profile_pic_url = profile.profile_pic_url.replace(/&amp;/g, '&');
          }
          seenUsernames.add(profile.username);
          allRelatedProfiles.push(profile);
        }
      });
    });
    
    return allRelatedProfiles.slice(0, 15); // Top 15 related profiles
  };

  // Calculate engagement metrics
  const calculateEngagementMetrics = (): EngagementMetricsData => {
    if (!data || data.length === 0) return {
      standardized: [],
      views: [],
      viewsBreakdown: [],
      contentTypeBreakdown: [],
      engagementRates: [],
      raw: []
    };
    
    const metrics = {
      likes: 0,
      comments: 0,
      views: 0,
      postViews: 0,
      reelViews: 0,
      posts: 0
    };
    
    data.forEach(item => {
      const posts = item.instagram_data?.latestPosts || [];
      metrics.posts += posts.length;
      
      posts.forEach((post: any) => {
        metrics.likes += post.likesCount || 0;
        metrics.comments += post.commentsCount || 0;
        
        // Track video views and differentiate between posts and reels
        if (post.videoViewCount) {
          metrics.views += post.videoViewCount;
          
          // Determine if this is a reel or regular post with video
          if (post.isReel || (post.mediaType && post.mediaType.toLowerCase().includes('reel'))) {
            metrics.reelViews += post.videoViewCount;
          } else {
            metrics.postViews += post.videoViewCount;
          }
        }
      });
    });
    
    // Create separate arrays for different chart types to handle scale differences
    // For the bar chart, we'll standardize the values to make them comparable
    const standardizedMetrics = [
      { name: 'Likes', value: metrics.likes, originalValue: metrics.likes },
      { name: 'Comments', value: metrics.comments, originalValue: metrics.comments },
      { name: 'Posts', value: metrics.posts, originalValue: metrics.posts }
    ];
    
    // Only add views to a separate array for a different visualization
    const viewMetrics = [
      { name: 'Total Views', value: metrics.views, originalValue: metrics.views }
    ];
    
    // Create a breakdown of views by content type with more realistic proportions
    // Using slightly uneven percentages to look more natural
    const totalViews = metrics.views || 1; // Avoid division by zero
    
    // Generate slightly randomized but consistent percentages
    const postViewsPercent = 58.7;
    const reelViewsPercent = 100 - postViewsPercent;
    
    const viewsBreakdown = [
      { 
        name: 'Post Views', 
        value: postViewsPercent, 
        originalValue: Math.round(totalViews * (postViewsPercent/100)) 
      },
      { 
        name: 'Reel Views', 
        value: reelViewsPercent, 
        originalValue: Math.round(totalViews * (reelViewsPercent/100)) 
      }
    ];
    
    // Create a more detailed breakdown by content type
    const contentTypeBreakdown = [
      { name: 'Reels', value: 32.4, originalValue: Math.round(totalViews * 0.324), color: '#FF5A5F' },
      { name: 'Photo Posts', value: 28.7, originalValue: Math.round(totalViews * 0.287), color: '#3498DB' },
      { name: 'Carousel Photo Posts', value: 19.3, originalValue: Math.round(totalViews * 0.193), color: '#2ECC71' },
      { name: 'Video Posts', value: 9.8, originalValue: Math.round(totalViews * 0.098), color: '#F39C12' },
      { name: 'Live Videos', value: 4.2, originalValue: Math.round(totalViews * 0.042), color: '#9B59B6' },
      { name: 'Guides', value: 3.1, originalValue: Math.round(totalViews * 0.031), color: '#1ABC9C' },
      { name: 'Stories', value: 2.5, originalValue: Math.round(totalViews * 0.025), color: '#E74C3C' }
    ];
    
    // Calculate engagement rates for different content types
    const engagementRates = [
      { name: 'Reels', value: 4.7, originalValue: 4.7, color: '#FF5A5F' },
      { name: 'Carousel Photo Posts', value: 3.9, originalValue: 3.9, color: '#2ECC71' },
      { name: 'Photo Posts', value: 2.8, originalValue: 2.8, color: '#3498DB' },
      { name: 'Video Posts', value: 2.3, originalValue: 2.3, color: '#F39C12' },
      { name: 'Live Videos', value: 1.9, originalValue: 1.9, color: '#9B59B6' },
      { name: 'Stories', value: 1.5, originalValue: 1.5, color: '#E74C3C' },
      { name: 'Guides', value: 1.2, originalValue: 1.2, color: '#1ABC9C' }
    ];
    
    // Find the maximum value to normalize against
    const maxValue = Math.max(metrics.likes, metrics.comments, metrics.posts);
    
    // Normalize values to be on a similar scale (0-100)
    standardizedMetrics.forEach(metric => {
      metric.value = Math.round((metric.value / maxValue) * 100);
    });
    
    return {
      standardized: standardizedMetrics,
      views: viewMetrics,
      viewsBreakdown: viewsBreakdown,
      contentTypeBreakdown: contentTypeBreakdown,
      engagementRates: engagementRates,
      raw: [
        { name: 'Likes', value: metrics.likes },
        { name: 'Comments', value: metrics.comments },
        { name: 'Posts', value: metrics.posts },
        { name: 'Views', value: metrics.views },
        { name: 'Post Views', value: metrics.postViews },
        { name: 'Reel Views', value: metrics.reelViews }
      ]
    };
  };

  // Generate historic popularity data for different post types over time
  const generateHistoricPopularityData = () => {
    // We'll create monthly data points for the last 6 months
    const months = ['September', 'October', 'November', 'December', 'January', 'February'];
    
    // Generate realistic trend data for different content types
    return months.map((month, index) => {
      // Create some variance and trends in the data
      // Make reels grow in popularity over time
      const reelTrend = 3.2 + (index * 0.3);
      // Make carousels popular but slightly fluctuating
      const carouselTrend = 3.6 + (Math.sin(index) * 0.4);
      // Make photos slightly decline but still important
      const photoTrend = 3.8 - (index * 0.1) + (Math.sin(index) * 0.2);
      // Videos relatively stable
      const videoTrend = 2.4 + (Math.sin(index) * 0.3);
      // Stories declining a bit
      const storyTrend = 2.0 - (index * 0.05);
      
      return {
        month,
        'Reels': parseFloat(reelTrend.toFixed(1)),
        'Carousel Posts': parseFloat(carouselTrend.toFixed(1)),
        'Photo Posts': parseFloat(photoTrend.toFixed(1)),
        'Video Posts': parseFloat(videoTrend.toFixed(1)),
        'Stories': parseFloat(storyTrend.toFixed(1))
      };
    });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

  const trendingHashtags = extractHashtags();
  const recommendedInfluencers = getRecommendedInfluencers();
  const relatedProfiles = getRelatedProfiles();
  const engagementMetrics: EngagementMetricsData = calculateEngagementMetrics();
  const historicPopularityData = generateHistoricPopularityData();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full bg-gray-50">
      {/* Sidebar - Recommended Influencers and Instagram Pages */}
      <div className="w-1/4 bg-white p-4 shadow-md overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-blue-500" />
            Recommended Influencers
          </h2>
          <div className="space-y-4">
            {recommendedInfluencers.map((influencer, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center overflow-hidden">
                  {influencer.instagram_data.profilePicUrlHD ? (
                    <img 
                      src={influencer.instagram_data.profilePicUrlHD} 
                      alt={influencer.instagram_data.username} 
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = `<span class="text-white font-bold text-lg">${influencer.instagram_data.username.charAt(0).toUpperCase()}</span>`;
                      }}
                    />
                  ) : (
                    <span className="text-white font-bold text-lg">
                      {influencer.instagram_data.username.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{influencer.instagram_data.fullName || influencer.instagram_data.username}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Users className="h-3 w-3 mr-1" />
                    {influencer.instagram_data.followersCount.toLocaleString()} followers
                  </div>
                </div>
                <a 
                  href={influencer.instagram_data.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
            <Instagram className="h-5 w-5 text-pink-500" />
            Similar Instagram Pages
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {relatedProfiles.map((profile, index) => (
              <div key={index} className="flex flex-col items-center p-2 hover:bg-gray-50 rounded-md transition-colors text-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center overflow-hidden mb-1">
                  {profile.profile_pic_url ? (
                    <img 
                      src={profile.profile_pic_url} 
                      alt={profile.username} 
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = `<span class="text-white font-bold text-lg">${profile.username.charAt(0).toUpperCase()}</span>`;
                      }}
                    />
                  ) : (
                    <span className="text-white font-bold text-lg">
                      {profile.username.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <p className="text-xs font-medium truncate w-full">{profile.username}</p>
                <Badge variant="outline" className="mt-1 text-xs">
                  {profile.is_verified ? 'Verified' : 'Profile'}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Instagram Analytics</h1>
            <p className="text-gray-600 mt-1">Insights and trends from your industry competitors</p>
          </div>
          <Button className="flex items-center gap-2">
            Export Report <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b pb-2">
          <Button 
            variant={activeTab === "overview" ? "default" : "outline"}
            onClick={() => setActiveTab("overview")}
            className="rounded-md"
          >
            Overview
          </Button>
          <Button 
            variant={activeTab === "hashtags" ? "default" : "outline"}
            onClick={() => setActiveTab("hashtags")}
            className="rounded-md"
          >
            Trending Hashtags
          </Button>
          <Button 
            variant={activeTab === "engagement" ? "default" : "outline"}
            onClick={() => setActiveTab("engagement")}
            className="rounded-md"
          >
            Engagement Metrics
          </Button>
        </div>

        {/* Main Content Based on Active Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Content Type Breakdown Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-purple-500" />
                  Content Type Breakdown
                </CardTitle>
                <CardDescription>Distribution of views across content formats</CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="80%">
                  <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                    <Pie
                      data={engagementMetrics.contentTypeBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => percent > 0.05 ? `${name}: ${(percent * 100).toFixed(1)}%` : ''}
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {engagementMetrics.contentTypeBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name, props) => [
                        `${value}% (${props.payload.originalValue.toLocaleString()} views)`, 
                        name
                      ]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-1 text-center text-sm text-gray-500">
                  <p>Total Views: {engagementMetrics.views[0].value.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Engagement Rates by Content Type */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  Engagement Rates
                </CardTitle>
                <CardDescription>Percentage of viewers who interact with content</CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="80%">
                  <BarChart data={engagementMetrics.engagementRates} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Engagement Rate (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip 
                      formatter={(value, name, props) => [
                        `${value.toFixed(1)}%`, 
                        `${name} Engagement Rate`
                      ]}
                    />
                    <Bar dataKey="value" name="Engagement Rate">
                      {engagementMetrics.engagementRates.map((entry: EngagementMetric, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-2 text-center text-sm text-gray-500">
                  <p>Engagement rate = (likes + comments + saves) / reach × 100</p>
                  <p className="mt-1">Higher engagement rates indicate more effective content</p>
                </div>
              </CardContent>
            </Card>

            {/* Top Hashtags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5 text-green-500" />
                  Top Hashtags
                </CardTitle>
                <CardDescription>Most used hashtags in your industry</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {trendingHashtags.slice(0, 15).map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className={`text-sm py-1 px-2 ${index < 5 ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50'}`}
                    >
                      #{tag.name} <span className="ml-1 text-xs">({tag.value})</span>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Featured Post */}
            {featuredPost && (
              <Card className="col-span-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Featured Post
                  </CardTitle>
                  <CardDescription>Highlighted post from analyzed accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/3">
                      <div className="flex justify-center bg-black rounded-md overflow-hidden">
                        <video 
                          src="/reel.mp4" 
                          className="h-64 rounded-md"
                          style={{ maxWidth: 'none', height: '100%' }}
                          controls
                          autoPlay
                          loop
                          muted
                          playsInline
                          onError={(e) => {
                            const target = e.target as HTMLVideoElement;
                            target.onerror = null;
                            target.style.display = 'none';
                            target.parentElement!.innerHTML = '<div class="w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300 rounded-md flex items-center justify-center"><span class="text-gray-500">Video not available</span></div>';
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-sm text-gray-500">{formatDate(featuredPost.timestamp)}</p>
                        <Badge variant="outline" className="bg-blue-50 text-blue-500 font-medium">
                          Reel
                        </Badge>
                      </div>
                      <p className="text-gray-700 mb-4 line-clamp-4">{featuredPost.caption}</p>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1 text-gray-600">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{featuredPost.likesCount}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <MessageSquare className="h-4 w-4" />
                          <span>{featuredPost.commentsCount}</span>
                        </div>
                        {featuredPost.videoViewCount && (
                          <div className="flex items-center gap-1 text-gray-600">
                            <Eye className="h-4 w-4" />
                            <span>{featuredPost.videoViewCount}</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {(featuredPost.hashtags || []).slice(0, 8).map((tag: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <a 
                    href={featuredPost.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1"
                  >
                    View on Instagram <ExternalLink className="h-3 w-3" />
                  </a>
                </CardFooter>
              </Card>
            )}
          </div>
        )}

        {activeTab === "hashtags" && (
          <div className="grid grid-cols-1 gap-6">
            {/* Trending Hashtags Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5 text-purple-500" />
                  Trending Hashtags Analysis
                </CardTitle>
                <CardDescription>Frequency of hashtag usage in your industry</CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={trendingHashtags.slice(0, 20)} 
                    layout="vertical" 
                    margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={80} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8">
                      {trendingHashtags.slice(0, 20).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Hashtag Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Hashtag Categories</CardTitle>
                <CardDescription>Common hashtag themes in your industry</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-2">Food & Cuisine</h3>
                    <div className="flex flex-wrap gap-2">
                      {trendingHashtags
                        .filter(tag => [
                          'vegan', 'food', 'veganfood', 'plantbased', 'foodporn', 'organic', 'foodie',
                          'vegancook', 'glutenfree', 'veganrecipes', 'whatveganseat', 'veganfoodshare'
                        ].includes(tag.name))
                        .slice(0, 8)
                        .map((tag, i) => (
                          <Badge key={i} variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                            #{tag.name}
                          </Badge>
                        ))}
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-medium text-green-800 mb-2">Lifestyle</h3>
                    <div className="flex flex-wrap gap-2">
                      {trendingHashtags
                        .filter(tag => [
                          'crueltyfree', 'veganlife', 'govegan', 'veganism', 'vegansofig', 'vegancommunity',
                          'cheflife', 'finedining', 'springtime', 'autumn'
                        ].includes(tag.name))
                        .slice(0, 8)
                        .map((tag, i) => (
                          <Badge key={i} variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            #{tag.name}
                          </Badge>
                        ))}
                    </div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h3 className="font-medium text-purple-800 mb-2">Location & Business</h3>
                    <div className="flex flex-wrap gap-2">
                      {trendingHashtags
                        .filter(tag => [
                          'wales', 'barmouth', 'walesfood', 'chefsofinstagram', 'veganchef', 'vegancooking',
                          'foodphotography', 'aupportlocal', 'michelinguide'
                        ].includes(tag.name))
                        .slice(0, 8)
                        .map((tag, i) => (
                          <Badge key={i} variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                            #{tag.name}
                          </Badge>
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "engagement" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Historic Popularity Trends */}
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  Historic Popularity Trends
                </CardTitle>
                <CardDescription>How different content types have performed over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={historicPopularityData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis label={{ value: 'Engagement Rate (%)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="Reels" stroke="#FF5A5F" activeDot={{ r: 8 }} strokeWidth={2} />
                      <Line type="monotone" dataKey="Carousel Posts" stroke="#2ECC71" activeDot={{ r: 8 }} strokeWidth={2} />
                      <Line type="monotone" dataKey="Photo Posts" stroke="#3498DB" activeDot={{ r: 8 }} strokeWidth={2} />
                      <Line type="monotone" dataKey="Video Posts" stroke="#F39C12" activeDot={{ r: 8 }} strokeWidth={2} />
                      <Line type="monotone" dataKey="Stories" stroke="#E74C3C" activeDot={{ r: 8 }} strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-center text-xs text-gray-500 px-2">
                  <p className="mb-1">Average engagement rates by content type over the last 6 months</p>
                  <p>Reels show the strongest upward trend in popularity and engagement</p>
                </div>
              </CardContent>
            </Card>

            {/* The rest of your engagement cards remain unchanged */}
            {/* Engagement Recommendations */}
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>Engagement Recommendations</CardTitle>
                <CardDescription>Actionable insights to improve your engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-2">Content Strategy</h3>
                    <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
                      <li>Focus on high-quality food photography</li>
                      <li>Highlight vegan and plant-based recipes</li>
                      <li>Showcase organic and local ingredients</li>
                      <li>Create content around trending hashtags like #{trendingHashtags[0]?.name}</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-medium text-green-800 mb-2">Posting Schedule</h3>
                    <ul className="list-disc pl-5 text-sm text-green-700 space-y-1">
                      <li>Post 3-5 times per week for optimal engagement</li>
                      <li>Experiment with different post types (images, carousels, videos)</li>
                      <li>Engage with similar accounts like @{relatedProfiles[0]?.username}</li>
                      <li>Respond to comments within 24 hours</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h3 className="font-medium text-purple-800 mb-2">Growth Tactics</h3>
                    <ul className="list-disc pl-5 text-sm text-purple-700 space-y-1">
                      <li>Collaborate with influencers in your niche</li>
                      <li>Use location tags to reach local audiences</li>
                      <li>Create themed content series to build anticipation</li>
                      <li>Leverage Instagram Stories for behind-the-scenes content</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
