import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import { showToast } from '../../store/slices/uiSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(showToast({ message: 'Sesión cerrada', type: 'info' }));
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Mini Gestor</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-xs sm:text-sm text-gray-600 hidden xs:block">
              Hola, <span className="font-medium text-gray-900">{user?.name || 'Usuario'}</span>
            </span>
            <button
              onClick={handleLogout}
              className="text-xs sm:text-sm text-red-600 hover:text-red-700 transition-colors px-2 py-1 rounded hover:bg-red-50"
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
