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

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, loading } = useAuth();
  // Benutze useLocation, um den aktuellen URL-Pfad zu erhalten
  const location = useLocation();
  const currentPath = location.pathname;

  // Hilfsfunktion, um zu prüfen, ob ein Pfad der aktuelle ist
  const isActive = (path: string): boolean => {
    // Für die Dashboard-Route einen exakten Match für "/app" oder "/" verwenden
    if (path === "/app") {
      return currentPath === "/app" || currentPath === "/";
    }
    // Für andere Routen prüfen, ob der aktuelle Pfad mit dem Menüpfad beginnt
    return currentPath.startsWith(path);
  };

  // Wenn wir noch laden, zeigen wir nichts an, um Flackern zu vermeiden
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

  // Wenn der Nutzer eingeloggt ist, zeigen wir das normale Layout
  return (
    <SidebarProvider>
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
                  isActive={isActive("/app")} // Setze isActive basierend auf dem aktuellen Pfad
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
                  isActive={isActive("/projects")} // Setze isActive basierend auf dem aktuellen Pfad
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
                  isActive={isActive("/calendar")} // Setze isActive basierend auf dem aktuellen Pfad
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
                  isActive={isActive("/tasks")} // Setze isActive basierend auf dem aktuellen Pfad
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
          
          <div className="p-6">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
