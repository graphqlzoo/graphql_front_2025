import { useNavigate } from "react-router-dom";
import './Buy.css';
import generateToastContainer from "../utils/ToastContainer";
import { Billet } from "../models/billet";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { fetchGraphQL } from "../api/apiCall";
import { gql } from "graphql-request";


const createBilletRequest = gql`
  mutation CreateBillet($input: CreateBilletInput!) {
    createBillet(input: $input) {
      id
      firstNameOfBeneficiary
      lastNameOfBeneficiary
      type
      price
      endOfValidityDate
    }
  }
`;

function Buy() {
  const navigate = useNavigate();

  const getNextMonthDate = (): Date => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1); // adds 1 month
    return date;
  };

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // month is 0-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const [firstNameOfBeneficiary, setFirstNameOfBeneficiary] = useState<string>('')
  const [lastNameOfBeneficiary, setLastNameOfBeneficiary] = useState<string>('')
  const [type,setType] = useState<string>('')
  const [validityDate, setValidityDate] = useState<Date>(getNextMonthDate());
  const [price, setPrice] = useState<number | null>(null);

  const buildBilletInput = () => {
    return {
      firstNameOfBeneficiary,
      lastNameOfBeneficiary,
      type,
      price,
      endOfValidityDate: validityDate.toISOString().split('T')[0] // "YYYY-MM-DD"
    };
  };
  
  const handleInputChange = (state : React.Dispatch<React.SetStateAction<string>>) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      state(e.target.value);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!firstNameOfBeneficiary || !lastNameOfBeneficiary || !type) {
      toast.error("First name, last name and type are required");
      return;
    }
    try{
      const input = buildBilletInput(); 
      const response = await fetchGraphQL(createBilletRequest, { input });
      toast.success(`Ticket for ${response.createBillet.lastNameOfBeneficiary} created!`);
      navigate("/billets");
    }
    catch(error){
      toast.error("Error creating ticket");
      console.error("Error creating billet:", error);
    }
  }

  useEffect(() => {
    switch (type) {
      case 'VIP':
        setPrice(200);
        break;
      case 'STANDARD':
        setPrice(100);
        break;
      case 'ECONOMY':
        setPrice(50);
        break;
      default:
        setPrice(null);
        break;
    }
  }, [type]);

  return (
    <div>
      <h2 className='title'>Specify ticket</h2>
      <form 
        onSubmit={handleSubmit}    
      >
        <div>
          <input type="text" name="firstName" placeholder="First name of beneficiary" value={firstNameOfBeneficiary}
            onChange={handleInputChange(setFirstNameOfBeneficiary)} //generate a function from a function (result = (e)=>setLogin(e.target.value))
          />
        </div>
        <div>
          <input type="text" name="lastName" placeholder="Last name of beneficiary" value={lastNameOfBeneficiary}
            onChange={handleInputChange(setLastNameOfBeneficiary)} //generate a function from a function (result = (e)=>setLogin(e.target.value))
          />
        </div>
        <div className="form-group">
          <label htmlFor="ticket_type">Type of ticket:</label>
          <select
            id="ticket_type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="ticket-select"
          >
            <option value="">-- Select a type --</option>
            <option value="VIP">VIP</option>
            <option value="STANDARD">STANDARD</option>
            <option value="ECONOMY">ECONOMY</option>
          </select>
        </div>
        <div>
          <p>Valid until the {formatDate(validityDate)}</p>
          <p>Price : {price ?? "No price set for now"} €</p>
        </div>
        <input type="submit" value="Buy ticket"/>
      </form>
      {generateToastContainer()}
    </div>    
  )
}

export default Buy;
