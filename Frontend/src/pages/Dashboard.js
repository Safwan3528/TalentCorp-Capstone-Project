import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import ExpenseCard from '../components/ExpenseCard';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    try {
      const response = await api.get('/expenses');
      setExpenses(response.data);
    } catch (err) {
      console.error('Fetch expenses error:', err);
      setError('Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this expense?');
    if (!confirm) return;

    try {
      await api.delete(`/expenses/${id}`);
      setExpenses(expenses.filter(exp => exp.id !== id));
    } catch (err) {
      console.error('Delete expense error:', err);
      alert('Failed to delete expense');
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Calculate summary
  const totalAmount = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
  const totalExpenses = expenses.length;
  const categories = [...new Set(expenses.map(expense => expense.category))].filter(Boolean);

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Expenses</h2>
        <div className="d-flex gap-2">
          <Link to="/analytics" className="btn btn-outline-info">
            <i className="bi bi-graph-up"></i> Analytics
          </Link>
          <Link to="/add" className="btn btn-primary">
            <i className="bi bi-plus-circle"></i> Add New Expense
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5 className="card-title">Total Expenses</h5>
              <h3>{totalExpenses}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">Total Amount</h5>
              <h3>{formatAmount(totalAmount)}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h5 className="card-title">Categories</h5>
              <h3>{categories.length}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Expenses List */}
      {expenses.length === 0 ? (
        <div className="text-center mt-5">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">No expenses found</h5>
              <p className="card-text">Start tracking your expenses by adding your first expense.</p>
              <Link to="/add" className="btn btn-primary">
                Add Your First Expense
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h4 className="mb-3">Recent Expenses</h4>
          {expenses
            .sort((a, b) => new Date(b.expenseDate || b.createdAt) - new Date(a.expenseDate || a.createdAt))
            .map(expense => (
              <ExpenseCard key={expense.id} expense={expense} onDelete={deleteExpense} />
            ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
