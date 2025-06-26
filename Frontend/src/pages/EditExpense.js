import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';

const EditExpense = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    category: '',
    expenseDate: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const res = await api.get(`/expenses/${id}`);
        const expense = res.data;
        
        setFormData({
          title: expense.title || '',
          description: expense.description || '',
          amount: expense.amount || '',
          category: expense.category || '',
          expenseDate: expense.expenseDate ? expense.expenseDate.split('T')[0] : ''
        });
      } catch (err) {
        console.error('Fetch expense error:', err);
        setError('Failed to load expense');
      } finally {
        setLoading(false);
      }
    };

    fetchExpense();
  }, [id]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const expenseData = {
        title: formData.title,
        description: formData.description,
        amount: parseFloat(formData.amount),
        category: formData.category,
        expenseDate: formData.expenseDate
      };

      await api.put(`/expenses/${id}`, expenseData);
      navigate('/');
    } catch (err) {
      console.error('Update expense error:', err);
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        'Failed to update expense'
      );
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <h2 className="mb-4 text-center">Edit Expense</h2>
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="mb-3">
            <label htmlFor="title" className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="amount" className="form-label">Amount</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              id="amount"
              name="amount"
              required
              value={formData.amount}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="category" className="form-label">Category</label>
            <select
              className="form-control"
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              <option value="Food">Food</option>
              <option value="Transportation">Transportation</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Shopping">Shopping</option>
              <option value="Utilities">Utilities</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="expenseDate" className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              id="expenseDate"
              name="expenseDate"
              required
              value={formData.expenseDate}
              onChange={handleChange}
            />
          </div>

          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <button 
              type="button" 
              className="btn btn-secondary me-md-2"
              onClick={() => navigate('/')}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Update Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExpense;
