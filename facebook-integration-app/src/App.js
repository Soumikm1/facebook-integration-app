import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import FacebookLoginComponent from './components/FacebookLogin';
import PageStats from './components/PageStats';

function App() {
  const [user, setUser] = useState(null);
  const [pages, setPages] = useState([]);
  const [selectedPageId, setSelectedPageId] = useState('');
  const [since, setSince] = useState('');
  const [until, setUntil] = useState('');

  const handleLogin = (response) => {
    setUser(response);
  };

  useEffect(() => {
    if (user) {
      axios.get(`https://graph.facebook.com/v12.0/me/accounts?access_token=${user.accessToken}`)
        .then(response => setPages(response.data.data))
        .catch(error => console.error('Error fetching pages:', error));
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
            <img src={user.picture.data.url} alt="Profile" />
            <p>Welcome, {user.name}!</p>
            
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