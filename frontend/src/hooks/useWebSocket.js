import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showToast } from '../store/slices/uiSlice';
import { fetchTasks } from '../store/slices/taskSlice';

const WEBSOCKET_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080';

const useWebSocket = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    if (!user || !token) return;

    try {
      wsRef.current = new WebSocket(WEBSOCKET_URL);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        reconnectAttemptsRef.current = 0;
        
        wsRef.current.send(JSON.stringify({
          type: 'subscribe',
          userId: user.id
        }));
      };

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'task_update':
            dispatch(showToast({
              message: `Tarea "${data.task.title}" ${getActionMessage(data.action)}`,
              type: 'info'
            }));
            dispatch(fetchTasks());
            break;
            
          case 'subscribed':
            console.log('Subscribed to notifications');
            break;
            
          case 'pong':
            console.log('WebSocket alive');
            break;
            
          default:
            console.log('Unknown message:', data);
        }
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        attemptReconnect();
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      attemptReconnect();
    }
  }, [user, token, dispatch]);

  const attemptReconnect = useCallback(() => {
    if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      return;
    }

    reconnectAttemptsRef.current++;
    const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${reconnectAttemptsRef.current})`);
    
    reconnectTimeoutRef.current = setTimeout(() => {
      connect();
    }, delay);
  }, [connect]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const sendMessage = useCallback((message) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    sendMessage,
    disconnect,
    reconnect: connect
  };
};

const getActionMessage = (action) => {
  const messages = {
    created: 'ha sido creada',
    updated: 'ha sido actualizada',
    deleted: 'ha sido eliminada',
    status_changed: 'ha cambiado de estado'
  };
  return messages[action] || 'ha sido modificada';
};

export default useWebSocket;
