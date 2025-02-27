import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import BASE_URL from '../url';


const AsyncStorageContext = createContext();
export const AsyncStorageProvider = ({children}) => {
  
  console.log('BASE_URL:', BASE_URL);

  const [user, setUser] = useState(null);
  const [userEmail, setUserEmail] = useState('');

  // useEffect(() => {
  //   checkLoginStatus();
  // }, []);

  // const checkLoginStatus = async () => {
  //   const token = await AsyncStorage.getItem('access_token');
  //   if (token) {
  //     try {
  //       const response = await axios.get(`${BASE_URL}/session_status`, {
  //         headers: {Authorization: `Bearer ${token}`},
  //       });
  //       setUser(response.data);
  //     } catch (error) {
  //       await AsyncStorage.removeItem('access_token');
  //     }
  //   }
  // };

  const logout = async () => {
    await axios.post(`${BASE_URL}/logout`);
    await AsyncStorage.removeItem('access_token');
    setUser(null);
    setUserEmail('');
  };

  const contextValue = useMemo(
    () => ({
      user,
      userEmail,
      setUserEmail,
      logout,
    }),
    [user, logout],
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
    console.log(
      'useUserContext must be used within an AsyncStorageProvider',
    );
  }
  return context;
};
