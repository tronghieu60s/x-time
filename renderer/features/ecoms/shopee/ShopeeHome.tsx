import { Button, Modal, Tabs } from 'flowbite-react';
import ShopeeDetect from './ShopeeDetect';
import { Settings } from 'react-feather';
import { useCallback, useState } from 'react';
import ShopeeSetting from './ShopeeSetting';
import ShopeePromotion from './ShopeePromotion';

const apiTestLogin = '/api/ecoms/shopee/auth/test-login';

export default function ShopeeHome() {
  const [isLogged, setIsLogged] = useState(false);
  const [clickedLogin, setClickedLogin] = useState(false);
  const [isShowSetting, setIsShowSetting] = useState(false);

  const onTestLogin = useCallback(() => {
    fetch(apiTestLogin, { method: 'POST' })
      .then((res) => res.json())
      .then((res) => {
        const { logged = false } = res;
        setIsLogged(logged);
        setClickedLogin(true);
      });
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <form className="flex justify-between gap-2">
        <div className="flex items-center gap-4">
          <Button size="sm" onClick={onTestLogin} outline={clickedLogin}>
            {clickedLogin ? (isLogged ? 'Logged' : 'Not Logged') : 'Test Login'}
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => setIsShowSetting(true)}>
              <Settings size={20} />
            </Button>
          </div>
        </div>
      </form>
      <Tabs.Group aria-label="Default tabs" style="default">
        <Tabs.Item active title="Shopee Detect">
          <ShopeeDetect />
        </Tabs.Item>
        <Tabs.Item title="Shopee Promotion">
          <ShopeePromotion />
        </Tabs.Item>
      </Tabs.Group>
      <Modal show={isShowSetting} dismissible={true} onClose={() => setIsShowSetting(false)}>
        <Modal.Header>Settings</Modal.Header>
        <Modal.Body>
          <ShopeeSetting onClose={() => setIsShowSetting(false)} />
        </Modal.Body>
      </Modal>
    </div>
  );
}
