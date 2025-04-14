
import React, { createContext, useContext } from "react";
import { useUser } from "./UserContext";

interface UserSettingsContextType {
  userSettings: UserSettings;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
}

const UserSettingsContext = createContext<UserSettingsContextType>({
  userSettings: {} as UserSettings,
  updateUserSettings: () => {}
});

export const useUserSettings = () => useContext(UserSettingsContext);

export const UserSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userSettings, updateUserSettings } = useUser();
  
  return (
    <UserSettingsContext.Provider value={{ userSettings, updateUserSettings }}>
      {children}
    </UserSettingsContext.Provider>
  );
};

export default UserSettingsProvider;
