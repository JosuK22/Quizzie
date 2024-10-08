import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AdminLayout from './pages/Admin';
import AuthLayout from './pages/Auth';
import PublicLayout from './pages/Public';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import AuthProvider from './store/AuthProvider';
import Board from './pages/Admin/Board';
import Analytics from './pages/Admin/Analytics';
import Settings from './pages/Admin/Settings';
import { QuizProvider } from './store/QuizProvider'; // Import QuizProvider

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthProvider>
        <QuizProvider> {/* Wrap the whole admin layout with QuizProvider */}
          <AdminLayout />
        </QuizProvider>
      </AuthProvider>
    ),
    children: [
      {
        index: true, element: <Board />,
      },
      {
        path: 'analytics', element: <Analytics />,
      },
      { path: 'settings', element: <Settings /> },
    ],
  },
  {
    path: '/auth',
    element: (
      <AuthProvider>
        <AuthLayout />
      </AuthProvider>
    ),
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
    ],
  },
  {
    path: '/quiz/:quizId',
    element: (<AuthProvider>
      <QuizProvider> 
        <PublicLayout />
      </QuizProvider>
    </AuthProvider>),
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
