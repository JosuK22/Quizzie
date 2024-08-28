import React from 'react';
import styles from './quizcard.module.css';
import { Eye } from 'lucide-react';
import { Text } from '../../../../../components/ui';

const formatImpressions = (impressions) => {
  if (impressions >= 1000) {
    return `${(impressions / 1000).toFixed(1)}K`;
  }
  return impressions;
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default function QuizCard({ name, impressions, createdAt }) {
  return (
    <div className={styles.quizcard}>
      <div className={styles.title}>
        <Text step={5} weight='600'>{name}</Text>
      </div>
      <div className={styles.views}>
        <Text step={4} weight='600'>{formatImpressions(impressions)}</Text>
        <Eye size={25} />
      </div>
      <div className={styles.date}>
        <Text step={2} weight='600'>Created on : {formatDate(createdAt)}</Text>
      </div>
    </div>
  );
}
