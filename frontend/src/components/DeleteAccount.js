import React, { useState } from "react";
import axios from "axios";

const DeleteAccount = () => {
  const [showFirstModal, setShowFirstModal] = useState(false);
  const [showSecondModal, setShowSecondModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleDelete = async () => {
    console.log("handleDelete called"); // Vérifiez si cette ligne s'affiche
    try {
      await axios.put(
        `${process.env.REACT_APP_URL_LOCAL}/api/users/delete-account`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Request sent to backend"); // Confirmez si la requête est envoyée

      // Déconnexion après suppression
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (error) {
      console.error("Failed to delete account:", error); // Déboguez l'erreur exacte
      setErrorMessage("Une erreur est survenue lors de la suppression du compte.");
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-white p-8 w-96">
        <h2 className="text-2xl font-bold mb-4">Supprimer mon compte</h2>
        <p className="text-gray-400 mb-4">
          Vous pouvez supprimer votre compte définitivement. Cette action est irréversible.
        </p>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <button
          onClick={() => setShowFirstModal(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-bold"
        >
          Supprimer mon compte
        </button>

        {/* Premier modal */}
        {showFirstModal && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-neutral-950 text-white p-6 rounded-2xl border border-amber-600 shadow-lg shadow-amber-600/50 w-96">
              <h3 className="text-xl font-bold mb-4">Confirmer la suppression</h3>
              <p>Êtes-vous sûr de vouloir supprimer votre compte ?</p>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setShowFirstModal(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    setShowFirstModal(false);
                    setShowSecondModal(true);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-md"
                >
                  Oui, je veux supprimer mon compte
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Second modal */}
        {showSecondModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-neutral-950 text-white p-6 rounded-2xl border border-amber-600 shadow-lg shadow-amber-600/50 w-96">
              <h3 className="text-xl font-bold mb-4">Action irréversible</h3>
              <p>
                En confirmant, votre compte et vos données personnelles seront
                définitivement supprimés.
              </p>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setShowSecondModal(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    console.log("Delete confirmation clicked"); // Vérifiez si ce message s'affiche
                    handleDelete();
                  }}
                  className="bg-red-600 hover:bg-red-700 font-bold text-white px-4 py-2 rounded"
                >
                  Oui, j'accepte de perdre mes données
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteAccount;
