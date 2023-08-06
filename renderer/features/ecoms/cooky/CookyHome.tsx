import { Tabs } from 'flowbite-react';
import React from 'react';
import CookyFood from './CookyFood';
import CookyRecipe from './CookyRecipe';

export default function CookyHome() {
  return (
    <div className="flex flex-col gap-4">
      <Tabs.Group style="fullWidth">
        <Tabs.Item title="Cooky Foods">
          <CookyFood />
        </Tabs.Item>
        <Tabs.Item title="Cooky Recipes">
          <CookyRecipe />
        </Tabs.Item>
      </Tabs.Group>
    </div>
  );
}
