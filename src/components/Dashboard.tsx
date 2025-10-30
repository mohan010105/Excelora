import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { FileUpload } from './FileUpload';
import { ChartBuilder } from './ChartBuilder';
import { InsightsPanel } from './InsightsPanel';
import { FileHistory } from './FileHistory';
import { Settings } from './Settings';
import { testServerConnection } from '../utils/serverHealth';
import { toast } from 'sonner@2.0.3';

interface DashboardProps {
  session: any;
}

export function Dashboard({ session }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedFile, setSelectedFile] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [serverConnected, setServerConnected] = useState(true);

  // Test server connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const isConnected = await testServerConnection();
        setServerConnected(isConnected);
        
        if (!isConnected) {
          toast.info('Demo mode active - Using sample data for exploration', {
            duration: 3000,
          });
        } else {
          toast.success('Server connected successfully!');
        }
      } catch (error) {
        console.log('Connection test completed:', error.message);
        setServerConnected(false);
        toast.info('Demo mode enabled with sample data', {
          duration: 3000,
        });
      }
    };

    checkConnection();
  }, []);

  const renderContent = () => {
    const pageVariants = {
      initial: { opacity: 0, y: 20 },
      in: { opacity: 1, y: 0 },
      out: { opacity: 0, y: -20 }
    };

    const pageTransition = {
      type: "tween",
      ease: "anticipate",
      duration: 0.4
    };

    switch (activeTab) {
      case 'dashboard':
        return (
          <motion.div 
            className="space-y-6"
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransition}
          >
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <motion.div 
                className="lg:col-span-2"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <FileUpload 
                  onFileUploaded={(file) => {
                    setSelectedFile(file);
                  }}
                />
              </motion.div>
              <motion.div 
                className="lg:col-span-1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <FileHistory 
                  session={session}
                  onFileSelect={(file) => {
                    setSelectedFile(file);
                  }}
                />
              </motion.div>
            </motion.div>
            
            <AnimatePresence>
              {selectedFile && (
                <motion.div 
                  className="grid grid-cols-1 xl:grid-cols-3 gap-6"
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -50, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <motion.div 
                    className="xl:col-span-2"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <ChartBuilder 
                      selectedFile={selectedFile}
                      session={session}
                    />
                  </motion.div>
                  <motion.div 
                    className="xl:col-span-1"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <InsightsPanel 
                      selectedFile={selectedFile}
                      session={session}
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      case 'history':
        return (
          <motion.div
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransition}
          >
            <FileHistory 
              session={session}
              onFileSelect={(file) => {
                setSelectedFile(file);
                setActiveTab('dashboard');
              }}
            />
          </motion.div>
        );
      case 'insights':
        return (
          <motion.div
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransition}
          >
            <InsightsPanel 
              selectedFile={selectedFile}
              session={session}
            />
          </motion.div>
        );
      case 'settings':
        return (
          <motion.div
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransition}
          >
            <Settings session={session} />
          </motion.div>
        );
      default:
        return (
          <motion.div
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransition}
          >
            <div>Dashboard</div>
          </motion.div>
        );
    }
  };

  // Add error handling for session issues
  if (!session) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Session expired. Please sign in again.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="h-screen flex bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
      >
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </motion.div>
      
      <div className="flex-1 flex flex-col min-w-0">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
        >
          <Header 
            session={session} 
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </motion.div>
        
        <main className="flex-1 overflow-auto p-6">
          <motion.div 
            className="max-w-7xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <AnimatePresence mode="wait">
              <motion.div key={activeTab}>
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </main>
      </div>
    </motion.div>
  );
}