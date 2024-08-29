import React, { useState } from 'react';
import Table from './Table/table';
import { ArrowLeft } from 'lucide-react';
import QuestionAnalysis from './Question/questionAnalysis';
import styles from './index.module.css';

export default function Analytics() {
  const [selectedQuizId, setSelectedQuizId] = useState(null);

  const handleViewAnalysis = (quizId) => {
    setSelectedQuizId(quizId);
  };

  const handleBackToTable = () => {
    setSelectedQuizId(null);
  };

  return (
    <div className={styles.container}>
      {selectedQuizId ? (
        <>
          <div className={styles.header}>
            <button className={styles.button} onClick={handleBackToTable}>
              <ArrowLeft size={26} />
            </button>
          </div>
          <QuestionAnalysis quizId={selectedQuizId} />
        </>
      ) : (
        <Table onViewAnalysis={handleViewAnalysis} />
      )}
    </div>
  );
}
