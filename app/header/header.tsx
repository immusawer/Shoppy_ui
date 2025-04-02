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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Header() {
  const isAuthenticated = useContext(AuthContext);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const pages = isAuthenticated ? routes : unauthenticated;

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
                      onClick={() => setShowProfile(true)}
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

      {/* Profile Dialog */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="bg-slate-950/80 backdrop-blur-sm border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">Profile</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/avatars/01.png" alt="User avatar" />
              <AvatarFallback className="bg-slate-800 text-white text-xl">U</AvatarFallback>
            </Avatar>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-white">User Name</h3>
              <p className="text-sm text-gray-300">user@example.com</p>
            </div>
            <div className="w-full space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Member since</span>
                <span className="text-white">January 2024</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Orders</span>
                <span className="text-white">0</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
