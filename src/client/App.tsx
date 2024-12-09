import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Share from './pages/Share';
import { UserProvider, useUser } from './context/userContext';
import Collection from './pages/Collection';
import Navbar from './components/Navbar';
import WatchVidz from './pages/WatchVidz';
import MyPosts from './pages/MyPosts';
import LoginBanner from './components/LoginBanner';

const AppContent = () => {
    const { userId } = useUser();

    return (
        <>

            <div className="pb-12 bg-gray-100">
                <Navbar />
                <LoginBanner userId={userId} />
            </div>
            <div className="bg-gray-100 min-h-screen">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/share" element={<Share />} />
                    <Route path="/collection" element={<Collection />} />
                    <Route path="/watch-vidz" element={<WatchVidz />} />
                    <Route path="/my-posts" element={<MyPosts />} />
                    <Route path="/" element={<WatchVidz />} />
                </Routes>
            </div>
        </>
    );
};

const App = () => {
    return (
        <UserProvider>
            <Router>
                <AppContent />
            </Router>
        </UserProvider>
    );
};

export default App;
