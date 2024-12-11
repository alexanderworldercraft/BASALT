import React, { useState } from "react";
import FormNewAdmin from "./FormNewAdmin";
import AdminList from "./AdminList";
import UserList from "./UserList";

const AdministrationPage = () => {
    const [reload, setReload] = useState(false);

    const handleStateChange = () => {
        setReload((prev) => !prev); // Change la clé pour forcer les listes à se recharger
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-center text-white mb-8">Gestion des administrateurs</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <FormNewAdmin />
                <AdminList />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                <UserList
                    key={`actif-${reload}`} // Clé unique pour forcer le re-render
                    gradeId={3}
                    etatId={1}
                    onStateChange={handleStateChange}
                />
                <UserList
                    key={`bloque-${reload}`} // Clé unique pour forcer le re-render
                    gradeId={3}
                    etatId={3}
                    onStateChange={handleStateChange}
                />
                <UserList
                    key={`supprime-${reload}`} // Clé unique pour forcer le re-render
                    gradeId={3}
                    etatId={2}
                    onStateChange={handleStateChange}
                />
            </div>
            {/* Ajoutez d'autres composants ou fonctionnalités ici */}
        </div>
    );
};

export default AdministrationPage;
