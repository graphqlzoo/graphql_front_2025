import { useEffect, useState } from "react";
import "./Espaces.css"
import { Habitat } from "../models/space";
import Navbar from "../components/Navbar/Navbar";
import { apiCall } from "../api/apiCall";
import storeZooId from "../api/storeZooId";
import { useNavigate } from "react-router-dom";
import EspaceCell from "./EspaceCell";

function Espaces(){
  const navigate = useNavigate()
  const [spaces,setSpaces] = useState<Habitat[]>([])
  const [isLoading,setIsLoading] = useState<boolean>(true)

  useEffect(() => {
      const fetchSpaces = async () => {
        const response = await apiCall(`zoo/${storeZooId.getZooId()}/space`,'GET',null)
        const spacesApi = await response?.json()
        if(spacesApi != null){
          const spacesTransform = spacesApi as Habitat[];
          setSpaces(spacesTransform)
        }
        setIsLoading(false)
      };
  
      fetchSpaces();
    }, []);

  if (isLoading) {
    return <p>Loading zoos...</p>;
  }

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