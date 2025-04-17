// components/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../auth/auth-context";
import { routes } from "../common/constants/navigation";
import { Button } from "@/components/ui/button";
import { Home, ShoppingBasket, PlusCircle, Settings, Users, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import CreateProductModal from "../products/create products/create-product-modal";

export default function Sidebar() {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (!isAuthenticated) return null;

  const navItems = [
    { title: "Dashboard", path: "/", icon: <Home className="h-5 w-5" /> },
    { title: "Products", path: "/products", icon: <ShoppingBasket className="h-5 w-5" /> },
    { 
      title: "Create Product", 
      path: "#", 
      icon: <PlusCircle className="h-5 w-5" />,
      onClick: () => setIsCreateModalOpen(true)
    },
    { title: "Users", path: "/users", icon: <Users className="h-5 w-5" /> },
    { title: "Settings", path: "/settings", icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <>
      <CreateProductModal 
        open={isCreateModalOpen} 
        handleClose={() => setIsCreateModalOpen(false)} 
      />
      <div className={cn(
        "hidden border-r bg-background md:block transition-all duration-300 shadow-sm",
        isCollapsed ? "w-16" : "w-64"
      )}>
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center justify-between border-b px-4 lg:h-[60px] lg:px-6">
            {!isCollapsed && (
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <ShoppingBasket className="h-6 w-6 text-primary" />
                <span className="text-lg">Shoppy</span>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto hover:bg-muted"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
            </Button>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navItems.map((item) => (
                item.onClick ? (
                  <button
                    key={item.path}
                    onClick={item.onClick}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all hover:bg-muted w-full text-left",
                      "text-muted-foreground hover:text-foreground",
                      isCollapsed && "justify-center"
                    )}
                  >
                    {item.icon}
                    {!isCollapsed && <span>{item.title}</span>}
                  </button>
                ) : (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all hover:bg-muted",
                      pathname === item.path
                        ? "bg-muted text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground",
                      isCollapsed && "justify-center"
                    )}
                  >
                    {item.icon}
                    {!isCollapsed && <span>{item.title}</span>}
                  </Link>
                )
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}