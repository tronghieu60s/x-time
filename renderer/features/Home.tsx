import { Modal, Button, Tabs } from "flowbite-react";
import ShopeeHome from "./ecoms/shopee/ShopeeHome";
import AuthLogin from "./auth/AuthLogin";
import { useState } from "react";

export default function HomeFeature() {
  const [isShowLogin, setIsShowLogin] = useState(false);

  return (
    <div className="container mx-auto px-2 py-4">
      <div className="flex flex-col gap-4">
        <div>
          <Button size="sm" onClick={() => setIsShowLogin(true)}>
            Login
          </Button>
          <Modal show={isShowLogin} onClose={() => setIsShowLogin(false)}>
            <Modal.Header>Login</Modal.Header>
            <Modal.Body>
              <AuthLogin onCancel={() => setIsShowLogin(false)} />
            </Modal.Body>
          </Modal>
        </div>
        <Tabs.Group aria-label="Default tabs" style="default">
          <Tabs.Item active title="Shopee Detect">
            <ShopeeHome />
          </Tabs.Item>
          <Tabs.Item title="Shopee Promotion">
          </Tabs.Item>
        </Tabs.Group>
      </div>
    </div>
  );
}
