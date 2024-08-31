import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';
import FormInput from '../../../components/form/InputBar/FormInput';
import { Button, Text } from '../../../components/ui';
import { useContext, useEffect, useState } from 'react';
import { Eye, User, Lock, Mail, EyeOff } from 'lucide-react';
import { AuthContext } from '../../../store/AuthProvider';
import { BACKEND_URL } from '../../../utils/connection';
// import CreateModal from '../Navigation/Modal/CreateQuiz/createquiz';
// import QuizType from '../Navigation/Modal/QuizType/quiztype'
import styles from './index.module.css';


export default function Settings() {

  return (
    <div className={styles.container}>
      <QuizType></QuizType>
    </div>
  );
}
