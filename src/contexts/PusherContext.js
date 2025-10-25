import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import Pusher from 'pusher-js';
import { useAuthContext } from '../auth/useAuthContext';
import generalSettingsService from '../services/api/generalSettingsService';

// ----------------------------------------------------------------------

const PusherContext = createContext({
  pusher: null,
  isConnected: false,
  subscribe: () => {},
  unsubscribe: () => {},
});

export const usePusher = () => {
  const context = useContext(PusherContext);
  if (!context) {
    throw new Error('usePusher must be used within PusherProvider');
  }
  return context;
};

// ----------------------------------------------------------------------

PusherProvider.propTypes = {
  children: PropTypes.node,
};

export function PusherProvider({ children }) {
  const { user } = useAuthContext();
  const [pusher, setPusher] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Initialize Pusher when user logs in
  useEffect(() => {
    let pusherClient = null;

    const initializePusher = async () => {
      try {
        // Fetch Pusher configuration
        const response = await generalSettingsService.getByCategory('integrations');
        
        if (!response.success || !response.settings) {
          console.log('⚠️  Integration settings not available');
          return;
        }

        const { pusher_enabled, pusher_key, pusher_cluster } = response.settings;

        if (!pusher_enabled || !pusher_key || !pusher_cluster) {
          console.log('⚠️  Pusher not enabled or configured');
          return;
        }

        // Initialize Pusher client
        pusherClient = new Pusher(pusher_key, {
          cluster: pusher_cluster,
          encrypted: true,
          authEndpoint: `${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/pusher/auth`,
          auth: {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          },
        });

        // Connection events
        pusherClient.connection.bind('connected', () => {
          console.log('✅ Pusher connected');
          setIsConnected(true);
        });

        pusherClient.connection.bind('disconnected', () => {
          console.log('⚠️  Pusher disconnected');
          setIsConnected(false);
        });

        pusherClient.connection.bind('error', (err) => {
          console.error('❌ Pusher connection error:', err);
        });

        setPusher(pusherClient);
        console.log('✅ Pusher client initialized');

      } catch (error) {
        console.error('❌ Failed to initialize Pusher:', error);
      }
    };

    if (user) {
      initializePusher();
    }

    // Cleanup on unmount or user logout
    return () => {
      if (pusherClient) {
        console.log('🔌 Disconnecting Pusher...');
        pusherClient.disconnect();
      }
    };
  }, [user]);

  // Subscribe to a channel
  const subscribe = useCallback((channelName, eventName, callback) => {
    if (!pusher) {
      console.warn('⚠️  Pusher not initialized');
      return null;
    }

    const channel = pusher.subscribe(channelName);
    channel.bind(eventName, callback);
    
    console.log(`✅ Subscribed to ${channelName}/${eventName}`);
    return channel;
  }, [pusher]);

  // Unsubscribe from a channel
  const unsubscribe = useCallback((channelName) => {
    if (!pusher) return;
    
    pusher.unsubscribe(channelName);
    console.log(`🔌 Unsubscribed from ${channelName}`);
  }, [pusher]);

  const value = {
    pusher,
    isConnected,
    subscribe,
    unsubscribe,
  };

  return <PusherContext.Provider value={value}>{children}</PusherContext.Provider>;
}

