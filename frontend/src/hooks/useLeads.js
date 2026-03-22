import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';

export const useLeads = (filters = {}) => {
  const [leads, setLeads]           = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading]       = useState(true);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (filters.status && filters.status !== 'All') p.append('status', filters.status);
      if (filters.search) p.append('search', filters.search);
      p.append('page',  filters.page  || 1);
      p.append('limit', filters.limit || 10);
      const { data } = await api.get(`/api/leads?${p}`);
      setLeads(data.data);
      setPagination(data.pagination);
    } catch {
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.search, filters.page, filters.limit]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const createLead = async body => {
    await api.post('/api/leads', body);
    toast.success('Lead created!');
    fetchLeads();
  };

  const updateLead = async (id, body) => {
    await api.put(`/api/leads/${id}`, body);
    toast.success('Lead updated!');
    fetchLeads();
  };

  const deleteLead = async id => {
    await api.delete(`/api/leads/${id}`);
    toast.success('Lead deleted!');
    fetchLeads();
  };

  const addNote = async (id, text) => {
    await api.post(`/api/leads/${id}/notes`, { text });
    toast.success('Note added!');
    fetchLeads();
  };

  return { leads, pagination, loading, refetch: fetchLeads, createLead, updateLead, deleteLead, addNote };
};

export const useStats = () => {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/leads/stats/summary')
      .then(r => setStats(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading };
};
