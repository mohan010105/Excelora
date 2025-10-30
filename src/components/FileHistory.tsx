import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { projectId } from '../utils/supabase/info';
import { supabase } from '../utils/supabase/client';
import { 
  History, 
  FileSpreadsheet, 
  Calendar, 
  Download,
  Eye,
  Trash2,
  Search,
  Filter,
  Loader2
} from 'lucide-react';
import { Input } from './ui/input';
import { toast } from 'sonner@2.0.3';

interface FileHistoryProps {
  session: any;
  onFileSelect: (file: any) => void;
}

export function FileHistory({ session, onFileSelect }: FileHistoryProps) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (session?.access_token) {
      fetchFiles();
    } else {
      setLoading(false);
    }
  }, [session]);

  const fetchFiles = async () => {
    if (!session?.access_token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      console.log('Fetching files with token:', session.access_token.substring(0, 20) + '...');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-05166478/files`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Files fetch response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Files fetch error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('Files fetch result:', result);

      setFiles(result.files || []);
    } catch (error) {
      console.log('Files fetch error (using demo data):', error.message);
      
      // Provide mock data when server is not available for demo purposes
      if (error.message.includes('Failed to fetch') || error.message.includes('TypeError')) {
        console.log('📁 Loading demo files for exploration');
        setFiles([
          {
            id: 'demo-sample-1',
            fileName: 'sample-sales-data.xlsx',
            uploadedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
            size: 15360, // 15KB
            userId: session?.user?.id
          },
          {
            id: 'demo-sample-2', 
            fileName: 'monthly-report.xlsx',
            uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
            size: 8192, // 8KB
            userId: session?.user?.id
          },
          {
            id: 'demo-sample-3',
            fileName: 'customer-analysis.xlsx', 
            uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
            size: 25600, // 25KB
            userId: session?.user?.id
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredFiles = files.filter(file =>
    file.fileName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <History className="h-5 w-5 text-blue-600" />
              </motion.div>
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Upload History</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="h-6 w-6 text-blue-600 mr-2" />
              </motion.div>
              <motion.span
                animate={{ opacity: [1, 0.6, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Loading files...
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
              <History className="h-5 w-5 text-blue-600" />
            </motion.div>
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Upload History</span>
          </CardTitle>
          <CardDescription>
            View and manage your uploaded Excel files
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{files.length}</div>
            <div className="text-xs text-blue-800">Total Files</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {formatFileSize(files.reduce((total, file) => total + (file.size || 0), 0))}
            </div>
            <div className="text-xs text-green-800">Total Size</div>
          </div>
        </div>

        <Separator />

        {/* Files List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredFiles.length === 0 ? (
            <div className="text-center py-8">
              {searchTerm ? (
                <div>
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No files match your search</p>
                </div>
              ) : (
                <div>
                  <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No files uploaded yet</p>
                  <p className="text-sm text-gray-500">Upload your first Excel file to get started</p>
                </div>
              )}
            </div>
          ) : (
            filteredFiles.map((file, index) => (
              <motion.div
                key={file.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <FileSpreadsheet className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.fileName}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(file.uploadedAt)}</span>
                      <span>•</span>
                      <span>{formatFileSize(file.size)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onFileSelect(file)}
                      className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toast.info('Download feature coming soon')}
                      className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Quick Actions */}
        {files.length > 0 && (
          <motion.div 
            className="pt-4 border-t"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-gray-700">Quick Actions</p>
              <motion.div whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchFiles}
                  className="hover:bg-blue-50 hover:border-blue-300"
                >
                  <History className="mr-1 h-3 w-3" />
                  Refresh
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