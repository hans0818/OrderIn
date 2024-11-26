import { useState } from 'react';

const useExpandPanel = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpandClick = () => {
    setIsExpanded((prev) => !prev);
  };

  return {
    isExpanded,
    handleExpandClick,
  };
};

export default useExpandPanel;
