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
  query GetAnimalsBySpaceId($id: String!) {
    getAnimalsBySpaceId(input: { id: $id }) {
      id
      name
      bornOn
      description
      images
    }
  }
`;

const allAnimals = gql`
  query GetAllAnimals {
    getAllAnimals {
      id
      name
      bornOn
      description
      images
    }
  }
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
    queryFn: async() => await fetchGraphQL(body, {id}),
  });

  function handleClick(animal : Animal){
    navigate(`/animal/${animal.id}`)
  }
      
  if (isLoading) {
    return <p>Loading animals...</p>;
  }
  else if(isError){
    return <p>Error loading animals.</p>;
  }

  var animaux : Animal[] = [];
  if(id){
    animaux = data?.getAnimalsBySpaceId ?? [];
  }
  else{
    animaux = data?.getAllAnimals ?? [];
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
          <AnimalCell key={animal.id} animal={animal} onClick={() => handleClick(animal)} />
        ))
      )}
    </div>
  );
}

export default Animaux;