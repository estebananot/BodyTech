import { useSelector } from 'react-redux';

const useAuth = () => {
  const { user, token, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    isLoggedIn: isAuthenticated || !!token
  };
};

export default useAuth;
