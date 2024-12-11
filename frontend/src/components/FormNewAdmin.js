import React, { useState, useEffect } from "react";
import axios from "axios";
import ImagePreview from "./ImagePreview";

const FormNewAdmin = () => {
  const [surnom, setSurnom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuperAdmin, setIsSuperAdmin] = useState(false); // Vérifie si l'utilisateur est super admin

  useEffect(() => {
    const checkSuperAdmin = async () => {
      try {
        const response = await axios.get("/api/users/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (response.data.GradeID === 1) {
          setIsSuperAdmin(true);
        }
      } catch (error) {
        console.error("Failed to verify super admin:", error);
      }
    };

    checkSuperAdmin();
  }, []);

  const validatePassword = (password) => {
    const minLength = 8;
    const maxLength = 20;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      password.length >= minLength &&
      password.length <= maxLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar
    );
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();

    if (!validatePassword(motDePasse)) {
      setErrorMessage(
        "Le mot de passe doit contenir entre 8 et 20 caractères, inclure une majuscule, une minuscule, un chiffre et un caractère spécial."
      );
      return;
    }

    try {
      const formData = new FormData();
      formData.append("surnom", surnom);
      formData.append("email", email);
      formData.append("motDePasse", motDePasse);
      formData.append("gradeId", 2); // Ajouter le gradeId
      if (image) formData.append("image", image);

      const apiBaseUrl = process.env.REACT_APP_URL_LOCAL;

      const response = await axios.post(
        `${apiBaseUrl}/api/users/register`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Admin created successfully:", response.data);
      setErrorMessage("");
      setSurnom("");
      setEmail("");
      setMotDePasse("");
      setImage(null);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "Une erreur inattendue est survenue."
      );
    }
  };

  if (!isSuperAdmin) {
    return <div className="flex items-center justify-center text-white"><p className="text-center"><span className="italic text-amber-600">Accès interdit :</span><br />cette section est réservée au super administrateur.</p></div>;
  }

  return (
    <div className="flex items-center justify-center">
      <div className="text-white p-8 rounded w-96">
        <h2 className="text-2xl font-bold mb-6">Créer un Administrateur</h2>
        {errorMessage && (
          <div className="mb-4 p-3 text-red-700 bg-red-100 rounded">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleCreateAdmin}>
          <div className="mb-4">
            <label className="block text-gray-200">Surnom</label>
            <input
              type="text"
              className="w-full px-3 py-2 border hover:border-amber-700 border-amber-600 bg-black rounded"
              value={surnom}
              onChange={(e) => setSurnom(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-200">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border hover:border-amber-700 border-amber-600 bg-black rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-200">Mot de Passe</label>
            <input
              type="password"
              className="w-full px-3 py-2 border hover:border-amber-700 border-amber-600 bg-black rounded"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              required
            />
            <small className="text-xs text-gray-400">
              Le mot de passe doit contenir entre 8 et 20 caractères, inclure une
              majuscule, une minuscule, un chiffre et un caractère spécial.
            </small>
          </div>
          <div className="mb-4">
            <label className="block text-gray-200">Photo de Profil</label>
            <ImagePreview onImageSelect={setImage} />
          </div>
          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded font-bold"
          >
            Créer
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormNewAdmin;
