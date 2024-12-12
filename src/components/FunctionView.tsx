import React from 'react';
import { useParams } from 'react-router-dom';
import { useScoreStore } from '../store/scoreStore';
import { AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BusinessFunction } from '../types/airtable';

function FunctionView() {
  const { name } = useParams<{ name: string }>();
  const { functionScores, problems, kpis } = useScoreStore();
  
  const functionName = name?.charAt(0).toUpperCase() + name?.slice(1) as BusinessFunction;
  const score = functionScores[functionName] || 0;
  
  const functionProblems = problems.filter(p => p.Function === functionName);
  const functionKPIs = kpis.filter(kpi => 
    functionProblems.some(p => p.Main_KPIs?.includes(kpi.ID_KPI))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <Link to="/" className="text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-3xl font-bold">{functionName} Overview</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Health Score</h2>
          {score >= 70 ? (
            <CheckCircle className="h-8 w-8 text-green-500" />
          ) : (
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          )}
        </div>
        <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`absolute h-full transition-all duration-500 ${
              score >= 70 ? 'bg-green-500' : score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${score}%` }}
          ></div>
        </div>
        <div className="mt-2 text-right font-semibold">{score.toFixed(1)}%</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Key Problems</h2>
          <div className="space-y-4">
            {functionProblems.map((problem) => (
              <div key={problem.Problem_ID} className="border-l-4 border-red-500 pl-4">
                <h3 className="font-medium">{problem.Problem_Name}</h3>
                <p className="text-gray-600 text-sm mt-1">{problem.Description}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    problem.Priority === 'High' ? 'bg-red-100 text-red-800' :
                    problem.Priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {problem.Priority}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    problem.Status === 'To Review' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {problem.Status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">KPIs</h2>
          <div className="space-y-4">
            {functionKPIs.map((kpi) => (
              <div key={kpi.ID_KPI} className="border-b border-gray-200 last:border-0 pb-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{kpi.NOM_KPI}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    kpi.Statut_Global === 'OK' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {kpi.Statut_Global}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-1">{kpi.Description}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span>Min: {kpi.Min}</span>
                  <span>Max: {kpi.Max}</span>
                  <span>Weight: {kpi.Ponderation}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FunctionView;