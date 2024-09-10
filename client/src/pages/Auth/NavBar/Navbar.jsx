import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Text } from '../../../components/ui';
import styles from './Navbar.module.css';

function Navbar() {
  return (
    <div className={styles.navbar}>
      <NavLink to="/auth" end>
        {({ isActive }) => (
          <Button
          variant={'form'}
          color={isActive ? 'neutral' : 'success'}
          >
            <Text step={3} weight="700">Sign In</Text>
          </Button>
        )}
      </NavLink>
      <NavLink to="/auth/register">
        {({ isActive }) => (
          <Button
          variant={'form'}
          color={isActive ? 'neutral' : 'success'}
          >
            <Text step={3} weight="700">Sign Up</Text>
          </Button>
        )}
      </NavLink>
    </div>
  );
}

Navbar.propTypes = {
  activeTab: PropTypes.oneOf(['login', 'register']).isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export default Navbar;
