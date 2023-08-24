import React, { createContext, useState, ReactNode, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserContextType {
  username: string | null;
  loadUsername: () => void;
  saveUsername: (newUsername: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(null);

  const loadUsername = async () => {
    const storedUsername = await AsyncStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  };

  const saveUsername = async (newUsername: string) => {
    await AsyncStorage.setItem("username", newUsername);
    setUsername(newUsername);
  };

  return (
    <UserContext.Provider value={{ username, loadUsername, saveUsername }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context) {
    return context;
  }
  throw new Error("useUser must be used within a useProvider!");
};
