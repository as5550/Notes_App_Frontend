import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MetricsDashboard = (props) => {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await axios.get('http://localhost:5000/metrics');
        setMetrics(res.data);
      } catch (err) {
        console.error('Failed to fetch metrics:', err);
      }
    };

    fetchMetrics();

    // const interval = setInterval(fetchMetrics, 5000);
    // return () => clearInterval(interval);
  }, [props.req]);

  return (
    <div>
      <h2>Server Metrics</h2>
      {metrics ? (
        <div>
          <p><strong>Total Requests:</strong> {metrics.totalRequests}</p>
          <h3>Route Hits</h3>
          <ul>
            {Object.entries(metrics.routeHits).map(([route, count]) => (
              <li key={route}>
                <strong>{route}</strong>: {count}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading metrics...</p>
      )}
    </div>
  );
};

export default MetricsDashboard;
