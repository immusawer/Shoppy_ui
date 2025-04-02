"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingBasket, User, LogOut, Menu } from "lucide-react";
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
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "../auth/auth-context";
import { unauthenticated, routes } from "../common/constants/navigation";
import logout from "../auth/logout";
import ProfileDialog from "../profile/profile";
import { fetchUserProfile, getProfileImageUrl } from "../profile/client_profile";
import type { UserProfile } from "../profile/client_profile";
import { ThemeToggle } from "../components/theme-toggle";

export default function Header() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const pages = isAuthenticated ? routes : unauthenticated;

  useEffect(() => {
    if (isAuthenticated) {
      loadUserProfile();
    }
  }, [isAuthenticated]);

  const loadUserProfile = async () => {
    try {
      const profile = await fetchUserProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  };

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
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center">
              <div className="mr-4 hidden md:flex">
                <Link href="/" className="flex items-center space-x-3">
                  <ShoppingBasket className="h-8 w-8 text-primary" />
                  <span className="hidden text-xl font-bold sm:inline-block">
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
                  size="icon"
                  className="mr-2 px-0 text-base hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center space-x-2">
                    <ShoppingBasket className="h-6 w-6 text-primary" />
                    <span>Shoppy</span>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 mt-6">
                  {pages.map((page) => (
                    <Button
                      key={page.title}
                      variant="ghost"
                      className="w-full justify-start"
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

            {/* User Menu and Theme Toggle */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {isAuthenticated && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="relative h-10 w-10 rounded-full hover:bg-accent hover:text-accent-foreground"
                    >
                      <Avatar className="h-10 w-10">
                        {userProfile?.profileImage ? (
                          <AvatarImage 
                            src={getProfileImageUrl(userProfile.profileImage)} 
                            alt={`${userProfile.name || userProfile.username}'s avatar`}
                            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/avatars/01.png';
                            }}
                          />
                        ) : (
                          <AvatarFallback>
                            {(userProfile?.name || userProfile?.username || 'U').charAt(0).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem 
                      onClick={handleProfileClick}
                      className="cursor-pointer"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={logout}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </header>

      <ProfileDialog open={showProfile} onOpenChange={handleProfileClose} />
    </>
  );
}
