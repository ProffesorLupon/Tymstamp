// src/components/ui/tabs.js
import { createContext, useContext, useState } from 'react';

const TabsContext = createContext();

export function Tabs({ children, defaultValue, onValueChange }) {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (val) => {
    setValue(val);
    onValueChange?.(val);
  };

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleChange }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children }) {
  return <div className="flex gap-2">{children}</div>;
}

export function TabsTrigger({ children, value }) {
  const { value: current, onValueChange } = useContext(TabsContext);

  const isActive = current === value;

  return (
    <button
      onClick={() => onValueChange(value)}
      className={`px-4 py-2 rounded ${
        isActive ? 'bg-blue-500 text-white' : 'bg-blue-100 hover:bg-blue-300'
      }`}
    >
      {children}
    </button>
  );
}

export function TabsContent({ children, value }) {
  const { value: current } = useContext(TabsContext);

  if (current !== value) return null;

  return <div className="mt-4">{children}</div>;
}
