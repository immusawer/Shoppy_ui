"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingBasket, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AuthContext } from "../auth/auth-context";
import { unauthenticated, routes } from "../common/constants/navigation";
import logout from "../auth/logout";
import { useContext } from "react";
import ProfileDialog from "../profile/profile";

export default function Header() {
  const isAuthenticated = useContext(AuthContext);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const pages = isAuthenticated ? routes : unauthenticated;

  const handleProfileClick = () => {
    console.log('Profile menu item clicked');
    setShowProfile(true);
  };

  const handleProfileClose = (open: boolean) => {
    console.log('Profile dialog state changed:', open);
    setShowProfile(open);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-slate-950 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="mr-4 hidden md:flex">
                <Link href="/" className="mr-6 flex items-center space-x-2">
                  <ShoppingBasket className="h-6 w-6 text-white" />
                  <span className="hidden font-bold sm:inline-block text-white">
                    Shoppy
                  </span>
                </Link>
              </div>
            </div>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="mr-2 px-0 text-base hover:bg-slate-800 focus-visible:bg-slate-800 focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden text-white"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0 bg-slate-950 border-r-slate-800">
                <div className="flex items-center space-x-2">
                  <ShoppingBasket className="h-6 w-6 text-white" />
                  <span className="font-bold text-white">Shoppy</span>
                </div>
                <nav className="flex flex-col space-y-4 mt-4">
                  {pages.map((page) => (
                    <Button
                      key={page.title}
                      variant="ghost"
                      className="w-full justify-start text-white hover:bg-slate-800"
                      onClick={() => {
                        setIsOpen(false);
                        router.push(page.path);
                      }}
                    >
                      {page.title}
                    </Button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>

            {/* User Menu */}
            {isAuthenticated && (
              <div className="flex items-center space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="relative h-8 w-8 rounded-full hover:bg-slate-800"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/avatars/01.png" alt="User avatar" />
                        <AvatarFallback className="bg-slate-800 text-white">U</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-slate-950 border-slate-800">
                    <DropdownMenuItem 
                      onClick={handleProfileClick}
                      className="text-white hover:bg-slate-800 cursor-pointer"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={logout}
                      className="text-white hover:bg-slate-800 cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </header>

      <ProfileDialog open={showProfile} onOpenChange={handleProfileClose} />
    </>
  );
}
