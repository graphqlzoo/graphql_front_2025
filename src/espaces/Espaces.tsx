import "./Espaces.css"
import { Habitat } from "../models/space";
import Navbar from "../components/Navbar/Navbar";
import { fetchGraphQL } from "../api/apiCall";
import EspaceCell from "./EspaceCell";
import { gql } from "graphql-request";
import { useQuery } from "@tanstack/react-query";

const requestAllSpaces = gql`
  query {
    getAllSpaces{
      id
      disabled
      name
      description
      openingHours
      closingHours
      types
    }
  }
`;

function Espaces(){
  const {data,isLoading,isError} = useQuery({
    queryKey: ["fetchAllSpaces"],
    queryFn: async() => await fetchGraphQL(requestAllSpaces, {}),
  });

  if (isLoading) {
    return <p>Loading zoos...</p>;
  }
  else if(isError){
    return <p>Error loading zoos.</p>;
  }

  const spaces: Habitat[] = data?.getAllSpaces ?? [];

  return (
    <div style={{ paddingTop: "70px" }}>
      <Navbar />
      {spaces.length === 0 ? (
        <p className="text-gray-500 text-center mt-4">No spaces available.</p>
      ) : (
        spaces.map((habitat) => (
          <EspaceCell key={habitat._id} habitat={habitat}/>
        ))
      )}
    </div>
  );
}

export default Espaces;