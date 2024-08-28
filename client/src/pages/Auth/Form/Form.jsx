import PropTypes from 'prop-types';
import { Text, Button } from '../../../components/ui';
import { Link } from 'react-router-dom';

import styles from './Form.module.css';

export default function Form({ title, children }) {
  return (
    <div className={styles.container}>

      <div className={styles.header}>
        <Button variant={'ghost'}>
          <Text step={2}  weight="500">{title}</Text>
        </Button>
      
        <Link to={title == 'Register' ? '..' : 'register'}>
          <Button variant="outline" >
            {title == 'Register' ? 'Login' : 'Register'}
          </Button>  
        </Link>
      
      </div>
      
      <div className={styles.content}>
        {children}
      </div>
      

    </div>
  );
}

Form.propTypes = {
  title: PropTypes.oneOf(['Login', 'Register']).isRequired,
  children: PropTypes.node,
};
