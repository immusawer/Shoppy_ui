"use client";

import React from "react";
import { Product, ProductCardsProps, getImageUrl } from "./productList";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

const ProductCards: React.FC<ProductCardsProps> = ({ products }) => {
  console.log("Products array:", products);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => {
        const imageUrl = getImageUrl(product);
        console.log("Product image URL:", imageUrl);
        
        return (
          <Card key={product.id} className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="relative aspect-square overflow-hidden">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    console.error(`Failed to load image: ${imageUrl}`);
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.jpg';
                  }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted">
                  <span className="text-sm text-muted-foreground">No image available</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  {product.category?.name || "Uncategorized"}
                </Badge>
                <span className="text-lg font-bold text-primary">
                  ${product.price.toFixed(2)}
                </span>
              </div>
              <h3 className="text-lg font-semibold leading-none tracking-tight">
                {product.name}
              </h3>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {product.detail}
              </p>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm" className="w-full">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default ProductCards;
