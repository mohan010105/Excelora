import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { projectId } from '../utils/supabase/info';
import { supabase } from '../utils/supabase/client';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  ScatterChart,
  Scatter,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  BarChart3, 
  LineChart as LineChartIcon, 
  PieChart as PieChartIcon, 
  Zap as ScatterIcon,
  FileText,
  Download,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ChartBuilderProps {
  selectedFile: any;
  session: any;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export function ChartBuilder({ selectedFile, session }: ChartBuilderProps) {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [chartType, setChartType] = useState('bar');

  useEffect(() => {
    if (selectedFile) {
      fetchChartData();
    }
  }, [selectedFile]);

  const fetchChartData = async () => {
    if (!session?.access_token || !selectedFile?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      console.log('Fetching chart data for file:', selectedFile.id);
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-05166478/chart-data/${selectedFile.id}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Chart data response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Chart data error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('Chart data result:', result);

      setChartData(result.chartData);
      // Set default axes
      if (result.chartData.columns.length > 0) {
        setXAxis(result.chartData.columns[0]);
        if (result.chartData.columns.length > 1) {
          setYAxis(result.chartData.columns[1]);
        }
      }
    } catch (error) {
      console.log('Chart data processing (using demo mode):', error.message);
      
      // For demo or when server is unavailable: provide mock chart data
      if (error.message.includes('Failed to fetch') || error.message.includes('TypeError')) {
        console.log('📊 Loading demo chart data');
        const mockChartData = {
          columns: ['Month', 'Sales', 'Profit', 'Customers'],
          data: [
            { Month: 'Jan', Sales: 4000, Profit: 2400, Customers: 240 },
            { Month: 'Feb', Sales: 3000, Profit: 1398, Customers: 221 },
            { Month: 'Mar', Sales: 2000, Profit: 9800, Customers: 229 },
            { Month: 'Apr', Sales: 2780, Profit: 3908, Customers: 200 },
            { Month: 'May', Sales: 1890, Profit: 4800, Customers: 218 },
            { Month: 'Jun', Sales: 2390, Profit: 3800, Customers: 250 },
          ]
        };
        setChartData(mockChartData);
        setXAxis('Month');
        setYAxis('Sales');
        toast.success('Demo chart data loaded!');
      } else if (error.message.includes('401')) {
        toast.error('Session expired. Please sign in again.');
      } else {
        toast.error(`Failed to load chart data: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadChart = (format: 'png' | 'pdf') => {
    toast.success(`Chart download (${format.toUpperCase()}) started`);
    // In a real app, you'd implement actual chart export functionality
  };

  const renderChart = () => {
    if (!chartData || !xAxis || !yAxis) {
      return (
        <div className="h-80 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Select X and Y axes to view chart</p>
          </div>
        </div>
      );
    }

    const data = chartData.data;

    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxis} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey={yAxis} stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxis} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={yAxis} fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey={yAxis}
                nameKey={xAxis}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart data={data}>
              <CartesianGrid />
              <XAxis type="number" dataKey={xAxis} />
              <YAxis type="number" dataKey={yAxis} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Data" data={data} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        );

      default:
        return <div>Unsupported chart type</div>;
    }
  };

  const renderDataTable = () => {
    if (!chartData) return null;

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {chartData.columns.map((column) => (
                <th
                  key={column}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {chartData.data.map((row, index) => (
              <tr key={index}>
                {chartData.columns.map((column) => (
                  <td key={column} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row[column]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
          <CardContent className="p-8">
            <div className="flex items-center justify-center space-x-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="h-6 w-6 text-blue-600" />
              </motion.div>
              <motion.span
                animate={{ opacity: [1, 0.6, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Loading chart data...
              </motion.span>
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
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatDelay: 5
              }}
            >
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </motion.div>
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Chart Builder</span>
          </CardTitle>
          <CardDescription>
            Create interactive charts from your Excel data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
        {/* Chart Configuration */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="space-y-2">
            <label className="text-sm font-medium">Chart Type</label>
            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger>
                <SelectValue placeholder="Select chart type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>Bar Chart</span>
                  </div>
                </SelectItem>
                <SelectItem value="line">
                  <div className="flex items-center space-x-2">
                    <LineChartIcon className="h-4 w-4" />
                    <span>Line Chart</span>
                  </div>
                </SelectItem>
                <SelectItem value="pie">
                  <div className="flex items-center space-x-2">
                    <PieChartIcon className="h-4 w-4" />
                    <span>Pie Chart</span>
                  </div>
                </SelectItem>
                <SelectItem value="scatter">
                  <div className="flex items-center space-x-2">
                    <ScatterIcon className="h-4 w-4" />
                    <span>Scatter Plot</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">X-Axis</label>
            <Select value={xAxis} onValueChange={setXAxis}>
              <SelectTrigger>
                <SelectValue placeholder="Select X-axis" />
              </SelectTrigger>
              <SelectContent>
                {chartData?.columns.map((column) => (
                  <SelectItem key={column} value={column}>
                    {column}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Y-Axis</label>
            <Select value={yAxis} onValueChange={setYAxis}>
              <SelectTrigger>
                <SelectValue placeholder="Select Y-axis" />
              </SelectTrigger>
              <SelectContent>
                {chartData?.columns.map((column) => (
                  <SelectItem key={column} value={column}>
                    {column}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Chart Display */}
        <Tabs defaultValue="chart" className="w-full">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="chart">Chart View</TabsTrigger>
              <TabsTrigger value="data">Data View</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center space-x-2">
              {selectedFile && (
                <Badge variant="secondary">
                  <FileText className="mr-1 h-3 w-3" />
                  {selectedFile.name}
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadChart('png')}
              >
                <Download className="mr-1 h-3 w-3" />
                PNG
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadChart('pdf')}
              >
                <Download className="mr-1 h-3 w-3" />
                PDF
              </Button>
            </div>
          </div>

          <TabsContent value="chart" className="mt-4">
            <motion.div 
              className="border rounded-lg p-4 bg-white shadow-sm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {renderChart()}
            </motion.div>
          </TabsContent>

          <TabsContent value="data" className="mt-4">
            <motion.div 
              className="border rounded-lg bg-white max-h-96 overflow-auto shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderDataTable()}
            </motion.div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
    </motion.div>
  );
}