
import React from 'react';
import { 
  Clock, 
  LayoutDashboard, 
  User, 
  Briefcase, 
  FileText, 
  Settings,
  LogOut,
  LinkedIn,
  Facebook,
  MessageCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";

const navItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/"
  },
  {
    label: "Profile",
    icon: User,
    href: "/profile"
  },
  {
    label: "Opportunities",
    icon: Briefcase,
    href: "/opportunities"
  },
  {
    label: "Applications",
    icon: FileText,
    href: "/applications"
  },
  {
    label: "Volunteering History",
    icon: Clock,
    href: "/history"
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings"
  }
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="flex items-center p-4">
        <div className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/a6385990-4653-4240-a5b2-5473c37df449.png" 
            alt="Scottish Tech Army" 
            className="h-8 w-auto"
          />
          <span className="font-bold text-lg">Volunteer App</span>
        </div>
        <SidebarTrigger className="ml-auto md:hidden" />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <Link to={item.href} className="flex items-center">
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <button className="w-full flex items-center justify-center space-x-2 p-2 rounded-md hover:bg-sta-purple hover:text-white transition-colors">
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
