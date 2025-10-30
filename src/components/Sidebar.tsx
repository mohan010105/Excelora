import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { cn } from './ui/utils';
import { 
  LayoutDashboard, 
  Upload, 
  History, 
  Lightbulb, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ activeTab, setActiveTab, collapsed, onToggle }: SidebarProps) {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'history',
      label: 'Upload History',
      icon: History,
    },
    {
      id: 'insights',
      label: 'Insights',
      icon: Lightbulb,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <motion.aside 
      className={cn(
        "bg-white/90 backdrop-blur-sm border-r border-gray-200/50 flex flex-col shadow-lg",
        collapsed ? "w-16" : "w-64"
      )}
      animate={{ width: collapsed ? 64 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="p-4 border-b border-gray-200/50">
        <div className="flex items-center justify-between">
          <AnimatePresence>
            {!collapsed && (
              <motion.h2 
                className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                Menu
              </motion.h2>
            )}
          </AnimatePresence>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="hidden lg:flex hover:bg-blue-50"
            >
              <motion.div
                animate={{ rotate: collapsed ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                {collapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </motion.div>
            </Button>
          </motion.div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <motion.li 
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <motion.div
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start relative overflow-hidden",
                      collapsed && "px-2",
                      isActive && "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg",
                      !isActive && "hover:bg-blue-50 hover:text-blue-700"
                    )}
                    onClick={() => setActiveTab(item.id)}
                  >
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20"
                        layoutId="activeTab"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <Icon className={cn("h-5 w-5 relative z-10", !collapsed && "mr-3")} />
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span 
                          className="relative z-10"
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      <AnimatePresence>
        {!collapsed && (
          <motion.div 
            className="p-4 border-t border-gray-200/50"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100"
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-5 w-5 text-blue-600" />
                </motion.div>
                <span className="text-sm font-medium text-blue-900">Quick Upload</span>
              </div>
              <p className="text-xs text-blue-700 mb-3">
                Drag and drop your Excel files anywhere to get started
              </p>
              <motion.div whileTap={{ scale: 0.98 }}>
                <Button 
                  size="sm" 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm"
                >
                  Browse Files
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}