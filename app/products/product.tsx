"use client";

import React from "react";
import { Card, CardContent, Typography, Grid, CardMedia, Box } from "@mui/material";
import { Product, ProductCardsProps, getImageUrl } from "./productList";

const ProductCards: React.FC<ProductCardsProps> = ({ products }) => {
  console.log("Products array:", products);

  return (
    <Grid container spacing={4}>
      {products.map((product) => {
        const imageUrl = getImageUrl(product);
        console.log("Product image URL:", imageUrl);
        
        return (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                "&:hover": { 
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                  transform: "translateY(-4px)",
                },
                transition: "all 0.3s ease-in-out",
                borderRadius: "12px",
                overflow: "hidden",
                backgroundColor: "#1a1a1a",
                color: "white",
              }}
            >
              {imageUrl ? (
                <CardMedia
                  component="img"
                  height="200"
                  image={imageUrl}
                  alt={product.name}
                  sx={{ 
                    objectFit: 'cover',
                    borderBottom: "1px solid #333",
                  }}
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    console.error(`Failed to load image: ${imageUrl}`);
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.jpg'; // Fallback image
                  }}
                />
              ) : (
                <Box 
                  sx={{ 
                    height: 200, 
                    bgcolor: '#2a2a2a', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    borderBottom: "1px solid #333",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    No image available
                  </Typography>
                </Box>
              )}
              <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Typography
                  variant="caption"
                  sx={{ 
                    color: "#888",
                    display: "block",
                    mb: 1,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {product.category?.name || "Uncategorized"}
                </Typography>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="div"
                  sx={{ 
                    fontWeight: "bold",
                    color: "white",
                    mb: 1,
                  }}
                >
                  {product.name}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: "#aaa",
                    mb: 2,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {product.detail}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ 
                    color: "#4CAF50",
                    fontWeight: "bold",
                    mt: "auto",
                  }}
                >
                  ${product.price.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default ProductCards;
