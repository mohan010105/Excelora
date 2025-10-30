import React from 'react';
import { motion } from 'motion/react';
import { supabase } from '../utils/supabase/client';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { BarChart3, Menu, LogOut, User, Settings, Sparkles } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface HeaderProps {
  session: any;
  onToggleSidebar: () => void;
}

export function Header({ session, onToggleSidebar }: HeaderProps) {
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error('Error signing out');
      } else {
        toast.success('Signed out successfully');
        window.location.reload();
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Sign out error:', error);
    }
  };

  const userName = session?.user?.user_metadata?.name || session?.user?.email || 'User';
  const userEmail = session?.user?.email || '';
  const userInitials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase();

  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200/50 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSidebar}
              className="lg:hidden hover:bg-blue-50"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </motion.div>
          
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-2 shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
              animate={{ 
                boxShadow: [
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  "0 8px 15px -3px rgba(59, 130, 246, 0.3)",
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                ]
              }}
              transition={{ 
                boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <BarChart3 className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <motion.h1 
                className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Excel Analytics Platform
              </motion.h1>
              <motion.p 
                className="text-sm text-gray-500 flex items-center space-x-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Sparkles className="h-3 w-3" />
                <span>Transform your data into insights</span>
              </motion.p>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="flex items-center space-x-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button 
                className="relative h-10 w-10 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src="" alt={userName} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-600 font-semibold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-medium leading-none">{userName}</p>
                <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
      </div>
    </header>
  );
}