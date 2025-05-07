
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from './AppSidebar';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <AppSidebar />
        </div>
        
        {/* Mobile menu */}
        <div className="md:hidden fixed top-4 left-4 z-40">
          <Sheet>
            <SheetTrigger className="bg-sta-purple text-white p-2 rounded-md">
              <Menu size={24} />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[80%] max-w-[300px]">
              <div className="h-full">
                <AppSidebar />
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
