import { useContext, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { Eye, Lock, Mail, EyeOff } from 'lucide-react';

import { AuthContext } from '../../../store/AuthProvider';
import FormInput from '../../../components/form/InputBar/FormInput';
import { Button, Spinner, Text } from '../../../components/ui';
import Form from '../Form/Form';
import { BACKEND_URL } from '../../../utils/connection';

import styles from './styles.module.css';

const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
const message = '* This field is required';

const userSchema = yup
  .object({
    email: yup.string().required(message).matches(emailRegex, { message: 'Invalid email format' }),
    password: yup.string().required(message),
  })
  .required();

export default function Login() {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    defaultValues: {
      email: localStorage.getItem('registrationEmail') || '',
      password: '',
    },
    resolver: yupResolver(userSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await fetch(
        BACKEND_URL + '/api/v1/auth/login',
        {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.message);
      }

      const resJson = await res.json();
      authCtx.login(resJson.data);
      navigate('/');
    } catch (error) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  useEffect(() => {
    localStorage.removeItem('registrationEmail'); // Clear email from local storage
  }, []);

  return (
    <Form title="Login">
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <FormInput
          error={errors.email}
          label="email"
          register={register}
          name={'Email'}
          mainIcon={<Mail />}
        />
        <FormInput
          error={errors.password}
          label="password"
          register={register}
          type="password"
          name={'Password'}
          mainIcon={<Lock />}
          secondaryIcon={<Eye />}
          tertiaryIcon={<EyeOff />}
        />

        <Button color='primary' variant={'form'}>
          <Text color='white' step={3} weight='700'>{isSubmitting ? <Spinner /> : 'Sign In'}</Text>
        </Button>
      </form>
    </Form>
  );
}
