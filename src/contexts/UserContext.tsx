import React, {createContext} from 'react';

interface UserContextType {
  userId: string | null;
  setUserId: (userId: string | null) => void;
  userName: string | null;
  setUserName: (userName: string | null) => void;
}

const UserContext = createContext<UserContextType>({
  userId: null,
  setUserId: () => {},
  userName: null,
  setUserName: () => {},
});

export default UserContext;
