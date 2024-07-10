import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FacebookLogin from 'react-facebook-login';
import './App.css';

// FacebookLogin Component
const FacebookLoginComponent = ({ onLogin }) => {
  const responseFacebook = (response) => {
    console.log('Raw Facebook response:', response);
    if (response.status === 'connected') {
      console.log('Login successful');
      onLogin(response.authResponse);
    } else if (response.status === 'not_authorized') {
      console.log('User is logged into Facebook but has not authorized your app');
    } else {
      console.log('User is not logged into Facebook');
    }
  };

  return (
    <FacebookLogin
      appId="1245457853103372"
      autoLoad={false}
      fields="name,email,picture"
      callback={responseFacebook}
      onFailure={(error) => console.log('Facebook login failed:', error)}
    />
  );
};
// PageStats Component
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

// Main App Component
function App() {
  const [user, setUser] = useState(null);
  const [pages, setPages] = useState([]);
  const [selectedPageId, setSelectedPageId] = useState('');
  const [since, setSince] = useState('');
  const [until, setUntil] = useState('');

  const handleLogin = (response) => {
    if (response.accessToken) {
      setUser(response);
    } else {
      console.error('Login failed:', response);
    }
  };

  useEffect(() => {
    if (user && user.accessToken) {
      axios.get(`https://graph.facebook.com/v12.0/me/accounts?access_token=${user.accessToken}`)
        .then(response => {
          console.log('Pages response:', response.data);
          setPages(response.data.data);
        })
        .catch(error => {
          console.error('Error fetching pages:', error.response ? error.response.data : error.message);
        });
    }
  }, [user]);

  const handlePageSelect = (pageId) => {
    setSelectedPageId(pageId);
  };

  return (
    <div className="App">
      <header className="App-header">
        {!user ? (
          <FacebookLoginComponent onLogin={handleLogin} />
        ) : (
          <div>
            {user.picture && user.picture.data && (
              <img src={user.picture.data.url} alt="Profile" />
            )}
            <p>Welcome, {user.name || 'User'}!</p>

            <select onChange={(e) => handlePageSelect(e.target.value)}>
              <option value="">Select a page</option>
              {pages.map(page => (
                <option key={page.id} value={page.id}>{page.name}</option>
              ))}
            </select>

            {selectedPageId && (
              <>
                <div>
                  <label>Since: </label>
                  <input type="date" onChange={(e) => setSince(e.target.value)} />
                </div>
                <div>
                  <label>Until: </label>
                  <input type="date" onChange={(e) => setUntil(e.target.value)} />
                </div>
                <PageStats
                  pageId={selectedPageId}
                  accessToken={user.accessToken}
                  since={since}
                  until={until}
                />
              </>
            )}
          </div>
        )}
      </header>
    </div>
  );
}


export default App;