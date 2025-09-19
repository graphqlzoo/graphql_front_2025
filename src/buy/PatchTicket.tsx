import { useNavigate, useParams } from "react-router-dom";
import './PatchTicket.css';
import generateToastContainer from "../utils/ToastContainer";
import { Billet } from "../models/billet";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { fetchGraphQL } from "../api/apiCall";
import { gql } from "graphql-request";

const getBillet = gql`
  query getBilletById($input: InputIdType!) {
    getBilletById(input: $input){
      id
      endOfValidityDate
      price
      lastNameOfBeneficiary
      firstNameOfBeneficiary
      type
    }
  }
`;


const patchBilletRequest = gql`
  mutation patchBillet($input: CreateBilletInput!) {
    patchBillet(input: $input) {
      id
      firstNameOfBeneficiary
      lastNameOfBeneficiary
      type
      price
      endOfValidityDate
    }
  }
`;

function PatchTicket() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const  {data, isLoading, isError} = useQuery({
    queryKey: ['billet', id],
    queryFn: async()=>fetchGraphQL(getBillet,{ input: { id : id } }),
    enabled: !!id
  })

  const [firstNameOfBeneficiary, setFirstNameOfBeneficiary] = useState<string>('');
  const [lastNameOfBeneficiary, setLastNameOfBeneficiary] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [validityDate, setValidityDate] = useState<string>('');
  const [price, setPrice] = useState<number | null>(null);
  const [initialPrice,setInitialPrice] = useState<number | null>(null);

  useEffect(() => {
  if (data?.getBilletById) {
    const billet = data.getBilletById as Billet;
    setFirstNameOfBeneficiary(billet.firstNameOfBeneficiary);
    setLastNameOfBeneficiary(billet.lastNameOfBeneficiary);
    setType(billet.type);
    setValidityDate(new Date(Number(billet.endOfValidityDate)).toLocaleDateString("fr-FR"));
    setPrice(billet.price);
    setInitialPrice(billet.price);
  }
}, [data]);

  const buildBilletInput = () => {
    return {
      id,
      firstNameOfBeneficiary,
      lastNameOfBeneficiary,
      type,
      price,
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
      const response = await fetchGraphQL(patchBilletRequest, { input });
      toast.success(`Ticket for ${response.patchBillet.lastNameOfBeneficiary} updated!`);
      navigate("/billets");
    }
    catch(error){
      toast.error("Error updating ticket");
      console.error("Error updating billet:", error);
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

  if(isLoading){
    return <div>Loading...</div>
  }
  else if(isError){
    return <div>Error...</div>
  }

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
          <p>Valid until the {validityDate} cant be changed !</p>
          <p>Price: {price ?? "No price set for now"} €, you will only pay the diff -{" "}
          {Math.max((price ?? 0) - (initialPrice ?? 0), 0)} €</p>
        </div>
        <input type="submit" value="Change ticket"/>
      </form>
      {generateToastContainer()}
    </div>    
  )
}

export default PatchTicket;
