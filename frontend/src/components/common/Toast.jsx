import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideToast } from '../../store/slices/uiSlice';

const Toast = () => {
  const dispatch = useDispatch();
  const { show, message, type } = useSelector((state) => state.ui.toast);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        dispatch(hideToast());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, dispatch]);

  if (!show) return null;

  const types = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  };

  return (
    <div className={`fixed top-4 right-4 ${types[type]} text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 max-w-sm`}>
      <span className="flex-1">{message}</span>
      <button
        onClick={() => dispatch(hideToast())}
        className="text-white hover:text-gray-200 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default Toast;
