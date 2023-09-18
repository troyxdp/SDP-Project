import React, { useState } from 'react';

const Tabs = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  return (
    <div className="tabs">
      <div className="tab-buttons">
        {['Tab 1', 'Tab 2', 'Tab 3', 'Tab 4', 'Tab 5'].map((label, index) => (
          <button
            key={index}
            className={index === activeTab ? 'active' : ''}
            onClick={() => handleTabClick(index)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {/* Content for the active tab */}
        {activeTab === 0 && <div>Tab 1 Content</div>}
        {activeTab === 1 && <div>Tab 2 Content</div>}
        {activeTab === 2 && <div>Tab 3 Content</div>}
        {activeTab === 3 && <div>Tab 4 Content</div>}
        {activeTab === 4 && <div>Tab 5 Content</div>}
      </div>
    </div>
  );
};

export default Tabs;
