import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import generateToastContainer from '../utils/ToastContainer';
import './Billets.css';
import { fetchGraphQL } from '../api/apiCall';
import { Billet } from '../models/billet';
import { useNavigate } from 'react-router-dom';
import { gql } from 'graphql-request';
import { useQuery } from '@tanstack/react-query';

const getBillet = gql`
  query getAllBillets {
    getAllBillets {
      id
      endOfValidityDate
      price
      lastNameOfBeneficiary
    }
  }
`;

function Billets() {
  const navigate = useNavigate();
  const [billets, setBillets] = useState<Billet[]>([]);

  const  {data, isLoading, isError} = useQuery({
    queryKey: ['billets'],
    queryFn: async()=>fetchGraphQL(getBillet,{}),
  })


  async function deleteBillet(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to refund/delete this billet?"
    );

    if (!confirmed) return;

    const mutation = gql`
      mutation deletBillet {
        deleteBillet(input: { id: "${id}" }) {
          id
        }
      }
    `;

    try {
      await fetchGraphQL(mutation, {});
      setBillets((prev) => prev.filter((b) => b.id !== id));

      alert("Billet successfully refunded/deleted!");
    } catch (error) {
      console.error(error);
      alert("Failed to delete billet. Please try again.");
    }
  }

  useEffect(() => {
    if (data) {
      setBillets(data.getAllBillets as Billet[]);
    }
  }, [data]);

  const handleCardClick = (billet: Billet)=>{
    navigate(`/billets/patch/${billet.id}`);
  }

  if(isLoading){
    return <div>Loading...</div>
  }
  else if(isError){
    return <div>Error...</div>
  }

  return (
    <div style={{ paddingTop: '70px' }}>
      <Navbar />
      <div className="billets-container">
        {billets.map((billet) => (
          <div key={billet.id} className="billet-card" onClick={() => handleCardClick(billet)}>
            <h3 className="billet-title">{billet.lastNameOfBeneficiary}</h3>
            <p className="billet-info">💰 Prix : {billet.price} €</p>
            <p className="billet-info">📆 Valid until : {new Date(Number(billet.endOfValidityDate)).toLocaleDateString("fr-FR")}</p>
            <button
  className="delete-button"
  onClick={(e) => {
    e.stopPropagation();
    deleteBillet(billet.id);
  }}
>Get a refund </button>
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