import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import generateToastContainer from "../utils/ToastContainer";
import { toast } from "react-toastify";
import { gql } from "graphql-request";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchGraphQL } from "../api/apiCall";
import TokenStore from "../api/tokenStore";
import "./SettingsForm.css";

const GET_ME = gql`
  query Me {
    me {
      id
      firstName
      lastName
      email
    }
  }
`;

const UPDATE_EMAIL = gql`
  mutation UpdateEmail($newEmail: String!) {
    updateEmail(newEmail: $newEmail) {
      id
      email
    }
  }
`;

function SettingsForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["me"],
    queryFn: async () => await fetchGraphQL(GET_ME, {}),
  });

  const updateEmailMutation = useMutation({
    mutationFn: async (newEmail: string) =>
      fetchGraphQL(UPDATE_EMAIL, { newEmail }),
    onSuccess: (res) => {
      toast.success(`Email updated: ${res.updateEmail.email}`);
    },
    onError: () => {
      toast.error("Failed to update email");
    },
  });

  useEffect(() => {
    if (data?.me?.email) {
      setEmail(data.me.email);
    }
  }, [data]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter an email");
      return;
    }
    updateEmailMutation.mutate(email);
  };

  const handleLogout = () => {
    TokenStore.clearToken();
    toast.info("Logged out successfully");
    navigate("/");
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading settings...</div>;

  return (
    <div style={{ paddingTop: "70px" }}>
      <Navbar />
      <div className="settings-container">
        <h2 className="settings-title">Paramètres</h2>

        <form onSubmit={handleSubmit} className="settings-form">
          <label>Nouvel email :</label>
          <input
            type="email"
            placeholder="Entrez un nouvel email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="settings-input"
          />
          <button type="submit" className="settings-button">
            Mettre à jour
          </button>
        </form>

        <button onClick={handleLogout} className="logout-button">
          Déconnexion
        </button>
      </div>
      {generateToastContainer()}
    </div>
  );
}

export default SettingsForm;
