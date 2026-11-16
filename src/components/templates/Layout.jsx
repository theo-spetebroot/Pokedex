import { Suspense } from "react";
import { Outlet } from "react-router";
import Header from "../organisms/Header";
import Message from "../atoms/Message";

// Structure commune à toutes les pages : menu + zone de contenu
function Layout() {
    return (
        <div className="min-h-svh">
            <Header />
            <main className="mx-auto max-w-5xl px-4 py-8">
                {/* Affiché pendant le téléchargement du code d'une page chargée à la demande */}
                <Suspense fallback={<Message>Chargement...</Message>}>
                    <Outlet />
                </Suspense>
            </main>
        </div>
    );
}

export default Layout;
