import { createBrowserRouter } from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import BookDetail from '../pages/BookDetail';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import Cart from '../pages/Cart';


const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'sach/:slug', element: <BookDetail /> },
      { path: 'login', element: <Login /> },
      { path: 'cart', element: <Cart />},
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export default router;
