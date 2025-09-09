import { useEffect, useState } from 'react'
import './Animaux.css'
import { Animal } from '../models/animal'
import Navbar from '../components/Navbar/Navbar';
import { apiCall } from '../api/apiCall';
import storeZooId from '../api/storeZooId';
import AnimalCell from './AnimalCell';
import { useNavigate, useParams } from 'react-router-dom';

interface AnimauxProps {
  showNavbar?: boolean;
  apiEndpoint?: string;
}

function Animaux({showNavbar = true,apiEndpoint = `zoo/${storeZooId.getZooId()}/animal`}: AnimauxProps) {
  const navigate = useNavigate();
  const [animaux,setAnimaux] = useState<Animal[]>([])
  const [isLoading,setIsLoading] = useState<boolean>(true)

  const { id } = useParams<{ id: string }>();
  var endpoint = apiEndpoint;
  console.log("ID from params:", id);
  if(id){
    endpoint =`zoo/${storeZooId.getZooId()}/animal?space_id=${id}`;
  }
  useEffect(() => {
        const fetchAnimals = async () => {
          const response = await apiCall(endpoint,'GET',null)
          const animalsApi = await response?.json()
          if(animalsApi != null){
            const animalsTransform = animalsApi as Animal[];
            setAnimaux(animalsTransform)
          }
          setIsLoading(false)
        };
    
        fetchAnimals();
      }, []);

  function handleClick(animal : Animal){
    navigate(`/animal/${animal._id}`,{ state: { animal } })
  }
      
  if (isLoading) {
    return <p>Loading zoos...</p>;
  }

  return (
    <div
      style={{
        paddingTop: "70px",
        backgroundImage: "url('/assets/jungle.jpeg')", // ensure image is inside public/assets/
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      {showNavbar && <Navbar />}
      {animaux.length === 0 ? (
        <p className="text-gray-500 text-center mt-4">No animal available.</p>
      ) : (
        animaux.map((animal) => (
          <AnimalCell key={animal._id} animal={animal} onClick={() => handleClick(animal)} />
        ))
      )}
    </div>
  );
}

export default Animaux;