import { useEffect, useRef } from 'react';
import { supabase } from '../config/supabaseClient';

export const useProductosChannel = (handlers = {}) => {
  const channelRef = useRef(null);

  useEffect(() => {
    const channel = supabase
      .channel('productos-hook')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'productos' }, payload => {
        handlers.onInsert?.(payload.new);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'productos' }, payload => {
        handlers.onUpdate?.(payload.new, payload.old);
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'productos' }, payload => {
        handlers.onDelete?.(payload.old);
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [handlers]);

  return channelRef.current;
};