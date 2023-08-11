import { auth } from '@/core/firebase';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { Button, Modal, Tabs } from 'flowbite-react';
import { useCallback, useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import AuthLogin from './auth/AuthLogin';
import AuthRegister from './auth/AuthRegister';
import CookyHome from './ecommerces/cooky/CookyHome';
import HasakiHome from './ecommerces/hasaki/HasakiHome';
import ShopeeHome from './ecommerces/shopee/ShopeeHome';

const tabs = [
  { title: 'Shopee', content: <ShopeeHome /> },
  { title: 'Lazada', content: <div>Lazada</div> },
  { title: 'Cooky', content: <CookyHome /> },
  { title: 'Hasaki', content: <HasakiHome /> },
];

export default function HomeFeature() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tabSelected, setTabSelected] = useState([0]);

  const [isRegister, setIsRegister] = useState(false);
  const [isShowLogin, setIsShowLogin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const onOpenLogin = useCallback(() => {
    if (currentUser)
      return signOut(auth).then(() => {
        toast.success('Đăng xuất thành công!');
      });

    setIsRegister(false);
    setIsShowLogin(true);
  }, [currentUser]);

  const onSwitchLogin = useCallback(() => {
    setIsRegister(!isRegister);
  }, [isRegister]);

  const onActiveTabChange = useCallback(
    (tab: number) => {
      const tabIndex = tabSelected.findIndex((item) => item === tab);
      if (tabIndex === -1) setTabSelected([...tabSelected, tab]);
    },
    [tabSelected],
  );

  const HomeAuth = isRegister ? AuthRegister : AuthLogin;

  return (
    <div className="container p-4 mx-auto">
      <Toaster />
      <div className="flex flex-col gap-4">
        <div>
          <Button onClick={onOpenLogin}>{currentUser ? 'Đăng Xuất' : 'Đăng Nhập'}</Button>
          <Modal show={isShowLogin} dismissible onClose={() => setIsShowLogin(false)}>
            <Modal.Header>{isRegister ? 'Đăng Ký' : 'Đăng Nhập'}</Modal.Header>
            <Modal.Body>
              <HomeAuth onCancel={() => setIsShowLogin(false)} onSwitch={onSwitchLogin} />
            </Modal.Body>
          </Modal>
        </div>
        <div className="flex flex-col gap-4">
          <Tabs.Group style="fullWidth" onActiveTabChange={onActiveTabChange}>
            {tabs.map((tab, index) => (
              <Tabs.Item key={index} title={tab.title}>
                {tabSelected.includes(index) && tab.content}
              </Tabs.Item>
            ))}
          </Tabs.Group>
        </div>
      </div>
    </div>
  );
}
