import React, { createContext, useState, useContext } from 'react';

// 1. Buat Context
const SearchContext = createContext();

// 2. Buat Provider (Komponen yang akan menyediakan state)
export const SearchProvider = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
            {children}
        </SearchContext.Provider>
    );
};

// 3. Buat Custom Hook untuk mempermudah penggunaan
export const useSearch = () => {
    return useContext(SearchContext);
};
