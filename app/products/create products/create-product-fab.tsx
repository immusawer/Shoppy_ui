"use client";
import { Fab } from "@mui/material";
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import CreateProductModal from "./create-product-modal";

interface CreateProductFabProps {
  onProductCreated?: () => void;
}

export default function CreateProductFab({ onProductCreated }: CreateProductFabProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <CreateProductModal 
        open={open} 
        handleClose={() => setOpen(false)} 
        onProductCreated={onProductCreated}
      />
      <div>
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: "fixed",
            bottom: 40,
            left: 40,
            backgroundColor: "#1a1a1a",
            color: "white",
            "&:hover": {
              backgroundColor: "#2a2a2a",
            },
            transition: "all 0.3s ease-in-out",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
            border: "1px solid #333",
          }}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => setOpen(true)}
        >
          <AddIcon />
        </Fab>
      </div>
    </>
  );
}
