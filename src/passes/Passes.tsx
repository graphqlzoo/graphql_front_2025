import { use, useEffect, useState } from 'react';
import './Passes.css';
import Navbar from '../components/Navbar/Navbar';
import { apiCall } from '../api/apiCall';
import storeZooId from '../api/storeZooId';
import { Pass } from '../models/pass';
import { useNavigate } from 'react-router-dom';

function Passes() {
  const navigate = useNavigate();
  const [passes, setPasses] = useState<Pass[]>([]);

  useEffect(() => {
    async function fetchData() {
      const res = await apiCall(`zoo/${storeZooId.getZooId()}/pass`, 'GET', null);
      if (res?.ok) {
        const data = await res.json();
        setPasses(data as Pass[]);
      }
    }

    fetchData();
  }, []);

  const handlePassClick = (pass: Pass) => {
    navigate(`/buy/${pass._id}`,{state: { pass } });
  };

  return (
    <div style={{ paddingTop: "70px" }}>
      <Navbar />

      <div className="passes-container">
        <h2 className="passes-title">Available Passes</h2>
        {passes.length === 0 ? (
          <p className="empty-message">No passes available.</p>
        ) : (
          passes.map((pass) => (
            <div
              key={pass._id}
              className="pass-card"
              onClick={() => handlePassClick(pass)}
            >
              <h3>{pass.name}</h3>
              <p>💰 <strong>{pass.price} €</strong></p>
              <p>📅 Periodicity: <em>{pass.periodicity}</em></p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Passes;
