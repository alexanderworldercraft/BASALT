import React, { useState, useEffect } from "react";
import axios from "axios";
import ImagePreview from "./ImagePreview";

const UpdateSettings = () => {
  const [user, setUser] = useState({});
  const [surnom, setSurnom] = useState("");
  const [email, setEmail] = useState("")
  const [image, setImage] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const apiBaseUrl = process.env.REACT_APP_URL_LOCAL;

  const defaultImage = "https://via.placeholder.com/150?text=Default+Profile";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/users/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUser(response.data);
        setSurnom(response.data.Surnom);
        setEmail(response.data.Email);

        // Si l'utilisateur a une image, utiliser son URL, sinon une image par défaut
        setImage(response.data.CheminImage ? `${apiBaseUrl}${response.data.CheminImage}` : null);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("surnom", surnom);
    formData.append("email", email);
    if (oldPassword || newPassword || confirmPassword) {
      const passwordData = JSON.stringify({
        oldPassword,
        newPassword,
        confirmPassword,
      });
      formData.append("motDePasse", passwordData);
    }

    // Gérer l'image : suppression ou remplacement
    if (removeImage) {
      formData.append("removeImage", true);
    } else if (image && typeof image !== "string") {
      formData.append("image", image);
    }

    try {
      const response = await axios.put("/api/users/update", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccessMessage("Les paramètres ont été mis à jour avec succès.");
      setErrorMessage(""); // Réinitialiser le message d'erreur

      if (response.data.user.CheminImage) {
        setImage(`${apiBaseUrl}${response.data.user.CheminImage}`);
        setRemoveImage(false);
      } else {
        setImage(null);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "An error occurred");
      setSuccessMessage(""); // Réinitialiser le message de succès
    }
  };

  const handleImageSelect = (selectedImage) => {
    setImage(selectedImage);
    setRemoveImage(false); // Désactiver la suppression si une nouvelle image est sélectionnée
  };

  const handleRemoveImage = (e) => {
    const isChecked = e.target.checked;
    setRemoveImage(isChecked);
    if (isChecked) {
      setImage(null); // Réinitialise l'image si "Supprimer" est coché
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-white p-8 w-96">
        <h2 className="text-2xl font-bold mb-6">Mise à jour du profil</h2>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-200">Surnom</label>
            <input
              type="text"
              className="w-full px-3 py-2 border hover:border-sky-600 border-sky-500 bg-black rounded"
              value={surnom}
              onChange={(e) => setSurnom(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-200">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border hover:border-sky-600 border-sky-500 bg-black rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-200">Ancien mot de passe</label>
            <input
              type="password"
              className="w-full px-3 py-2 border hover:border-sky-600 border-sky-500 bg-black rounded"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-200">Nouveau mot de passe</label>
            <input
              type="password"
              className="w-full px-3 py-2 border hover:border-sky-600 border-sky-500 bg-black rounded"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-200">Confirmer le nouveau mot de passe</label>
            <input
              type="password"
              className="w-full px-3 py-2 border hover:border-sky-600 border-sky-500 bg-black rounded"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label>Photo de profil</label>
            <ImagePreview
              initialImage={image}
              onImageSelect={handleImageSelect}
            />
          </div>
          <div class="flex gap-3 mb-4">
            <div class="flex h-6 shrink-0 items-center">
              <div class="group grid size-4 grid-cols-1">
                <input id="removeImage" name="removeImage" type="checkbox" class="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-sky-600 checked:bg-gradient-to-r from-sky-800 to-sky-700 indeterminate:border-sky-600 indeterminate:bg-gradient-to-r from-sky-800 to-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                  checked={removeImage}
                  onChange={handleRemoveImage} />
                <svg class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25" viewBox="0 0 14 14" fill="none">
                  <path class="opacity-0 group-has-[:checked]:opacity-100" d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path class="opacity-0 group-has-[:indeterminate]:opacity-100" d="M3 7H11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
            </div>
            <div>
              <label for="removeImage">Supprimer l'image de profil</label>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-sky-800 to-sky-700 hover:from-sky-900 hover:to-sky-950 text-white py-2 rounded"
          >
            Sauvegarder
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateSettings;