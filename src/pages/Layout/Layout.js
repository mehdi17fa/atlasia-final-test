import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import SearchBar from '../../components/explore/SearchBar';
import ExploreFilter from '../../components/explore/ExplorFilter';
import MapToggle from '../../components/explore/MapToggle';
import Navbar from '../../components/shared/Navbar';
import DestinationSearchScreens from '../UserSearch/Destination';
import DateSelectionScreens from '../UserSearch/Date';
import GuestsSelectionScreen from '../UserSearch/Invités';
import SignUpScreen from '../SignUp/SignUpScreen';
import SignupScreenConf from '../SignUp/SignUpConfScreen';
import IdentificationModal from '../SignUp/IdentificationScreen';
import LoginScreen from '../LogIn/LogInScreen';
import { AuthContext } from '../../context/AuthContext';
import DefaultAvatar from '../assets/default-pp.png';

export default function ExploreLayout() {
  const { user, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState('explore');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showSignupConfirmation, setShowSignupConfirmation] = useState(false);
  const [showIdentification, setShowIdentification] = useState(false);

  // Step and modal handlers
  const handleSearchBarClick = () => navigate('/search');
  const handleDestinationSelected = (dest) => {
    setSelectedDestination(dest);
    setCurrentStep('date');
  };
  const handleDateSelected = (dateSel) => {
    setSelectedDate(dateSel);
    setCurrentStep('guests');
  };
  const handleGuestsSearch = () => setCurrentStep('explore');
  const handleBackToExplore = () => setCurrentStep('explore');
  const handleBackToDestination = () => setCurrentStep('destination');
  const handleBackToDate = () => setCurrentStep('date');
  const handleLogin = () => setShowLogin(true);
  const handleSignup = () => setShowSignup(true);
  const handleCloseLogin = () => setShowLogin(false);
  const handleCloseSignup = () => setShowSignup(false);
  const handleCloseSignupConfirmation = () => setShowSignupConfirmation(false);
  const handleSwitchToSignup = () => {
    setShowLogin(false);
    setShowSignup(true);
  };
  const handleSwitchToLogin = () => {
    setShowSignup(false);
    setShowLogin(true);
  };
  const handleSwitchToConfirmation = () => {
    setShowSignup(false);
    setShowIdentification(true);
  };
  const handleBackToSignup = () => {
    setShowIdentification(false);
    setShowSignup(true);
  };

  const isModalOpen =
    currentStep !== 'explore' ||
    showLogin ||
    showSignup ||
    showSignupConfirmation ||
    showIdentification;

  if (isLoading) {
    return <p className="text-center mt-20">Loading...</p>;
  }

  return (
    <div className="relative min-h-screen">
      <div
        className={`transition duration-300 ease-in-out ${
          isModalOpen ? 'opacity-30 pointer-events-none select-none' : 'opacity-100'
        }`}
      >
        {/* Header for all views */}
        <div className="flex items-center justify-between px-6 py-4 bg-white shadow-sm sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-green-800">ATLASIA</h1>
          <div className="flex-1 max-w-3xl mx-10 hidden md:block">
            <SearchBar onClick={handleSearchBarClick} />
          </div>
          <div className="flex gap-4 text-sm">
            {user ? (
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center justify-center w-10 h-10 bg-green-800 text-white rounded-full hover:bg-green-700 transition-colors duration-200"
                aria-label="Go to profile"
              >
                {user.profilePic || user.avatar ? (
                  <img
                    src={user.profilePic || user.avatar}
                    alt={user.fullName || user.name || 'User'}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden">
                    {DefaultAvatar ? (
                      <img src={DefaultAvatar} alt="Default Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 bg-green-800 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {user.firstName
                            ? user.firstName.charAt(0).toUpperCase()
                            : user.fullName
                            ? user.fullName.charAt(0).toUpperCase()
                            : user.name
                            ? user.name.charAt(0).toUpperCase()
                            : user.email
                            ? user.email.charAt(0).toUpperCase()
                            : 'U'}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </button>
            ) : (
              <>
                <button
                  onClick={handleLogin}
                  className="bg-green-800 text-white px-6 py-2 rounded-full font-medium hover:bg-green-700 transition"
                >
                  Log in
                </button>
                <button
                  onClick={handleSignup}
                  className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-green-600 hover:text-white transition border border-gray-300"
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>

        {/* Navbar for all views */}
        <Navbar role={user ? user.role : location.pathname === '/' ? 'tourist' : null} />

        {/* Mobile-specific search bar */}
        <div className="px-4 md:hidden">
          <SearchBar onClick={handleSearchBarClick} />
        </div>

        <ExploreFilter />
        <Outlet />
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <MapToggle />
        </div>
      </div>

      {isModalOpen && <div className="fixed inset-0 bg-black bg-opacity-40 z-20" />}

      {currentStep === 'destination' && (
        <DestinationSearchScreens onBack={handleBackToExplore} onDestinationSelected={handleDestinationSelected} />
      )}
      {currentStep === 'date' && (
        <DateSelectionScreens selectedDestination={selectedDestination} onBack={handleBackToDestination} onNext={handleDateSelected} />
      )}
      {currentStep === 'guests' && (
        <GuestsSelectionScreen onBack={handleBackToDate} onSearch={handleGuestsSearch} />
      )}
      {showLogin && <LoginScreen onClose={handleCloseLogin} />}
      {showSignup && <SignUpScreen onClose={handleCloseSignup} />}
      {showSignupConfirmation && <SignupScreenConf />}
      {showIdentification && <IdentificationModal />}
    </div>
  );
};