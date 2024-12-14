## ***🗂 Structure de SAMI***
```ybash
SAMI/
├── backend/
|   ├── controllers/
|   |   ├── userController.js
|   |   └── ...
|   ├── middlewares/
|   |   ├── authMiddleware.js
|   |   └── ...
|   ├── models/
|   |   ├── user.js
|   |   └── ...
|   ├── node_modules/
|   ├── prisma/
|   |   ├── schema.prisma
|   |   ├── seed.js
|   |   └── ...
|   ├── routes/
|   |   ├── userRoutes.js
|   |   └── ...
|   ├── schemas/
|   |   ├── userSchemas.js
|   |   └── ...
|   ├── services/
|   |   ├── db.js
|   |   └── ...
|   ├── ssl/
|   |   ├── certificate.crt
|   |   ├── certificate.csr
|   |   ├── private.key
|   |   └── ...
|   ├── tests/
|   |   ├── apiUser.test.js
|   |   ├── apiUserFail.test.js
|   |   └── ...
|   ├── uploads/
|   |   └── ...
|   ├── server.js
|   ├── .env
|   └── ...
|   ├── package.json
|   └── ...
├── frontend/
|   ├── build/
|   ├── node_modules/
|   ├── public/
|   ├── src/
|   |   ├── components/
|   |   |   |-- AdministrationPage.js
|   |   |   |-- AdminList.js
|   |   |   |-- DeleteAccount.js
|   |   |   |-- FormNewAdmin.js
|   |   |   |-- ImagePreview.js
|   |   |   |-- LoginPage.js
|   |   |   |-- NavBar.js
|   |   |   |-- ProfilePage.js
|   |   |   |-- ProtectedAdminRoute.js
|   |   |   |-- ProtectedRoute.js
|   |   |   |-- RegisterPage.js
|   |   |   |-- SettingsPage.js
|   |   |   |-- UpdateSettings.js
|   |   |   |-- UserList.js
|   |   |   └── ...
|   |   ├── services/
|   |   |   |-- api.js
|   |   |   └── ...
|   |   ├── App.js
|   |   ├── index.js
|   |   └── ...
|   ├── package.json
|   ├── postcss.config.js
|   ├── tailwind.config.js
|   ├── .env
|   └── ...
├── arborescence.md
├── README.md
└── ...
```