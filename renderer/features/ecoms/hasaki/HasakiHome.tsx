import { Tabs } from 'flowbite-react';

export default function HasakiHome() {
  return (
    <div className="flex flex-col gap-4">
      <Tabs.Group aria-label="Default tabs" style="fullWidth">
        <Tabs.Item title="Hasaki Detect">
        </Tabs.Item>
      </Tabs.Group>
    </div>
  );
}

