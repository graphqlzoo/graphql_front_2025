import { useParams, useLocation, useNavigate } from "react-router-dom";
import './Buy.css';
import { toast } from "react-toastify";
import { apiCall } from "../api/apiCall";
import generateToastContainer from "../utils/ToastContainer";
import { Billet } from "../models/billet";

function Buy() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const pass = location.state?.pass as Billet | undefined;

  async function postBillet() {
    const res = await apiCall({
      pass : id,
      date : '2025-07-23'
    });
    toast.success("Billet acheté avec succès !");
    navigate('/billets')
  }

  if (!pass) {
    return <p style={{ paddingTop: '70px', textAlign: 'center' }}>Aucun pass trouvé.</p>;
  }

  return (
    <div className="buy-container">
      <div className="pass-card">
        <h2 className="pass-title">{pass.nameOfBillet}</h2>
        <p className="pass-price">💸 Prix : <strong>{pass.price} €</strong></p>
        <p className="pass-period">📅 Valid until : <em>{pass.endOfValidityDate}</em></p>
        <button className="buy-button" onClick={()=>postBillet()}>Acheter</button>
      </div>
      {generateToastContainer()}
    </div>
  );
}

export default Buy;
