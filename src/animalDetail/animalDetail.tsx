import { useParams } from "react-router-dom";
import { Animal } from "../models/animal";
import AnimalCell from "../animaux/AnimalCell";
import { Species } from "../models/species";
import { useEffect, useState } from "react";
import { fetchGraphQL } from "../api/apiCall";
import './AnimalDetail.css'; // ← create this CSS file
import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { Habitat } from "../models/space";

type propsSpecies = {
  species: Species;
  spaces : Habitat;
};

type propsImages = {
  imagesUrlApi: string[];
};

const getDetailAnimal = gql`
  query GetAnimalById($id: String!) {
    getAnimalById(input: { id: $id }) {
      id
      name
      bornOn
      description
      images
      species{
        name
        description
      }
      space{
        types
      }   
    }
  }
`;

function AnimalDetail() {
  const { id } = useParams<{ id: string }>();

  const {data,isLoading,isError} = useQuery({
    queryKey: ["fetchAnimal"+id],
    queryFn: async() => await fetchGraphQL(getDetailAnimal, {id}),
  });

  if(isLoading){
    return <p>Loading animal details...</p>;
  }
  else if(isError){
    return <p>Error loading animal details.</p>;
  }

  const animal : Animal = data?.getAnimalById as Animal;

  return (
    <div className="animal-detail-container">
      <h1 className="detail-title">🦁 Détail de l’animal</h1>

      <div className="animal-detail-content">
        {animal && (
          <>
            <AnimalCell key={animal.id} animal={animal} onClick={() => {}} />
            <SpeciesDetail species={animal.species} spaces={animal.space} />
            {animal.images && animal.images.length > 0 && (
              <>
                <h3 className="carousel-title">📸 Galerie</h3>
                <ImageCarousel imagesUrlApi={animal.images} />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AnimalDetail;

function SpeciesDetail({ species,spaces }: propsSpecies) {
  return (
    <div className="species-card">
      <h2 className="species-name">{species.name}</h2>
      <p className="species-description">{species.description}</p>
      <p className="species-status">
        🛡️ Statut de conservation : <strong>"En danger"</strong>
      </p>
      <p className="species-habitat">
        🌍 Habitat naturel : <em>{spaces.types[0]}</em>
      </p>
    </div>
  );
}

function ImageCarousel({ imagesUrlApi }: propsImages) {
  const [loading, setLoading] = useState(true);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchImages() {
      setLoading(true);
      try {
        const fetchPromises = imagesUrlApi.map(async (imageUrl) => {
          const res = await fetch(imageUrl);
          if (!res || !res.ok) throw new Error(`Failed to fetch image ${imageUrl}`);
          const blob = await res.blob();
          return URL.createObjectURL(blob);
        });

        const urls = await Promise.all(fetchPromises);
        if (isMounted) setImageUrls(urls);
      } catch (error) {
        console.error("Image fetch failed:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchImages();
    return () => {
      isMounted = false;
      imageUrls.forEach((url) => URL.revokeObjectURL(url));
      setImageUrls([]);
    };
  }, []);

  useEffect(() => {
    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedImage(null);
    };
    if (selectedImage) {
      window.addEventListener('keydown', closeOnEscape);
    }
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [selectedImage]);

  if (loading) return <p>Chargement des images...</p>;
  if (imageUrls.length === 0) return <p>Aucune image trouvée.</p>;

  return (
    <>
      <div className="carousel-container">
        {imageUrls.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`animal-${i}`}
            className="carousel-image"
            onClick={() => setSelectedImage(src)}
          />
        ))}
      </div>

      {selectedImage && (
        <div className="overlay" onClick={() => setSelectedImage(null)}>
          <img
            src={selectedImage}
            alt="Full view"
            className="overlay-image"
            onClick={(e) => e.stopPropagation()} // prevents closing on image click
          />
        </div>
      )}
    </>
  );
}
