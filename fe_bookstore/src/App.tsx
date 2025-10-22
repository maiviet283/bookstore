import { RouterProvider } from 'react-router-dom';
import router from './routes';
import Toast from './components/Toast';


export default function App() {
  return (
    <>
      <Toast />
      <RouterProvider router={router} />
    </>
  );
}