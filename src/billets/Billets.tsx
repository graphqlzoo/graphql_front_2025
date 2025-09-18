import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import generateToastContainer from '../utils/ToastContainer';
import './Billets.css';
import { apiCall } from '../api/apiCall';
import { Billet } from '../models/billet';
import { useNavigate } from 'react-router-dom';

function Billets() {
  const navigate = useNavigate();
  const [billets, setBillets] = useState<Billet[]>([]);

  useEffect(() => {
    async function fetchBillets(){
      const res = await apiCall(null);
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
          <div key={billet.id} className="billet-card">
            <h3 className="billet-title">{billet.lastNameOfBeneficiary}</h3>
            <p className="billet-info">💰 Prix : {billet.price} €</p>
            <p className="billet-info">📆 Date : {new Date(billet.endOfValidityDate).toLocaleDateString()}</p>
            <p className="billet-info">🔁 Durée : {billet.createdAt}</p>
          </div>
        ))}
        {billets.length === 0 && (
          <p style={{ textAlign: 'center', marginTop: '20px' }}>Aucun billet trouvé.</p>
        )}
      </div>
      <button className="buy-button" onClick={() => navigate('/buy')}>
        Buy a ticket
      </button>
      {generateToastContainer()}
    </div>
  );
}

export default Billets;