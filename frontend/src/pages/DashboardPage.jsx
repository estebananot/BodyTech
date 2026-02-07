import { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import TaskEditModal from '../components/tasks/TaskEditModal';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Toast from '../components/common/Toast';
import useWebSocket from '../hooks/useWebSocket';

const DashboardPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { sendMessage, disconnect } = useWebSocket();

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Mis Tareas</h2>
          <Button onClick={() => setIsModalOpen(true)} className="text-sm sm:text-base">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden xs:inline">Nueva Tarea</span>
              <span className="xs:hidden">Tarea</span>
            </span>
          </Button>
        </div>
        <TaskList />
      </main>
      <Footer />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Crear Nueva Tarea">
        <TaskForm onClose={() => setIsModalOpen(false)} />
      </Modal>
      <TaskEditModal />
      <Toast />
    </div>
  );
};

export default DashboardPage;
