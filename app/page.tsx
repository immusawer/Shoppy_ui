"use client";

import React, { useEffect, useState } from "react";
import { Container, Box } from "@mui/material";
import { Filter } from "lucide-react";
import ProductCards from "./products/product";
import { getproducts, getCategories } from "./common/utill/fetch";
import CreateProductFab from "./products/create products/create-product-fab";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Product {
  id: number;
  name: string;
  detail: string;
  price: number;
  imageUrl: string;
  category: {
    id: number;
    name: string;
  };
}

interface Category {
  id: number;
  name: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const data = await getproducts("http://localhost:3001/products/all");
      console.log("Products data received:", JSON.stringify(data, null, 2));
      setProducts(data);
      setFilteredProducts(data);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      const errorMessage = error.code === 'ECONNREFUSED' 
        ? "Cannot connect to the server. Please ensure the backend server is running."
        : "Failed to load products";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoriesList = async () => {
    try {
      const data = await getCategories();
      console.log("Categories data:", JSON.stringify(data, null, 2));
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategoriesList();
  }, []);

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredProducts(products);
    } else {
      console.log("Selected category:", selectedCategory);
      console.log("Products before filtering:", JSON.stringify(products, null, 2));
      const filtered = products.filter((product) => {
        console.log("Product:", product.name, "Category:", product.category);
        console.log("Comparing:", product.category?.id?.toString(), "with", selectedCategory);
        return product.category?.id?.toString() === selectedCategory;
      });
      console.log("Filtered products:", JSON.stringify(filtered, null, 2));
      setFilteredProducts(filtered);
    }
  }, [selectedCategory, products]);

  if (loading) {
    return (
      <Container>
        <div className="text-foreground">Loading products...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="text-destructive">{error}</div>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          position: 'relative'
        }}>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            <Select
              value={selectedCategory}
              onValueChange={(value) => {
                console.log("Category selected:", value);
                setSelectedCategory(value);
              }}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground relative pb-4 group">
              <span className="inline-block transition-transform duration-300 group-hover:scale-105">
                Our Products
              </span>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60px] h-[3px] bg-primary rounded-sm transform origin-left transition-all duration-300 group-hover:w-[120px] group-hover:bg-gradient-to-r from-primary to-primary/50"></span>
            </h1>
            <p className="text-muted-foreground mt-2 text-sm md:text-base transition-opacity duration-300 group-hover:opacity-100">
              Discover our amazing collection
            </p>
          </div>
        </Box>

        <ProductCards products={filteredProducts} />
        <CreateProductFab onProductCreated={fetchProducts} />
      </Box>
    </Container>
  );
}
