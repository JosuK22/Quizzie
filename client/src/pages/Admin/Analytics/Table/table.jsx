import React from 'react';
import styles from './table.module.css';

const QuizTable = () => {
  const quizzes = [
    { id: 1, name: 'Quiz 1', createdAt: '2023-09-01', impressions: '500' },
    { id: 2, name: 'Quiz 2', createdAt: '2023-09-04', impressions: '667' },
    { id: 3, name: 'Quiz 3', createdAt: '2023-09-07', impressions: '820' },
    { id: 4, name: 'Quiz 4', createdAt: '2023-09-09', impressions: '789' },
    { id: 5, name: 'Quiz 5', createdAt: '2023-09-12', impressions: '1.1K' },
  ];

  return (
    <div className={styles.quizTableContainer}>
      <table className={styles.quizTable}>
        <thead>
          <tr className={styles.tablehead}>
            <th>S.No</th>
            <th>Quiz Name</th>
            <th>Created on</th>
            <th>Impression</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((quiz, index) => (
            <tr key={quiz.id} className={styles.tableRow}>
              <td className={styles.cell}>{index + 1}</td>
              <td className={styles.cell}>{quiz.name}</td>
              <td className={styles.cell}>
                {new Date(quiz.createdAt).toLocaleDateString()}
              </td>
              <td className={styles.cell}>{quiz.impressions}</td>
              <td className={styles.cell}>
                <button className={styles.editBtn}>✏️</button>
                <button className={styles.deleteBtn}>🗑️</button>
                <button className={styles.shareBtn}>🔗</button>
                <a href={`/analysis/${quiz.id}`} className={styles.analysisLink}>
                  Question Wise Analysis
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuizTable;
