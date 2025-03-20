"use client";

import React, { ReactNode } from 'react';
import { BookOpenIcon, CalendarIcon, HomeIcon, ListTodoIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import { 
  SidebarProvider, 
  Sidebar, 
  SidebarHeader, 
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import AppHeader from './AppHeader';
import { useAuth } from '../provider/AuthProvider';
import { HeaderProvider } from '../provider/HeaderProvider';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string): boolean => {
    if (path === "/app") {
      return currentPath === "/app" || currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-t-primary border-r-transparent border-b-primary border-l-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      children
    );
  }

  const getDefaultTitle = (path: string): string => {
    if (path === "/app" || path === "/") {
      return "Dashboard";
    }
    return path.split('/')[1].charAt(0).toUpperCase() + path.split('/')[1].slice(1);
  };

  return (
    <SidebarProvider>
      <HeaderProvider defaultTitle={getDefaultTitle(currentPath)}>
        <div className="flex min-h-screen w-full">
          <Sidebar>
            <SidebarHeader>
              <div className="ml-auto">
                <SidebarTrigger />
              </div>
            </SidebarHeader>
            
            <SidebarContent>
              <SidebarMenu className="pl-3 pr-3">
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild 
                    tooltip="Dashboard"
                    className="text-base py-3"
                    isActive={isActive("/app")}
                  >
                    <Link to="/app" className="flex items-center">
                      <HomeIcon className="size-5 mr-3" />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild 
                    tooltip="Projects"
                    className="text-base pl-3 pr-3"
                    isActive={isActive("/projects")}
                  >
                    <Link to="/projects" className="flex items-center">
                      <BookOpenIcon className="size-5 mr-3" />
                      <span>Projects</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild 
                    tooltip="Calendar"
                    className="text-base pl-3 pr-3"
                    isActive={isActive("/calendar")}
                  >
                    <Link to="/calendar" className="flex items-center">
                      <CalendarIcon className="size-5 mr-3" />
                      <span>Calendar</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild 
                    tooltip="Tasks"
                    className="text-base pl-3 pr-3"
                    isActive={isActive("/tasks")}
                  >
                    <Link to="/tasks" className="flex items-center">
                      <ListTodoIcon className="size-5 mr-3" />
                      <span>Tasks</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
          
          <SidebarInset>
            <AppHeader />
            
            <div className="p-6 flex-1 flex flex-col h-[calc(100vh-64px)]">
              {children}
            </div>
          </SidebarInset>
        </div>
      </HeaderProvider>
    </SidebarProvider>
  );
};

export default AppLayout;
