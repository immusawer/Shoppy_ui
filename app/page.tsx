"use client";

import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Select, MenuItem, FormControl, IconButton } from "@mui/material";
import FilterListIcon from '@mui/icons-material/FilterList';
import ProductCards from "./products/product";
import { getproducts, getCategories } from "./common/utill/fetch";
import CreateProductFab from "./products/create products/create-product-fab";

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
        <Typography>Loading products...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
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
          <FormControl sx={{ minWidth: 200, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
            <FilterListIcon sx={{ color: '#4CAF50' }} />
            <Select
              value={selectedCategory}
              onChange={(e) => {
                console.log("Category selected:", e.target.value);
                setSelectedCategory(e.target.value);
              }}
              sx={{ 
                backgroundColor: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#4CAF50',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#4CAF50',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#4CAF50',
                },
              }}
            >
              <MenuItem value="all">All Products</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{
              fontWeight: 'bold',
              color: '#1a1a1a',
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-10px',
                left: '0',
                width: '60px',
                height: '3px',
                // backgroundColor: '#4CAF50',
                borderRadius: '2px',
              }
            }}
          >
            Our Products
          </Typography>
        </Box>

        <ProductCards products={filteredProducts} />
        <CreateProductFab onProductCreated={fetchProducts} />
      </Box>
    </Container>
  );
}
