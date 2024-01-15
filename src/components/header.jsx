import { useState } from "react";
import { Link } from "react-router-dom";


export default function Navbar() {
    const [navbarOpen, setNavbarOpen] = useState(false);

    const navItems = [
        {
            name: "Pose",
            path: "/pose"
        }
    ]
    return (
        <>
            <nav className="relative flex flex-wrap items-center justify-between px-2 bg-gray-200 drop-shadow-lg shadow-lg mb-3">
                <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
                    <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
                        <Link
                            className="text-xl font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap capitalize"
                            to="/"
                        >
                            Sync
                        </Link>
                        <button
                            className="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
                            type="button"
                            onClick={() => setNavbarOpen(!navbarOpen)}
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                    </div>
                    <div
                        className={
                            "md:flex flex-grow items-center" +
                            (navbarOpen ? " flex" : " hidden")
                        }
                        id="example-navbar-danger"
                    >
                        {
                            navItems.map((item, index) => {
                                return (
                                    <Link to={item.path}
                                        className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug hover:opacity-75"
                                        key={index}
                                    >
                                        {item.name}
                                    </Link>
                                )
                            })
                        }
                    </div>
                </div>
            </nav>
        </>
    );
}