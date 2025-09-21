import { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import generateToastContainer from "../utils/ToastContainer";
import { gql } from "graphql-request";
import { useQuery } from "@tanstack/react-query";
import { fetchGraphQL } from "../api/apiCall";
import "./SpectacleForm.css";

const GET_SPECTACLES = gql`
  query GetAllSpectacles {
    getAllSpectacles {
      id
      title
      description
      startTime
      endTime
    }
  }
`;

interface Spectacle {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
}

function Spectacle() {
  const [spectacles, setSpectacles] = useState<Spectacle[]>([]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["spectacles"],
    queryFn: async () => fetchGraphQL(GET_SPECTACLES, {}),
  });

  useEffect(() => {
    if (data?.getAllSpectacles) {
      setSpectacles(data.getAllSpectacles as Spectacle[]);
    }
  }, [data]);

  if (isLoading) return <div>Loading spectacles...</div>;
  if (isError) return <div>Error loading spectacles...</div>;

  return (
    <div style={{ paddingTop: "70px" }}>
      <Navbar />
      <div className="spectacle-container">
        <h2 className="spectacle-title"> Spectacles du jour</h2>
        <div className="spectacle-list">
          {spectacles.map((spectacle) => (
            <div key={spectacle.id} className="spectacle-card">
              <h3>{spectacle.title}</h3>
              <p>{spectacle.description}</p>
              <p>
                 {new Date(Number(spectacle.startTime)).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} 
                {" - "}
                {new Date(Number(spectacle.endTime)).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          ))}
          {spectacles.length === 0 && (
            <p style={{ textAlign: "center", marginTop: "20px" }}>
              Aucun spectacle prévu aujourd'hui.
            </p>
          )}
        </div>
      </div>
      {generateToastContainer()}
    </div>
  );
}

export default Spectacle;
