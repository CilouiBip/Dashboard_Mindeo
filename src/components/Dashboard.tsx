import React, { useEffect, useState } from 'react';
import { fetchMarketingProblems } from '../api/airtable';
import { Problem } from '../types/airtable';

const Dashboard = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchMarketingProblems();
        setProblems(data);
      } catch (err) {
        setError('Failed to fetch marketing problems.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Marketing Problems Dashboard</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Priority</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem) => (
            <tr key={problem.Problem_ID}>
              <td>{problem.Problem_ID}</td>
              <td>{problem.Problem_Name}</td>
              <td>{problem.Description}</td>
              <td>{problem.Priority}</td>
              <td>{problem.Status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;