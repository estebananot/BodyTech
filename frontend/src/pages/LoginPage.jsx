import LoginForm from '../components/auth/LoginForm';
import Toast from '../components/common/Toast';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-3 py-8 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <svg className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <h2 className="mt-4 text-center text-2xl sm:text-3xl font-bold text-gray-900">
          Mini Gestor de Tareas
        </h2>
        <p className="mt-2 text-center text-sm sm:text-base text-gray-600">
          Inicia sesión para gestionar tus tareas
        </p>
      </div>
      <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 px-4 shadow sm:rounded-lg sm:px-8">
          <LoginForm />
        </div>
      </div>
      <Toast />
    </div>
  );
};

export default LoginPage;
