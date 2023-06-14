import React, { createContext } from "react";

interface ItemsContextType {
  selectedItems: number[] | null;
  setSelectedItems: React.Dispatch<React.SetStateAction<number[]>>;
  //   (selectedItems: number[] | null) => void;
}

const ItemsContext = createContext<ItemsContextType>({
  selectedItems: [],
  setSelectedItems: () => {},
});

export default ItemsContext;
