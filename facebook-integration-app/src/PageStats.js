// NOT USED IN THE PROJECT
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PageStats = ({ pageId, accessToken, since, until }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(
          `https://graph.facebook.com/v12.0/${pageId}/insights`,
          {
            params: {
              metric: 'page_fans,page_engaged_users,page_impressions,page_reactions_total',
              access_token: accessToken,
              period: 'total_over_range',
              since,
              until,
            },
          }
        );
        setStats(response.data.data);
      } catch (error) {
        console.error('Error fetching page stats:', error);
      }
    };

    if (pageId) fetchStats();
  }, [pageId, accessToken, since, until]);

  if (!stats) return <div>Loading...</div>;

  return (
    <div>
      {stats.map(stat => (
        <div key={stat.name}>
          <h3>{stat.title}</h3>
          <p>{stat.values[0].value}</p>
        </div>
      ))}
    </div>
  );
};

export default PageStats;