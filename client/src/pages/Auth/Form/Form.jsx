import PropTypes from 'prop-types';
import { useState } from 'react'
import { Text, Button } from '../../../components/ui';
import Navbar from '../NavBar/Navbar';
import { Link } from 'react-router-dom';

import styles from './Form.module.css';

export default function Form({ title, children }) {
  const [activeTab, setActiveTab] = useState(title.toLowerCase());

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className={styles.container}>
      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />
      
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