import { useEffect, useState } from 'react';
import { Animal } from '../models/animal';
import './AnimalCell.css';
import { apiCall } from '../api/apiCall';
import defaultImage from '../assets/default-animal.jpeg';

type AnimalCellProps = {
  animal: Animal;
  onClick: () => void;
};

function AnimalCell({ animal, onClick }: AnimalCellProps) {
  const bornOnDate = new Date(animal.bornOn);
  const bornOnFormatted = bornOnDate.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;

    async function fetchImage() {
      if (!animal.images.length) return;

      try {
        const res = await apiCall(`asset/${animal.images[0]}`, 'GET', null);
        if (!res || !res.ok) throw new Error();

        const blob = await res.blob();
        objectUrl = URL.createObjectURL(blob);
        setImageUrl(objectUrl);
      } catch (err) {
        console.warn('Using fallback image due to load error');
        setImageUrl(null); // will fallback to default image
      }
    }

    fetchImage();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [animal.images]);

  return (
    <div className="animal-cell" onClick={onClick}>
      <img
        src={imageUrl || defaultImage}
        alt={animal.name}
        className="animal-thumbnail"
      />
      <div className="animal-info">
        <h3 className="animal-name">{animal.name}</h3>
        <p className="animal-description">{animal.description}</p>
        <p className="animal-date">🐾 Née le : {bornOnFormatted}</p>
      </div>
    </div>
  );
}

export default AnimalCell;
