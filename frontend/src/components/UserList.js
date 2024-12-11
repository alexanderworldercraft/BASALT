import React, { useEffect, useState } from "react";
import axios from "axios";

const UserList = ({ gradeId = 3, etatId, onStateChange }) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const etatLabels = {
    1: "Actif",
    2: "Supprimé",
    3: "Bloqué",
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_URL_LOCAL}/api/users/get-users`,
        {
          params: { gradeId, etatId },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUsers(response.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Une erreur est survenue lors du chargement des utilisateurs.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEtat = async (userId, currentEtat) => {
    try {
      const newEtat = currentEtat === 1 ? 3 : 1; // Alterne entre Actif (1) et Bloqué (3)
      await axios.put(
        `${process.env.REACT_APP_URL_LOCAL}/api/users/change-etat`,
        { userId, newEtat },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // Notifie le parent que l'état a changé
      if (onStateChange) onStateChange();
    } catch (err) {
      console.error("Failed to change user state:", err);
      setError("Une erreur est survenue lors de la modification de l'état.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [gradeId, etatId]);

  return (
    <div className="p-4 bg-slate-900/80 rounded-xl shadow-md">
      <h2 className="text-xl text-white font-bold mb-4">
        {etatLabels[etatId] ? `Utilisateurs ${etatLabels[etatId]}` : "Utilisateurs"}
      </h2>
      {loading && <p className="text-yellow-500">Chargement...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul className="divide-y divide-gray-700">
        {users.map((user) => (
          <li key={user.UtilisateurID} className="py-2 flex items-center justify-between flex-col lg:flex-row">

            <div className="flex items-center justify-around w-full lg:w-fit mb-4 lg:mb-0 gap-4">
              <div className='rounded-full h-12 w-12 overflow-hidden'>
                <img
                  src={
                    user.CheminImage
                      ? `${process.env.REACT_APP_URL_LOCAL}${user.CheminImage}`
                      : "https://via.placeholder.com/50?text=No+Image"
                  }
                  alt={user.Surnom}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-white">{user.Surnom}</p>
                <p className="text-gray-400 text-sm">{user.Email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span
                className={`px-3 py-1 text-sm rounded-full ${user.EtatID === 1
                  ? "bg-green-600 shadow-lg shadow-green-600/50 text-black"
                  : user.EtatID === 2
                    ? "bg-red-600 shadow-lg shadow-red-600/50 text-black"
                    : "bg-yellow-600 shadow-lg shadow-yellow-600/50 text-black"
                  }`}
              >
                {etatLabels[user.EtatID]}
              </span>
              {user.EtatID !== 2 && ( // N'affiche pas le bouton si l'utilisateur est supprimé
                <button
                  onClick={() => handleChangeEtat(user.UtilisateurID, user.EtatID)}
                  className={`px-4 py-2 rounded text-sm font-medium ${user.EtatID === 1
                    ? "bg-yellow-600 border-2 border-yellow-800 hover:bg-yellow-700 text-white"
                    : "bg-green-600 border-2 border-green-800 hover:bg-green-700 text-white"
                    }`}
                >
                  {user.EtatID === 1 ? "Bloquer" : "Activer"}
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
