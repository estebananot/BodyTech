import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <svg className="w-32 h-32 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">404</h2>
        <p className="mt-2 text-lg text-gray-600">Página no encontrada</p>
        <p className="mt-2 text-sm text-gray-500">
          Lo sentimos, la página que buscas no existe.
        </p>
        <div className="mt-6">
          <Link to="/dashboard">
            <Button>Volver al Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
