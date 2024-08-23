import React, { useState } from 'react';
import { Text } from '../../../components/ui';
import Table from './Table/table';
import QuestionAnalysis from './Question/questionAnalysis';
import styles from './index.module.css';

export default function Analytics() {
  const [selectedQuizId, setSelectedQuizId] = useState(null);

  const handleViewAnalysis = (quizId) => {
    setSelectedQuizId(quizId);
  };

  return (
    <div className={styles.container}>
      {selectedQuizId ? (
        <QuestionAnalysis quizId={selectedQuizId} />
      ) : (
        <Table onViewAnalysis={handleViewAnalysis} />
      )}
    </div>
  );
}
