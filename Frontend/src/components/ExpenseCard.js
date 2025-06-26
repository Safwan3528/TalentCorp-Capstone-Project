import React from 'react';
import { Link } from 'react-router-dom';

const ExpenseCard = ({ expense, onDelete }) => {
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

  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title mb-1">{expense.title}</h5>
          <span className="badge bg-primary">{expense.category}</span>
        </div>
        
        {expense.description && (
          <p className="card-text text-muted small mb-2">{expense.description}</p>
        )}
        
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="text-success mb-0">{formatAmount(expense.amount)}</h6>
            <small className="text-muted">{formatDate(expense.expenseDate)}</small>
          </div>
          
          <div className="btn-group" role="group">
            <Link to={`/expense/${expense.id}`} className="btn btn-outline-secondary btn-sm">
              View
            </Link>
            <Link to={`/edit/${expense.id}`} className="btn btn-outline-primary btn-sm">
              Edit
            </Link>
            <button 
              onClick={() => onDelete(expense.id)} 
              className="btn btn-outline-danger btn-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;