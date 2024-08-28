import PropTypes from 'prop-types';
import { Text } from '../../ui';

import styles from './FormInput.module.css';
import { useState } from 'react';

const checkType = (type) => {
  if (type === 'password') {
    return false;
  }

  return true;
};

export default function FormInput({
  register,
  error,
  label,
  name,
  secondaryIcon,
  tertiaryIcon,
  type = 'text',
}) {
  const [isVisible, setIsVisible] = useState(() => checkType(type));


  const togglePassword = () => {
    setIsVisible((prev) => !prev);
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.name}><Text step={4} weight='600'>{name}</Text></div>
        <div className={`${styles.input} ${error ? styles.errorBorder : ''}`}>
          <input
            {...register(label)}
            type={isVisible ? 'text' : 'password'}
            placeholder={error?.message || ''}
            className={error ? styles.errorPlaceholder : ''}
          />
          <div
            onClick={togglePassword}
            style={{ cursor: 'pointer' }}
            className={styles.icon}
          >
          {isVisible ? secondaryIcon : tertiaryIcon}
          </div>
        </div>

      </div>
      
      
    </div>
  );
}

FormInput.propTypes = {
  label: PropTypes.string.isRequired,
  error: PropTypes.object,
  type: PropTypes.string,
  name: PropTypes.string,
  mainIcon: PropTypes.element,
  secondaryIcon: PropTypes.element,
  register: PropTypes.any,
};
