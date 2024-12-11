import React, { useState, useEffect } from "react";
import axios from "axios";

const apiBaseUrl = process.env.REACT_APP_URL_LOCAL;

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [currentUserGrade, setCurrentUserGrade] = useState(null); // Grade de l'utilisateur connecté
  const [errorMessage, setErrorMessage] = useState("");

  const fetchAdmins = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/users/admins`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAdmins(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des admins:", error.response?.data || error.message);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/users/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("Current user data:", response.data); // Log pour vérifier les données de l'utilisateur actuel
      setCurrentUserGrade(response.data.GradeID);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur connecté:", error.response?.data || error.message);
    }
  };

  const handleChangeEtat = async (userId, currentEtat) => {
    const newEtat = currentEtat === 1 ? 3 : 1; // Bloquer si Actif, Activer si Bloqué
    try {
      await axios.put(
        `${apiBaseUrl}/api/users/change-etat`,
        { userId, newEtat },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchAdmins(); // Recharger la liste après modification
    } catch (error) {
      console.error("Erreur lors du changement d'état de l'utilisateur:", error.response?.data || error.message);
      setErrorMessage("Une erreur est survenue lors du changement d'état.");
    }
  };

  useEffect(() => {
    fetchAdmins();
    fetchCurrentUser();
  }, []);

  return (
    <div className="w-full mt-8">
      <h3 className="text-xl text-white font-bold mb-4">Liste des administrateurs</h3>
      {errorMessage && (
        <div className="mb-4 p-3 text-red-700 bg-red-100 rounded">
          {errorMessage}
        </div>
      )}
      <div className="overflow-auto max-h-52">
        <table className="w-full border-collapse bg-gray-900 text-white rounded-lg border overflow-hidden">
          <thead>
            <tr className="bg-gray-800">
              <th className="border border-gray-700 px-4 py-2 text-left">ID</th>
              <th className="border border-gray-700 px-4 py-2 text-left">Surnom</th>
              <th className="border border-gray-700 px-4 py-2 text-left">Email</th>
              <th className="border border-gray-700 px-4 py-2 text-left">Grade</th>
              <th className="border border-gray-700 px-4 py-2 text-left">État</th>
              {currentUserGrade === 1 && (
                <th className="border border-gray-700 px-4 py-2 text-left">Action</th>
              )}
            </tr>
          </thead>
          <tbody>
  {(admins || []).map((admin) => {
    console.log("Admin data:", admin); // Log pour inspecter chaque admin
    return (
      <tr key={admin.UtilisateurID} className="hover:bg-gray-800">
        <td className="border border-gray-700 px-4 py-2">{admin.UtilisateurID}</td>
        <td className="border border-gray-700 px-4 py-2">{admin.Surnom}</td>
        <td className="border border-gray-700 px-4 py-2">{admin.Email}</td>
        <td className="border border-gray-700 px-4 py-2">{admin.Grade?.Nom || "N/A"}</td>
        <td
          className={`border border-gray-700 px-4 py-2 ${
            admin.EtatID === 1
              ? "text-green-500"
              : admin.EtatID === 3
              ? "text-yellow-500"
              : "text-red-500"
          }`}
        >
          {admin.EtatID === 1 ? "Actif" : admin.EtatID === 3 ? "Bloqué" : "Supprimé"}
        </td>
        {console.log("Conditions: ", {
  currentUserGrade,
  adminGradeID: admin.GradeID,
  adminEtatID: admin.EtatID,
})}
{currentUserGrade === 1 && admin.GradeID === 2 && admin.EtatID !== 2 && (
  <td className="border border-gray-700 px-4 py-2">
    <button
      onClick={() => handleChangeEtat(admin.UtilisateurID, admin.EtatID)}
      className={`px-4 py-2 rounded text-sm font-medium ${
        admin.EtatID === 1
          ? "bg-yellow-600 hover:bg-yellow-700 text-white"
          : "bg-green-600 hover:bg-green-700 text-white"
      }`}
    >
      {admin.EtatID === 1 ? "Bloquer" : "Activer"}
    </button>
  </td>
)}

      </tr>
    );
  })}
</tbody>

        </table>
      </div>
    </div>
  );
};

export default AdminList;
