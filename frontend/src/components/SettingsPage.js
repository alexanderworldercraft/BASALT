import React from "react";
import UpdateSettings from "./UpdateSettings";
import DeleteAccount from "./DeleteAccount";

const SettingsPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center text-white mb-8">Paramètres</h1>
      <div className="grid grid-cols-1 gap-4 mb-8">
        <UpdateSettings />
        <DeleteAccount />
      </div>
      {/* Ajoutez d'autres composants ou fonctionnalités ici */}
    </div>
  );
};

export default SettingsPage;