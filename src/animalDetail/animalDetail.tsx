import { useLocation, useParams } from "react-router-dom";
import { Animal } from "../models/animal";
import AnimalCell from "../animaux/AnimalCell";
import { Species } from "../models/species";
import { useEffect, useState } from "react";
import { apiCall } from "../api/apiCall";
import './AnimalDetail.css'; // ← create this CSS file

type propsSpecies = {
  species: Species;
};

type propsImages = {
  imagesId: string[];
};

function AnimalDetail() {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const animal = location.state?.animal as Animal | undefined;

  return (
    <div className="animal-detail-container">
      <h1 className="detail-title">🦁 Détail de l’animal</h1>

      <div className="animal-detail-content">
        {animal && (
          <>
            <AnimalCell key={animal._id} animal={animal} onClick={() => {}} />
            <SpeciesDetail species={animal.species} />
            {animal.images && animal.images.length > 0 && (
              <>
                <h3 className="carousel-title">📸 Galerie</h3>
                <ImageCarousel imagesId={animal.images} />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AnimalDetail;

function SpeciesDetail({ species }: propsSpecies) {
  return (
    <div className="species-card">
      <h2 className="species-name">{species.name}</h2>
      <p className="species-description">{species.description}</p>
      <p className="species-status">
        🛡️ Statut de conservation : <strong>"En danger"</strong>
      </p>
      <p className="species-habitat">
        🌍 Habitat naturel : <em>Forêt tropicale</em>
      </p>
    </div>
  );
}

function ImageCarousel({ imagesId }: propsImages) {
  const [loading, setLoading] = useState(true);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImages() {
      setLoading(true);
      try {
        const fetchPromises = imagesId.map(async (imageId) => {
          const res = await apiCall(`asset/${imageId}`, "GET", null);
          if (!res || !res.ok) throw new Error(`Failed to fetch image ${imageId}`);
          const blob = await res.blob();
          return URL.createObjectURL(blob);
        });

        const urls = await Promise.all(fetchPromises);
        setImageUrls(urls);
      } catch (error) {
        console.error("Image fetch failed:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
    return () => {
      imageUrls.forEach((url) => URL.revokeObjectURL(url));
      setImageUrls([]);
    };
  }, [imagesId]);

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
  if (imagesId.length === 0) return <p>Aucune image trouvée.</p>;

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
