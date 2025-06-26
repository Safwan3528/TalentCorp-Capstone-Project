import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  isSameDay,
  isSameWeek,
  isSameMonth,
  subWeeks,
  subMonths,
  parseISO
} from 'date-fns';

const ExpenseAnalytics = ({ expenses }) => {
  // Color palette for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'];

  // Helper function to parse date strings
  const parseDate = (dateString) => {
    try {
      return parseISO(dateString.split('T')[0]);
    } catch {
      return new Date(dateString);
    }
  };

  // Daily spending trend (last 30 days)
  const dailySpendingData = useMemo(() => {
    const last30Days = eachDayOfInterval({
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: new Date()
    });

    return last30Days.map(day => {
      const dayExpenses = expenses.filter(expense => 
        isSameDay(parseDate(expense.expenseDate), day)
      );
      const total = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      return {
        date: format(day, 'MMM dd'),
        amount: total,
        count: dayExpenses.length
      };
    });
  }, [expenses]);

  // Weekly spending comparison (last 8 weeks)
  const weeklySpendingData = useMemo(() => {
    const last8Weeks = [];
    for (let i = 7; i >= 0; i--) {
      const weekStart = startOfWeek(subWeeks(new Date(), i));
      const weekEnd = endOfWeek(weekStart);
      last8Weeks.push({ start: weekStart, end: weekEnd });
    }

    return last8Weeks.map((week, index) => {
      const weekExpenses = expenses.filter(expense => {
        const expenseDate = parseDate(expense.expenseDate);
        return expenseDate >= week.start && expenseDate <= week.end;
      });
      const total = weekExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      return {
        week: `Week ${index + 1}`,
        period: `${format(week.start, 'MMM dd')} - ${format(week.end, 'MMM dd')}`,
        amount: total,
        count: weekExpenses.length
      };
    });
  }, [expenses]);

  // Monthly spending comparison (last 6 months)
  const monthlySpendingData = useMemo(() => {
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(new Date(), i));
      const monthEnd = endOfMonth(monthStart);
      last6Months.push({ start: monthStart, end: monthEnd });
    }

    return last6Months.map(month => {
      const monthExpenses = expenses.filter(expense => {
        const expenseDate = parseDate(expense.expenseDate);
        return expenseDate >= month.start && expenseDate <= month.end;
      });
      const total = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      return {
        month: format(month.start, 'MMM yyyy'),
        amount: total,
        count: monthExpenses.length
      };
    });
  }, [expenses]);

  // Category breakdown
  const categoryData = useMemo(() => {
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount,
      percentage: ((amount / expenses.reduce((sum, exp) => sum + exp.amount, 0)) * 100).toFixed(1)
    })).sort((a, b) => b.amount - a.amount);
  }, [expenses]);

  // Spending insights
  const insights = useMemo(() => {
    const currentWeekExpenses = expenses.filter(expense => 
      isSameWeek(parseDate(expense.expenseDate), new Date())
    );
    const lastWeekExpenses = expenses.filter(expense => 
      isSameWeek(parseDate(expense.expenseDate), subWeeks(new Date(), 1))
    );
    
    const currentMonthExpenses = expenses.filter(expense => 
      isSameMonth(parseDate(expense.expenseDate), new Date())
    );
    const lastMonthExpenses = expenses.filter(expense => 
      isSameMonth(parseDate(expense.expenseDate), subMonths(new Date(), 1))
    );

    const currentWeekTotal = currentWeekExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const lastWeekTotal = lastWeekExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const currentMonthTotal = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const lastMonthTotal = lastMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    const weeklyChange = lastWeekTotal > 0 ? ((currentWeekTotal - lastWeekTotal) / lastWeekTotal * 100) : 0;
    const monthlyChange = lastMonthTotal > 0 ? ((currentMonthTotal - lastMonthTotal) / lastMonthTotal * 100) : 0;

    return {
      currentWeekTotal,
      lastWeekTotal,
      weeklyChange,
      currentMonthTotal,
      lastMonthTotal,
      monthlyChange,
      topCategory: categoryData[0]?.category || 'None',
      topCategoryAmount: categoryData[0]?.amount || 0
    };
  }, [expenses, categoryData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow">
          <p className="font-semibold">{`${label}`}</p>
          <p className="text-blue-600">
            {`Amount: ${formatCurrency(payload[0].value)}`}
          </p>
          {payload[0].payload.count && (
            <p className="text-gray-600">
              {`Transactions: ${payload[0].payload.count}`}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  if (expenses.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <h5>No Data Available</h5>
          <p className="text-muted">Add some expenses to see analytics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      {/* Insights Cards */}
      <div className="col-12 mb-4">
        <div className="row">
          <div className="col-md-3 mb-3">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <h6 className="card-title">This Week</h6>
                <h4>{formatCurrency(insights.currentWeekTotal)}</h4>
                <small>
                  {insights.weeklyChange >= 0 ? '+' : ''}{insights.weeklyChange.toFixed(1)}% vs last week
                </small>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card bg-success text-white">
              <div className="card-body">
                <h6 className="card-title">This Month</h6>
                <h4>{formatCurrency(insights.currentMonthTotal)}</h4>
                <small>
                  {insights.monthlyChange >= 0 ? '+' : ''}{insights.monthlyChange.toFixed(1)}% vs last month
                </small>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card bg-warning text-white">
              <div className="card-body">
                <h6 className="card-title">Top Category</h6>
                <h5>{insights.topCategory}</h5>
                <small>{formatCurrency(insights.topCategoryAmount)}</small>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card bg-info text-white">
              <div className="card-body">
                <h6 className="card-title">Daily Average</h6>
                <h4>{formatCurrency(insights.currentMonthTotal / new Date().getDate())}</h4>
                <small>This month</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Trend Chart */}
      <div className="col-lg-8 mb-4">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">Daily Spending Trend (Last 30 Days)</h5>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailySpendingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ fill: '#8884d8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="col-lg-4 mb-4">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">Expense by Category</h5>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                  label={({ category, percentage }) => `${category} (${percentage}%)`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Weekly Comparison */}
      <div className="col-lg-6 mb-4">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">Weekly Spending Comparison</h5>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklySpendingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  labelFormatter={(label, payload) => {
                    const data = payload[0]?.payload;
                    return data ? data.period : label;
                  }}
                />
                <Bar dataKey="amount" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Monthly Comparison */}
      <div className="col-lg-6 mb-4">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">Monthly Spending Comparison</h5>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlySpendingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="amount" fill="#FFBB28" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">Category Breakdown</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Percentage</th>
                    <th>Visual</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryData.map((category, index) => (
                    <tr key={category.category}>
                      <td>
                        <span 
                          className="badge me-2" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        >
                          {category.category}
                        </span>
                      </td>
                      <td className="fw-bold">{formatCurrency(category.amount)}</td>
                      <td>{category.percentage}%</td>
                      <td>
                        <div className="progress" style={{ height: '8px' }}>
                          <div 
                            className="progress-bar" 
                            style={{ 
                              width: `${category.percentage}%`,
                              backgroundColor: COLORS[index % COLORS.length]
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseAnalytics;
