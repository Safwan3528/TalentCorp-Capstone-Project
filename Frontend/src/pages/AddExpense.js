import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const AddExpense = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    category: '',
    expenseDate: new Date().toISOString().split('T')[0] // Default to today
  });

  const [error, setError] = useState('');

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

      await api.post('/expenses', expenseData);
      navigate('/');
    } catch (err) {
      console.error('Add expense error:', err);
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        'Failed to add expense. Please try again.'
      );
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <h2 className="mb-4 text-center">Add New Expense</h2>
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

          <button type="submit" className="btn btn-success w-100">Add Expense</button>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
