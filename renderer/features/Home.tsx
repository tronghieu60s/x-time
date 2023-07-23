import { Button, Modal, Tabs } from 'flowbite-react';
import { useEffect, useState } from 'react';
import ShopeeHome from './ecoms/shopee/ShopeeHome';
import { User, getAuth, onAuthStateChanged } from 'firebase/auth';
import AuthLogin from './auth/AuthLogin';

export default function HomeFeature() {
  const [user, setUser] = useState<User | null>(null);

  const [isShowLogin, setIsShowLogin] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) setUser(user);
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // console.log('This will run every second!');
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto py-4">
      <div className="flex flex-col gap-4">
        <div>
          <Button onClick={() => setIsShowLogin(true)}>{user ? 'Logged' : 'Login'}</Button>
          {!user && (
            <Modal show={isShowLogin} dismissible={true} onClose={() => setIsShowLogin(false)}>
              <Modal.Header>Login</Modal.Header>
              <Modal.Body>
                <AuthLogin onCancel={() => setIsShowLogin(false)} />
              </Modal.Body>
            </Modal>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <Tabs.Group aria-label="Default tabs" style="fullWidth">
            <Tabs.Item active title="Shopee">
              <ShopeeHome user={user} />
            </Tabs.Item>
            <Tabs.Item active title="Lazada"></Tabs.Item>
            <Tabs.Item active title="Hasaki" disabled></Tabs.Item>
          </Tabs.Group>
        </div>
      </div>
    </div>
  );
}

