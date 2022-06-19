import React from "react";

let AppContext = React.createContext(null);

export const AppContextProvider = ({ children }) => {
  const [searchedValue, setSearchedValue] = React.useState(undefined);

  let value = { searchedValue, setSearchedValue };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => React.useContext(AppContext);
