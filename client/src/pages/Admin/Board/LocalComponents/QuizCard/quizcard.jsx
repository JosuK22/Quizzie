import styles from './quizcard.module.css';
import { Eye } from 'lucide-react';
import { Text } from '../../../../../components/ui';

export default function quizcard() {
  return (
    <div className={styles.quizcard}>

      <div className={styles.title}><Text step={5} weight='600'>Quiz 1</Text></div>
      <div className={styles.views}>
          <Text step={4} weight='600'>66K</Text>
          <Eye size={25}/>
      </div>
      <div className={styles.date}><Text step={2} weight='600'>Created on : sep, 2023 </Text></div>

    </div>
  )
}

