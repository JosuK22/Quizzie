// import { useContext, useMemo } from 'react';
import { Text } from '../../../components/ui';
// import useFetch from '../../../hooks/useFetch';
// import { AuthContext } from '../../../store/AuthProvider';
// import { BACKEND_URL } from '../../../utils/connection';
import Table from './Table/table';

import styles from './index.module.css';

export default function Analytics() {

  return (
    <div className={styles.container}>
      <Text step={8} color='#5076FF' weight='700'>Quiz Analysis</Text>
      <Table></Table>
    </div>
  );
}
