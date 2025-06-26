import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/api';

const ExpenseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expense, setExpense] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const res = await api.get(`/expenses/${id}`);
        setExpense(res.data);
      } catch (err) {
        console.error('Fetch expense details error:', err);
        setError('Unable to fetch expense details.');
      } finally {
        setLoading(false);
      }
    };

    fetchExpense();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this expense?');
    if (!confirmed) return;

    try {
      await api.delete(`/expenses/${id}`);
      navigate('/');
    } catch (err) {
      console.error('Delete expense error:', err);
      alert('Failed to delete expense');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleDateString();
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) return (
    <div className="d-flex justify-content-center">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
  
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!expense) return <div className="alert alert-info">No expense found.</div>;

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card shadow">
          <div className="card-header bg-primary text-white">
            <div className="d-flex justify-content-between align-items-center">
              <h3 className="mb-0">Expense Details</h3>
              <span className="badge bg-light text-dark">{expense.category}</span>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <h4 className="text-primary">{expense.title}</h4>
                {expense.description && (
                  <div className="mb-3">
                    <strong>Description:</strong>
                    <p className="text-muted">{expense.description}</p>
                  </div>
                )}
              </div>
              <div className="col-md-6 text-md-end">
                <h2 className="text-success">{formatAmount(expense.amount)}</h2>
                <p className="text-muted">
                  <i className="fas fa-calendar"></i> {formatDate(expense.expenseDate)}
                </p>
              </div>
            </div>
            
            {expense.createdAt && (
              <div className="mt-3 border-top pt-3">
                <small className="text-muted">
                  Created: {formatDate(expense.createdAt)}
                  {expense.updatedAt && expense.updatedAt !== expense.createdAt && (
                    <> | Updated: {formatDate(expense.updatedAt)}</>
                  )}
                </small>
              </div>
            )}
          </div>
          
          <div className="card-footer">
            <div className="d-flex gap-2">
              <Link to="/" className="btn btn-secondary">
                <i className="fas fa-arrow-left"></i> Back to Dashboard
              </Link>
              <Link to={`/edit/${expense.id}`} className="btn btn-primary">
                <i className="fas fa-edit"></i> Edit
              </Link>
              <button onClick={handleDelete} className="btn btn-danger ms-auto">
                <i className="fas fa-trash"></i> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseDetails;
