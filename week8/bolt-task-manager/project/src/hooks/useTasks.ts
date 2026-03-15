import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Task, TaskFormData } from '../types';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setTasks(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();

    const subscription = supabase
      .channel('tasks')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
        fetchTasks();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const createTask = async (formData: TaskFormData) => {
    try {
      setError(null);
      const { error: createError } = await supabase.from('tasks').insert({
        title: formData.title,
        description: formData.description || null,
        status: formData.status,
        due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null,
      });

      if (createError) throw createError;
      await fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
      throw err;
    }
  };

  const updateTask = async (id: string, formData: TaskFormData) => {
    try {
      setError(null);
      const { error: updateError } = await supabase
        .from('tasks')
        .update({
          title: formData.title,
          description: formData.description || null,
          status: formData.status,
          due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (updateError) throw updateError;
      await fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      setError(null);
      const { error: deleteError } = await supabase.from('tasks').delete().eq('id', id);

      if (deleteError) throw deleteError;
      await fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      throw err;
    }
  };

  return { tasks, loading, error, createTask, updateTask, deleteTask, setError };
}
