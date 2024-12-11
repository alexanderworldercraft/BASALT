import React, { useEffect, useState } from 'react';
import { Disclosure, Menu } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useLocation } from 'react-router-dom'; // Importer useLocation
import api from '../services/api';

const apiBaseUrl = process.env.REACT_APP_URL_LOCAL;

const navigation = [
    //{ name: 'Tableau de bord', href: '/dashboard' }, // pour une page tableau de bord
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
    const [user, setUser] = useState(null);
    const location = useLocation(); // Obtenir l'URL actuelle

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await api.get('/users/me');
                setUser(response.data);
            } catch (err) {
                console.error('Failed to fetch user profile:', err);
            }
        };

        fetchUserProfile();
    }, []);

    const defaultImage = 'https://via.placeholder.com/150?text=Default+Profile'; // URL de l'image par défaut

    // Définir dynamiquement les éléments du menu dropdown
    const dropdownItems = [
        { name: 'Votre Profil', href: '/profile' },
        { name: 'Paramètres', href: '/settings' },
        ...(user?.GradeID === 1 || user?.GradeID === 2
            ? [{ name: 'Administration', href: '/administration' }]
            : []), // Ajouter "Administration" uniquement pour les admins
    ];

    return (
        <Disclosure as="nav" className="bg-transparent backdrop-blur sticky top-0 z-40">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 items-center justify-between">
                            {/* Menu mobile */}
                            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                    <span className="sr-only">Open main menu</span>
                                    {open ? (
                                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </Disclosure.Button>
                            </div>

                            {/* Logo et navigation principale */}
                            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                <div className="flex shrink-0 items-center">
                                    <img alt="Your Company" src="./logo.png" className="h-8 w-auto" />
                                </div>
                                <div className="hidden sm:ml-6 sm:block">
                                    <div className="flex space-x-4">
                                        {navigation.map((item) => (
                                            <a
                                                key={item.name}
                                                href={item.href}
                                                className={classNames(
                                                    location.pathname === item.href
                                                        ? 'bg-orange-600 shadow-lg shadow-orange-600/30 font-black italic text-white'
                                                        : 'text-gray-300 hover:bg-amber-600 hover:text-white',
                                                    'rounded-md px-3 py-2 text-sm font-medium'
                                                )}
                                                aria-current={location.pathname === item.href ? 'page' : undefined}
                                            >
                                                {item.name}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Icônes de droite */}
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                {/* Dropdown utilisateur */}
                                <Menu as="div" className="relative ml-3">
                                    <div>
                                        <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                            <span className="sr-only">Open user menu</span>
                                            <div className="h-8 w-8 rounded-full flex items-center justify-center overflow-hidden">
                                                <img
                                                    className="h-full w-full object-cover"
                                                    src={
                                                        user?.CheminImage
                                                            ? `${apiBaseUrl}${user.CheminImage}` // Ajout de l'adresse du serveur
                                                            : defaultImage
                                                    }
                                                    alt="Profile"
                                                />
                                            </div>
                                        </Menu.Button>
                                    </div>
                                    <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-gray-950/60 backdrop-blur-3xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden z-50">
                                        {dropdownItems.map((item) => (
                                            <Menu.Item key={item.name}>
                                                {({ active }) => (
                                                    <a
                                                        href={item.href}
                                                        className={classNames(
                                                            location.pathname === item.href
                                                                ? 'bg-orange-600 shadow-lg shadow-orange-600/30 font-black italic text-white'
                                                                : active
                                                                    ? 'bg-gray-100'
                                                                    : 'text-gray-100',
                                                            'block px-4 py-2 text-sm'
                                                        )}
                                                        aria-current={location.pathname === item.href ? 'page' : undefined}
                                                    >
                                                        {item.name}
                                                    </a>
                                                )}
                                            </Menu.Item>
                                        ))}
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    onClick={() => {
                                                        localStorage.removeItem('token');
                                                        window.location.href = '/login';
                                                    }}
                                                    className={classNames(
                                                        active ? 'bg-gray-100' : 'text-gray-100',
                                                        'block w-full text-left px-4 py-2 text-sm'
                                                    )}
                                                >
                                                    Se déconnecter
                                                </button>
                                            )}
                                        </Menu.Item>
                                    </Menu.Items>
                                </Menu>
                            </div>
                        </div>
                    </div>

                    {/* Menu mobile */}
                    <Disclosure.Panel className="sm:hidden">
                        <div className="space-y-1 px-2 pb-3 pt-2">
                            {navigation.map((item) => (
                                <Disclosure.Button
                                    key={item.name}
                                    as="a"
                                    href={item.href}
                                    className={classNames(
                                        location.pathname === item.href
                                            ? 'bg-orange-600 shadow-lg shadow-orange-600/30 font-black italic text-white'
                                            : 'text-gray-300 hover:bg-amber-600 hover:text-white',
                                        'block rounded-md px-3 py-2 text-base font-medium'
                                    )}
                                    aria-current={location.pathname === item.href ? 'page' : undefined}
                                >
                                    {item.name}
                                </Disclosure.Button>
                            ))}
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    );
}