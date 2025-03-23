"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ArrowUpRight, Lightbulb, TrendingUp, MessageSquare, Eye, Play, Target, LineChart, BarChart2 } from "lucide-react";

type InsightData = {
  reel_analysis: {
    overall_summary: string;
    key_performance_indicators: Array<{
      metric: string;
      value: number | string;
      insight: string;
      suggestion?: string;
    }>;
    content_effectiveness: any; // Define proper type based on your data
    audience_segmentation: {
      data_availability: string;
      insight: string;
    };
    opportunities_for_improvement: any; // Define proper type based on your data
  };
};

export default function Insights() {
  const [activeTab, setActiveTab] = useState("overview");
  const [insightData, setInsightData] = useState<InsightData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await fetch("/insight.json");
        if (!response.ok) {
          throw new Error("Failed to fetch insights data");
        }
        const data = await response.json();
        setInsightData(data);
      } catch (err) {
        // Error logged for debugging
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-4rem)] p-6 max-w-3xl mx-auto">
        <div className="w-full mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Analyzing Instagram Reels</h1>
          <p className="text-gray-600">Our AI agents are scraping and analyzing your last 7 reels to generate insights</p>
        </div>
        
        <div className="w-full bg-gray-100 rounded-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3">
              <Eye className="h-4 w-4" />
            </div>
            <div>
              <div className="font-medium">Content Analysis</div>
              <div className="text-sm text-gray-500">Scanning visual elements and captions</div>
            </div>
            <div className="ml-auto">
              <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center mb-4">
            <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white mr-3">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <div className="font-medium">Engagement Metrics</div>
              <div className="text-sm text-gray-500">Processing likes, comments, and shares</div>
            </div>
            <div className="ml-auto">
              <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full animate-pulse" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center mb-4">
            <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-white mr-3">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div>
              <div className="font-medium">Sentiment Analysis</div>
              <div className="text-sm text-gray-500">Evaluating comment sentiment and themes</div>
            </div>
            <div className="ml-auto">
              <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full animate-pulse" style={{ width: '45%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center text-white mr-3">
              <Lightbulb className="h-4 w-4" />
            </div>
            <div>
              <div className="font-medium">Recommendation Engine</div>
              <div className="text-sm text-gray-500">Generating actionable insights</div>
            </div>
            <div className="ml-auto">
              <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 rounded-full animate-pulse" style={{ width: '25%' }}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-500">
          Estimated time remaining: ~15 seconds
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!insightData || !insightData.reel_analysis) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="text-xl text-gray-600">No insights data available</div>
      </div>
    );
  }

  const { reel_analysis } = insightData;
  const { key_performance_indicators, content_effectiveness, audience_segmentation, opportunities_for_improvement } = reel_analysis;

  // Data for KPI chart
  const kpiData = key_performance_indicators
    .map((kpi) => ({
      name: kpi.metric,
      value: kpi.value,
    }))
    .filter((item) => typeof item.value === "number");

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  return (
    <div className="flex flex-col p-6 min-h-[calc(100vh-4rem)] w-full max-w-6xl mx-auto pt-12">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Instagram Reel Insights</h1>
          <p className="text-gray-600 mt-1">Detailed analysis and recommendations from your last 7 reels</p>
        </div>
        <Button className="flex items-center gap-2">
          <a
            href="https://drive.google.com/file/d/1WkIVNa4pLs-OzuKDQesNySa3I-GS3UOI/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            Export Report <ArrowUpRight className="h-4 w-4" />
          </a>
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 pb-2">
        <Button variant={activeTab === "overview" ? "default" : "outline"} onClick={() => setActiveTab("overview")} className="rounded-md">
          Overview
        </Button>
        <Button
          variant={activeTab === "performance" ? "default" : "outline"}
          onClick={() => setActiveTab("performance")}
          className="rounded-md"
        >
          Performance Metrics
        </Button>
        <Button
          variant={activeTab === "opportunities" ? "default" : "outline"}
          onClick={() => setActiveTab("opportunities")}
          className="rounded-md"
        >
          Opportunities
        </Button>
      </div>

      {/* Main Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Summary Card */}
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Overall Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{reel_analysis.overall_summary}</p>
            </CardContent>
          </Card>

          {/* KPI Cards */}
          {key_performance_indicators.map((kpi, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  {kpi.metric === "Likes" && <TrendingUp className="h-5 w-5 text-pink-500" />}
                  {kpi.metric === "Comments" && <MessageSquare className="h-5 w-5 text-blue-500" />}
                  {kpi.metric === "Video Views" && <Eye className="h-5 w-5 text-purple-500" />}
                  {kpi.metric === "Video Play Count" && <Play className="h-5 w-5 text-green-500" />}
                  {kpi.metric === "Dominant Comment" && <MessageSquare className="h-5 w-5 text-orange-500" />}
                  {kpi.metric}
                </CardTitle>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{kpi.value}</span>
                  {typeof kpi.value === "number" && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      +12% <span className="ml-1">↑</span>
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{kpi.insight}</p>
                {kpi.suggestion && (
                  <div className="mt-2 p-2 bg-blue-50 rounded-md text-sm text-blue-700">
                    <span className="font-medium">Suggestion:</span> {kpi.suggestion}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          {/* Audience Segmentation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-blue-500" />
                Audience Segmentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Data Availability:</span>
                  <Badge
                    variant="outline"
                    className={
                      audience_segmentation.data_availability === "Limited" ? "bg-yellow-50 text-yellow-700" : "bg-green-50 text-green-700"
                    }
                  >
                    {audience_segmentation.data_availability}
                  </Badge>
                </div>
                <p className="text-gray-700">{audience_segmentation.insight}</p>
              </div>
            </CardContent>
          </Card>
          {/* Content Effectiveness */}
          <Card className="col-span-full md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-red-500" />
                Content Effectiveness
              </CardTitle>
              <CardDescription>Analysis of audience engagement and content impact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Dominant Comment Type:</h3>
                  <p className="text-gray-700">{content_effectiveness.dominant_comment}</p>
                </div>
                <div>
                  <h3 className="font-medium">Insight:</h3>
                  <p className="text-gray-700">{content_effectiveness.insight}</p>
                </div>
                <div>
                  <h3 className="font-medium">Recommended Actions:</h3>
                  <ul className="list-disc pl-5 text-gray-700">
                    {content_effectiveness.action_items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "performance" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Performance Metrics Chart */}
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-purple-500" />
                Key Performance Metrics
              </CardTitle>
              <CardDescription>Visual representation of your content&apos;s performance</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={kpiData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8">
                    {kpiData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Advanced Insights Generator */}
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Ristorante Analytics Generator
              </CardTitle>
              <CardDescription>Generate powerful insights from your last 7 Instagram reels for your San Francisco Italian restaurant</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 h-auto py-3"
                  onClick={() => {
                    setIsGeneratingInsight(true);
                    setTimeout(() => {
                      setSelectedInsight('engagement');
                      setIsGeneratingInsight(false);
                    }, 1500);
                  }}
                  disabled={isGeneratingInsight}
                >
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  <div className="text-left">
                    <div className="font-medium">Diner Engagement Analysis</div>
                    <div className="text-xs text-gray-500">Optimize your customer interaction</div>
                  </div>
                </Button>

                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 h-auto py-3"
                  onClick={() => {
                    setIsGeneratingInsight(true);
                    setTimeout(() => {
                      setSelectedInsight('content');
                      setIsGeneratingInsight(false);
                    }, 1500);
                  }}
                  disabled={isGeneratingInsight}
                >
                  <Target className="h-5 w-5 text-green-500" />
                  <div className="text-left">
                    <div className="font-medium">Menu Performance</div>
                    <div className="text-xs text-gray-500">Identify high-performing dishes</div>
                  </div>
                </Button>

                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 h-auto py-3"
                  onClick={() => {
                    setIsGeneratingInsight(true);
                    setTimeout(() => {
                      setSelectedInsight('audience');
                      setIsGeneratingInsight(false);
                    }, 1500);
                  }}
                  disabled={isGeneratingInsight}
                >
                  <Eye className="h-5 w-5 text-purple-500" />
                  <div className="text-left">
                    <div className="font-medium">Customer Demographics</div>
                    <div className="text-xs text-gray-500">Understand your SF diners</div>
                  </div>
                </Button>
              </div>

              {isGeneratingInsight && (
                <div className="p-6 border rounded-lg bg-gray-50">
                  <div className="flex items-center justify-center space-x-2 animate-pulse">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div className="text-gray-500 text-sm">Generating insights...</div>
                  </div>
                </div>
              )}

              {selectedInsight === 'engagement' && !isGeneratingInsight && (
                <div className="p-6 border rounded-lg bg-white">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
                    Diner Engagement Analysis Results
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-2/5 font-medium">Peak Dining Hours:</div>
                      <div className="w-3/5">6:30 PM - 8:45 PM (Weekdays), 7:15 PM - 9:30 PM (Weekends)</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2/5 font-medium">Table Turnover Rate:</div>
                      <div className="w-3/5 flex items-center">
                        1.8 hours <Badge className="ml-2 bg-green-100 text-green-800 border-0">-15 min vs Avg</Badge>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2/5 font-medium">Review Sentiment:</div>
                      <div className="w-3/5">Positive (92%) - Pasta dishes highlighted most</div>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded-md">
                      <p className="text-sm text-blue-700"><span className="font-medium">Recommendation:</span> Optimize staffing during peak hours (especially Fri-Sat) and implement a tableside digital feedback system to capture more customer insights while they dine.</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedInsight === 'content' && !isGeneratingInsight && (
                <div className="p-6 border rounded-lg bg-white">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Target className="h-5 w-5 text-green-500 mr-2" />
                    Menu Performance Analysis
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-2/5 font-medium">Top Performing Dishes:</div>
                      <div className="w-3/5">Truffle Risotto, Seafood Linguine, Tiramisu</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2/5 font-medium">Optimal Price Point:</div>
                      <div className="w-3/5">$24-32 (Entrees), $12-18 (Appetizers)</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2/5 font-medium">Menu Gap:</div>
                      <div className="w-3/5">Vegetarian/Vegan options, Gluten-free pasta alternatives</div>
                    </div>
                    <div className="mt-4 p-3 bg-green-50 rounded-md">
                      <p className="text-sm text-green-700"><span className="font-medium">Recommendation:</span> Introduce a seasonal chef&apos;s tasting menu featuring your signature truffle dishes, and expand vegetarian options to capture the growing plant-based dining segment in SF.</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedInsight === 'audience' && !isGeneratingInsight && (
                <div className="p-6 border rounded-lg bg-white">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Eye className="h-5 w-5 text-purple-500 mr-2" />
                    Customer Demographics Report
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-2/5 font-medium">Primary Customer Base:</div>
                      <div className="w-3/5">30-45 years (38%), Tech professionals (52%)</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2/5 font-medium">Top Neighborhoods:</div>
                      <div className="w-3/5">SoMa, Marina, North Beach, Mission District</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2/5 font-medium">Dining Preferences:</div>
                      <div className="w-3/5">Wine pairings, Authentic Italian, Sustainable ingredients</div>
                    </div>
                    <div className="mt-4 p-3 bg-purple-50 rounded-md">
                      <p className="text-sm text-purple-700"><span className="font-medium">Recommendation:</span> Launch a tech industry happy hour on Thursdays with Italian wine flights and small plates to attract the local tech professional demographic. Partner with local tech companies for private dining events.</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Restaurant Management Tools */}
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-indigo-500" />
                Restaurant Management Tools
              </CardTitle>
              <CardDescription>Powerful tools to optimize your restaurant operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                  <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-blue-500" />
                    Reservation Forecasting
                  </h3>
                  <p className="text-sm text-gray-600">Predict busy periods with 92% accuracy based on historical data, local events, and weather patterns. Optimize staffing and inventory accordingly.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-green-500">
                  <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                    <Target className="h-4 w-4 mr-2 text-green-500" />
                    Menu Engineering
                  </h3>
                  <p className="text-sm text-gray-600">Analyze dish profitability and popularity to optimize your menu. Identify star dishes, workhorses, puzzles and dogs to maximize revenue.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-purple-500">
                  <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2 text-purple-500" />
                    Review Management
                  </h3>
                  <p className="text-sm text-gray-600">Monitor and respond to customer reviews across Yelp, Google, and OpenTable from a single dashboard. Identify recurring feedback themes.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-orange-500">
                  <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                    <Eye className="h-4 w-4 mr-2 text-orange-500" />
                    Competitor Analysis
                  </h3>
                  <p className="text-sm text-gray-600">Track menu changes, pricing, and promotions from other Italian restaurants in San Francisco. Stay ahead with actionable competitive intelligence.</p>
                </div>
              </div>
              <div className="mt-6">
                <Button className="w-full">
                  Connect Restaurant POS System
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "opportunities" && (
        <div className="grid grid-cols-1 gap-6">
          {/* Opportunities for Improvement */}
          {opportunities_for_improvement.map((opportunity, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  {opportunity.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {opportunity.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="bg-green-100 text-green-800 rounded-full h-5 w-5 flex items-center justify-center mt-0.5 flex-shrink-0">
                        {i + 1}
                      </span>
                      <p className="text-gray-700">{point}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Implement {opportunity.category}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
