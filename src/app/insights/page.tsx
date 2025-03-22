"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import insightData from "./data/insight.json";
import { ArrowUpRight, Lightbulb, TrendingUp, MessageSquare, Eye, Play, Target, LineChart, BarChart2 } from "lucide-react";

export default function Insights() {
  const [activeTab, setActiveTab] = useState("overview");
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
          <p className="text-gray-600 mt-1">Detailed analysis and recommendations for your latest content</p>
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

          {/* Dashboard Integration */}
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Dashboard Integration</CardTitle>
              <CardDescription>How to integrate these insights into your workflow</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">KPI Tracking</h3>
                  <p className="text-sm text-gray-600">{reel_analysis.dashboard_integration.kpi_tracking}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">Content Calendar</h3>
                  <p className="text-sm text-gray-600">{reel_analysis.dashboard_integration.content_calendar}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">A/B Testing</h3>
                  <p className="text-sm text-gray-600">{reel_analysis.dashboard_integration.a_b_testing}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">Feedback Loop</h3>
                  <p className="text-sm text-gray-600">{reel_analysis.dashboard_integration.feedback_loop}</p>
                </div>
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
