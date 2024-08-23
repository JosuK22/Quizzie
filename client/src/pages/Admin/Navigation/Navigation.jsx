// Navigation.jsx
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Text, Modal } from '../../../components/ui';
import { CreateQuizModal, LogoutModal, QuizTypeModal } from './Modal'; // Make sure QuizTypeModal is imported
import useModal from '../../../hooks/useModal';

import styles from './Navigation.module.css';

export default function Navigation() {
  const { isOpen, toggleModal } = useModal();
  const [modalContent, setModalContent] = useState(null);
  const [quizType, setQuizType] = useState(''); // State to hold the selected quiz type
  const [quizName, setQuizName] = useState('');

  const handleCreateQuizClick = () => {
    setModalContent(<CreateQuizModal toggleModal={toggleModal} onContinue={handleContinue} />);
    toggleModal(); 
  };

  const handleLogoutClick = () => {
    setModalContent(<LogoutModal toggleModal={toggleModal} />);
    toggleModal(); 
  };

  const handleContinue = (selectedType,quizName) => {
    setQuizName(quizName)
    setQuizType(selectedType);
    setModalContent(<QuizTypeModal toggleModal={toggleModal} quizType={selectedType} quizName={quizName}/>);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.logolinkContainer}>
          <div className={styles.logo}>
            <Link to="/">
              <Text step={7} weight="800">
                QUIZZIE
              </Text>
            </Link>
          </div>

          <nav className={styles.links}>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? styles.active : '')}
            >
              <div className={styles.link}>
                <Text step={5} weight="500">Dashboard</Text>
              </div>
            </NavLink>

            <NavLink
              to={'analytics'}
              className={({ isActive }) => (isActive ? styles.active : '')}
            >
              <Text step={5} weight="500">Analytics</Text>
            </NavLink>

            <div
              onClick={handleCreateQuizClick}
              className={styles.link}
            >
              <Text step={5} weight="500">Create Quiz</Text>
            </div>
          </nav>
        </div>

        <div onClick={handleLogoutClick} className={styles.logout}>
          <Text step={5} weight='600'>Logout</Text>
        </div>
      </div>

      {isOpen && (
        <Modal toggleModal={toggleModal}>
          {modalContent} 
        </Modal>
      )}
    </>
  );
}
