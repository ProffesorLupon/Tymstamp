import { createContext, useContext, useState } from 'react';
import '../../App.css'; // Ensure the main stylesheet is imported

const TabsContext = createContext();

export function Tabs({ children, defaultValue, onValueChange }) {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (val) => {
    setValue(val);
    if (onValueChange) {
      onValueChange(val);
    }
  };

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleChange }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children }) {
  return <div className="flex border-b border-gray-300 mb-4">{children}</div>;
}

export function TabsTrigger({ children, value }) {
  const { value: current, onValueChange } = useContext(TabsContext);

  const isActive = current === value;

  const activeClasses = 'border-b-2 border-purple-600 text-purple-600';
  const inactiveClasses = 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';

  return (
    <button
      onClick={() => onValueChange(value)}
      className={`px-4 py-2 -mb-px text-sm font-medium focus:outline-none ${isActive ? activeClasses : inactiveClasses}`}
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
