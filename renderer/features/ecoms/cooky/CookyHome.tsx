import { Tabs } from 'flowbite-react';
import React from 'react';
import CookyFood from './CookyFood';

export default function CookyHome() {
  return (
    <div className="flex flex-col gap-4">
      <Tabs.Group aria-label="Default tabs" style="fullWidth">
        <Tabs.Item title="Cooky Foods">
          <CookyFood />
        </Tabs.Item>
      </Tabs.Group>
    </div>
  );
}
