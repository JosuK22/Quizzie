import { useContext } from 'react';
import { Button, Text } from "../../../../../components/ui";
import { AuthContext } from '../../../../../store/AuthProvider';
import styles from './logout.module.css';

function LogoutModal({ toggleModal }) { // Receive toggleModal as a prop
  const { logout } = useContext(AuthContext);

  return (
    <div className={styles.logoutContent}>
      <Text step={4} weight="500" style={{ textAlign: 'center' }}>
        Are you sure you want to logout?
      </Text>

      <div className={styles.logoutActions}>
        <Button onClick={logout}>Yes, Logout</Button>
        <Button variant="outline" color="error" onClick={toggleModal}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default LogoutModal;
