import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import generateToastContainer from '../utils/ToastContainer';
import './Billets.css';
import { apiCall } from '../api/apiCall';
import { Billet } from '../models/billet';

function Billets() {

  const [billets, setBillets] = useState<Billet[]>([]);

  useEffect(() => {
    async function fetchBillets(){
      const res = await apiCall(`ticket`, 'GET', null);
      if(res && res.ok){
        const data = await res.json();
        setBillets(data as Billet[]);
      }
    }

    fetchBillets();
  },[]);

  return (
    <div style={{ paddingTop: '70px' }}>
      <Navbar />
      <div className="billets-container">
        {billets.map((billet) => (
          <div key={billet._id} className="billet-card">
            <h3 className="billet-title">{billet.pass.name}</h3>
            <p className="billet-info">💰 Prix : {billet.pass.price} €</p>
            <p className="billet-info">📆 Date : {new Date(billet.date).toLocaleDateString()}</p>
            <p className="billet-info">🔁 Durée : {billet.pass.periodicity}</p>
          </div>
        ))}
        {billets.length === 0 && (
          <p style={{ textAlign: 'center', marginTop: '20px' }}>Aucun billet trouvé.</p>
        )}
      </div>
      {generateToastContainer()}
    </div>
  );
}

export default Billets;