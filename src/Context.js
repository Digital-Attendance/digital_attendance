import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GUEST_USER_DATA = Object.freeze({ email: "guest", role: "guest" });
const AsyncStorageContext = createContext();

export const AsyncStorageProvider = ({ children }) => {
  const [userData, setUserData] = useState(GUEST_USER_DATA);

  const handleStorageOperation = async (operation, key, value = null) => {
    try {
      if (operation === 'get') {
        const storedData = await AsyncStorage.getItem(key);
        return storedData ? JSON.parse(storedData) : null;
      } else if (operation === 'set') {
        await AsyncStorage.setItem(key, JSON.stringify(value));
      } else if (operation === 'remove') {
        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`AsyncStorage ${operation} error:`, error);
    }
    return null;
  };

  const fetchUserData = useCallback(async () => {
    const storedUserData = await handleStorageOperation('get', 'userData');
    setUserData(storedUserData || GUEST_USER_DATA);
  }, []);

  const setUserDataInStorage = useCallback(async (data) => {
    await handleStorageOperation('set', 'userData', data);
    setUserData(data);
  }, []);

  const clearUserDataFromStorage = useCallback(async () => {
    await handleStorageOperation('remove', 'userData');
    setUserData(GUEST_USER_DATA);
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const contextValue = useMemo(
    () => ({
      userData,
      fetchUserData,
      setUserDataInStorage,
      clearUserDataFromStorage,
    }),
    [userData, fetchUserData, setUserDataInStorage, clearUserDataFromStorage]
  );

  return (
    <AsyncStorageContext.Provider value={contextValue}>
      {children}
    </AsyncStorageContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(AsyncStorageContext);
  if (!context) {
    throw new Error("useUserContext must be used within an AsyncStorageProvider");
  }
  return context;
};
