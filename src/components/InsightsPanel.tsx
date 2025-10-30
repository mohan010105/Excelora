import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { projectId } from '../utils/supabase/info';
import { supabase } from '../utils/supabase/client';
import { 
  Lightbulb, 
  TrendingUp, 
  BarChart3, 
  Target, 
  AlertTriangle,
  Sparkles,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface InsightsPanelProps {
  selectedFile: any;
  session: any;
}

export function InsightsPanel({ selectedFile, session }: InsightsPanelProps) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (selectedFile) {
      // Auto-generate insights when file is selected
      generateInsights();
    }
  }, [selectedFile]);

  const generateInsights = async () => {
    if (!selectedFile?.id || !session?.access_token) {
      setGenerating(false);
      return;
    }

    setGenerating(true);
    try {
      console.log('Generating insights for file:', selectedFile.id);
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-05166478/insights`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            fileId: selectedFile.id,
            data: {} // In a real app, you'd pass the actual data here
          }),
        }
      );

      console.log('Insights response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Insights error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('Insights result:', result);

      setInsights(result.insights);
      toast.success('AI insights generated successfully!');
    } catch (error) {
      console.log('Insights generation (using demo mode):', error.message);
      
      // Provide mock insights when server is not available for demo purposes
      if (error.message.includes('Failed to fetch') || error.message.includes('TypeError')) {
        console.log('🤖 Generating demo AI insights');
        const mockInsights = {
          id: '1',
          fileId: selectedFile.id,
          insights: [
            "Your data shows a strong upward trend over time",
            "Peak performance occurs in Q3 consistently", 
            "There's a 23% correlation between variables A and B",
            "Seasonal patterns suggest planning for Q4 dips"
          ],
          generatedAt: new Date().toISOString()
        };
        setInsights(mockInsights);
        toast.success('Demo AI insights generated!');
      } else if (error.message.includes('401')) {
        toast.error('Session expired. Please sign in again.');
      } else {
        toast.error(`Failed to generate insights: ${error.message}`);
      }
    } finally {
      setGenerating(false);
    }
  };

  const insightIcons = [TrendingUp, BarChart3, Target, AlertTriangle];

  const getInsightIcon = (index: number) => {
    const Icon = insightIcons[index % insightIcons.length];
    return Icon;
  };

  const getInsightColor = (index: number) => {
    const colors = ['text-blue-600', 'text-green-600', 'text-purple-600', 'text-orange-600'];
    return colors[index % colors.length];
  };

  const getBadgeVariant = (index: number) => {
    const variants = ['default', 'secondary', 'outline', 'destructive'];
    return variants[index % variants.length] as any;
  };

  if (!selectedFile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 5
                }}
              >
                <Lightbulb className="h-5 w-5 text-yellow-500" />
              </motion.div>
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">AI Insights</span>
            </CardTitle>
            <CardDescription>
              Upload and select a file to generate AI-powered insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 360, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              </motion.div>
              <motion.p 
                className="text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Select a file to generate insights
              </motion.p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatDelay: 5
              }}
            >
              <Lightbulb className="h-5 w-5 text-yellow-500" />
            </motion.div>
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">AI Insights</span>
          </CardTitle>
          <CardDescription>
            AI-generated insights and analysis from your data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
        {/* File Info */}
        <div className="flex items-center justify-between">
          <Badge variant="outline">
            {selectedFile.name}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={generateInsights}
            disabled={generating}
          >
            {generating ? (
              <>
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-1 h-3 w-3" />
                Refresh
              </>
            )}
          </Button>
        </div>

        <Separator />

        {/* Insights Display */}
        {generating ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-blue-600 animate-pulse" />
              <span className="text-sm font-medium">Generating AI insights...</span>
            </div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : insights ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                Generated {new Date(insights.generatedAt).toLocaleDateString()}
              </span>
            </div>

            {insights.insights.map((insight, index) => {
              const Icon = getInsightIcon(index);
              const iconColor = getInsightColor(index);
              
              return (
                <motion.div
                  key={index}
                  className="flex items-start space-x-3 p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <motion.div 
                    className={`p-2 rounded-full bg-white ${iconColor}`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className="h-4 w-4" />
                  </motion.div>
                  <div className="flex-1">
                    <motion.p 
                      className="text-sm text-gray-800 leading-relaxed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      {insight}
                    </motion.p>
                  </div>
                </motion.div>
              );
            })}

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {insights.insights.length}
                </div>
                <div className="text-xs text-gray-600">Insights Found</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  AI
                </div>
                <div className="text-xs text-gray-600">Powered</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No insights generated yet</p>
            <Button onClick={generateInsights} disabled={generating}>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Insights
            </Button>
          </div>
        )}

        {/* Quick Actions */}
        {insights && (
          <motion.div 
            className="pt-4 border-t space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-xs font-medium text-gray-700 mb-2">Quick Actions</p>
            <div className="flex flex-wrap gap-2">
              <motion.div whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="hover:bg-blue-50 hover:border-blue-300"
                >
                  Export Report
                </Button>
              </motion.div>
              <motion.div whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="hover:bg-green-50 hover:border-green-300"
                >
                  Share Insights
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
    </motion.div>
  );
}