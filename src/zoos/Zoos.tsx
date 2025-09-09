import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Zoos.css';
import { Zoo } from '../models/zoo';
import { apiCall } from '../api/apiCall';
import ZooIdStore from '../api/storeZooId';

function Zoos() {
  const navigate = useNavigate();
  const [zoos, setZoos] = useState<Zoo[]>([]);
  const [isLoading,setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchZoos = async () => {
      const response = await apiCall('zoo','GET',null)
      const zoosApi = await response?.json()
      if(zoosApi != null){
        const zoosTransform = zoosApi as Zoo[];
        setZoos(zoosTransform)
      }
      setIsLoading(false)
    };

    fetchZoos();
  }, []);

  function handleClick(zooId : string){
    ZooIdStore.setZooId(zooId)
    navigate('/espaces');
  }

  if (isLoading) {
    return <p>Loading zoos...</p>;
  }

  return (
    <div className="zoos-container">
      {zoos.length === 0 ? (
        <p>No zoos available.</p>
      ) : (
        zoos.map((zoo) => (
          <div key={zoo._id} className="zoo-card" onClick={() => handleClick(zoo._id)}>
            <h3>{zoo.name}</h3>
            <p>Created: {new Date(zoo.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Zoos;
