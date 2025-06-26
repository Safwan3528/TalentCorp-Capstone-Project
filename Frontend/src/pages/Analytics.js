import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import ExpenseAnalytics from '../components/ExpenseAnalytics';

const Analytics = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeFilter, setTimeFilter] = useState('all'); // all, 30days, 90days, year

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/expenses');
      setExpenses(response.data);
    } catch (err) {
      console.error('Fetch expenses error:', err);
      setError('Failed to fetch expenses data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Filter expenses based on time period
  const filteredExpenses = React.useMemo(() => {
    if (timeFilter === 'all') return expenses;
    
    const now = new Date();
    const daysAgo = timeFilter === '30days' ? 30 : timeFilter === '90days' ? 90 : 365;
    const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.expenseDate);
      return expenseDate >= cutoffDate;
    });
  }, [expenses, timeFilter]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading analytics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <h5>Error Loading Analytics</h5>
        <p>{error}</p>
        <button className="btn btn-outline-danger" onClick={fetchExpenses}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Expense Analytics</h2>
          <p className="text-muted">
            Analyze your spending patterns and track your financial habits
          </p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/" className="btn btn-outline-secondary">
            <i className="bi bi-arrow-left"></i> Back to Dashboard
          </Link>
          <Link to="/add" className="btn btn-primary">
            <i className="bi bi-plus-circle"></i> Add Expense
          </Link>
        </div>
      </div>

      {/* Time Filter */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h6 className="mb-0">Time Period</h6>
              <small className="text-muted">Select the time range for analysis</small>
            </div>
            <div className="col-md-6">
              <div className="btn-group w-100" role="group">
                <input 
                  type="radio" 
                  className="btn-check" 
                  name="timeFilter" 
                  id="filter-all" 
                  value="all"
                  checked={timeFilter === 'all'}
                  onChange={(e) => setTimeFilter(e.target.value)}
                />
                <label className="btn btn-outline-primary" htmlFor="filter-all">All Time</label>

                <input 
                  type="radio" 
                  className="btn-check" 
                  name="timeFilter" 
                  id="filter-30" 
                  value="30days"
                  checked={timeFilter === '30days'}
                  onChange={(e) => setTimeFilter(e.target.value)}
                />
                <label className="btn btn-outline-primary" htmlFor="filter-30">Last 30 Days</label>

                <input 
                  type="radio" 
                  className="btn-check" 
                  name="timeFilter" 
                  id="filter-90" 
                  value="90days"
                  checked={timeFilter === '90days'}
                  onChange={(e) => setTimeFilter(e.target.value)}
                />
                <label className="btn btn-outline-primary" htmlFor="filter-90">Last 3 Months</label>

                <input 
                  type="radio" 
                  className="btn-check" 
                  name="timeFilter" 
                  id="filter-year" 
                  value="year"
                  checked={timeFilter === 'year'}
                  onChange={(e) => setTimeFilter(e.target.value)}
                />
                <label className="btn btn-outline-primary" htmlFor="filter-year">Last Year</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Component */}
      {filteredExpenses.length > 0 ? (
        <ExpenseAnalytics expenses={filteredExpenses} />
      ) : (
        <div className="card">
          <div className="card-body text-center py-5">
            <div className="mb-3">
              <i className="bi bi-graph-up" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
            </div>
            <h5>No Expense Data Available</h5>
            <p className="text-muted mb-4">
              {timeFilter === 'all' 
                ? "Start tracking your expenses to see detailed analytics and insights."
                : `No expenses found for the selected time period (${timeFilter}).`
              }
            </p>
            <Link to="/add" className="btn btn-primary">
              <i className="bi bi-plus-circle"></i> Add Your First Expense
            </Link>
          </div>
        </div>
      )}

      {/* Tips Section */}
      {filteredExpenses.length > 0 && (
        <div className="row mt-4">
          <div className="col-md-6">
            <div className="card border-info">
              <div className="card-header bg-info text-white">
                <h6 className="mb-0">💡 Spending Insights</h6>
              </div>
              <div className="card-body">
                <ul className="list-unstyled mb-0">
                  <li className="mb-2">
                    <i className="bi bi-check-circle text-success me-2"></i>
                    Track daily spending to identify patterns
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle text-success me-2"></i>
                    Compare weekly/monthly trends to control expenses
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle text-success me-2"></i>
                    Monitor category breakdown to optimize spending
                  </li>
                  <li>
                    <i className="bi bi-check-circle text-success me-2"></i>
                    Set weekly/monthly spending goals
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card border-warning">
              <div className="card-header bg-warning text-dark">
                <h6 className="mb-0">📊 Analytics Features</h6>
              </div>
              <div className="card-body">
                <ul className="list-unstyled mb-0">
                  <li className="mb-2">
                    <i className="bi bi-graph-up text-primary me-2"></i>
                    Daily spending trend visualization
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-bar-chart text-primary me-2"></i>
                    Weekly and monthly comparisons
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-pie-chart text-primary me-2"></i>
                    Category breakdown analysis
                  </li>
                  <li>
                    <i className="bi bi-calculator text-primary me-2"></i>
                    Automatic spending insights
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
