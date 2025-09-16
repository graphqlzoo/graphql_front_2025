import './Animaux.css'
import { Animal } from '../models/animal'
import Navbar from '../components/Navbar/Navbar';
import { fetchGraphQL } from '../api/apiCall';
import AnimalCell from './AnimalCell';
import { useNavigate, useParams } from 'react-router-dom';
import { gql } from 'graphql-request';
import { useQuery } from '@tanstack/react-query';

interface AnimauxProps {
  showNavbar?: boolean;
}

const animalFromSpace = gql`
`;

const allAnimals = gql`
`;

function Animaux({showNavbar = true}: AnimauxProps) {
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>() ?? "";
  var body = allAnimals;
  if(id){
    body = animalFromSpace;
  }

  const {data,isLoading,isError} = useQuery({
    queryKey: ["fetchAllAnimals"+id],
    queryFn: async() => await fetchGraphQL(body, {}),
  });

  function handleClick(animal : Animal){
    navigate(`/animal/${animal._id}`,{ state: { animal } })
  }
      
  if (isLoading) {
    return <p>Loading zoos...</p>;
  }
  else if(isError){
    return <p>Error loading zoos.</p>;
  }

  const animaux: Animal[] = data?.getAllAnimals ?? [];

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