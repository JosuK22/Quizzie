import { Toaster } from 'react-hot-toast';
import { Outlet, useNavigate } from 'react-router-dom';
import { Text } from '../../components/ui';
import { useContext, useEffect, useState } from 'react'; 
import { AuthContext } from '../../store/AuthProvider';
import Img from '../../assets/sad.png'

import styles from './index.module.css';

export default function AuthLayout() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); 

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (windowWidth < 800) {
    return (
      <>
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            style: {
              background: '#fff',
              color: 'black',
            },
          }}
        />

        <main className={styles.container}>
          <div className={styles.poster}>
            <Text color="white" step={6} weight='800'>
              Sorry Amigo 
            </Text>
            <img src={Img} className={styles.sad_img}>
            
            </img>
            <Text color="white" step={8} style={{ marginTop: '0.5rem' }}>
              This website is for desktop only
            </Text>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#fff',
            color: 'black',
          },
        }}
      />

      <main className={styles.container}>
        <div className={styles.outlet}>
        <Text step={9} weight='700'>QUIZZIE</Text>
          <Outlet />
        </div>
      </main>
    </>
  );
}
