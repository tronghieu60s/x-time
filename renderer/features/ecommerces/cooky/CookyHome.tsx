import { Tabs } from 'flowbite-react';
import React, { useCallback, useState } from 'react';
import CookyFood from './CookyFood';
import CookyRecipe from './CookyRecipe';

const tabs = [
  { title: 'Cooky Foods', content: <CookyFood /> },
  { title: 'Cooky Recipes', content: <CookyRecipe /> },
];

export default function CookyHome() {
  const [tabSelected, setTabSelected] = useState([0]);

  const onActiveTabChange = useCallback(
    (tab) => {
      const tabIndex = tabSelected.findIndex((item) => item === tab);
      if (tabIndex === -1) setTabSelected([...tabSelected, tab]);
    },
    [tabSelected],
  );

  return (
    <div className="flex flex-col gap-4">
      <Tabs.Group style="fullWidth" onActiveTabChange={onActiveTabChange}>
        {tabs.map((tab, index) => (
          <Tabs.Item key={index} title={tab.title}>
            {tabSelected.includes(index) && tab.content}
          </Tabs.Item>
        ))}
      </Tabs.Group>
    </div>
  );
}
