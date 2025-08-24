import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from 'react-router-dom';

import { useState } from 'react';


import SignUpScreen from './pages/SignUp/SignUpScreen';
import IdentificationScreen from './pages/SignUp/IdentificationScreen';
import ProfileSignupScreen from './pages/SignUp/CompleteProfileScreen';
import SignupScreenConf from './pages/SignUp/SignUpConfScreen';
import LoginScreen from './pages/LogIn/LogInScreen';
import PasswordRecoveryScreen from './pages/LogIn/PasswordRecoveryScreen';
import PasswordRecoveryConfirmation from './pages/LogIn/PasswordRecoveryConfirmation';
import Explore from './pages/Explore/Explore';
import Restauration from './pages/Explore/Restauration';
import Profile from './pages/Profile/Profile';
import Favorites from './pages/Favorite/Favorite';
import Navbar from './components/shared/Navbar';
import { PropertyCreationProvider } from './context/PropertyCreationContext';
import WelcomeScreen from './pages/WelcomeScreen';
import ResetPasswordScreen from './pages/LogIn/ResetPasswordScreen';

// Property Owner
import WelcomeOwner from './pages/propertyOwner/WelcomeOwner';
import AddProperty from './pages/propertyOwner/AddProperty';
import PropertyTypeStep from './pages/propertyOwner/PropertyTypeStep';
import PropertyInfoStep from './pages/propertyOwner/PropertyInfoStep';
import PropertyEquipmentsStep from './pages/propertyOwner/PropertyEquipmentsStep';
import PropertyPhotosStep from './pages/propertyOwner/PropertyPhotosStep';
import PropertyTitleStep from './pages/propertyOwner/PropertyTitleStep';
import PropertyDescriptionStep from './pages/propertyOwner/PropertyDescriptionStep';
import PropertyPriceStep from './pages/propertyOwner/PropertyPriceStep';
import PropertyDocumentsStep from './pages/propertyOwner/PropertyDocumentsStep';
import PropertySummary from './pages/propertyOwner/PropertySummary';
import PublishProperty from './pages/propertyOwner/PublishProperty';
import MyProperties from './pages/propertyOwner/MyProperties';
import PropertyPreview from './pages/Propriétés/PropertyPreview';
import OwnerDetails from './pages/propertyOwner/OwnerDetails';

// Intermédiaire
import HomeIntermédiaire from './pages/Intermediate/Acceuil';
import CreatePackage from './pages/Intermediate/CreatePackage';
import SelectPropertyStep from './pages/Intermediate/SelectPropertyStep';
import CohostingExplore from './pages/Explore/CohostingExplore';
import CoHostPropertyPreview from './pages/Intermediate/CoHostPropertyPreview'; 
import PartnerCohostingManagement from './pages/Intermediate/PartnerCohostingManagement';
// import SelectResStep from './pages/Intermediate/SelectResStep';
// import PackageNameStep from './pages/Intermediate/PackageNameStep';
// import PackagePriceStep from './pages/Intermediate/PackagePriceStep';

// Inbox / Chat
import Inbox from './pages/Inbox/Inbox';
import NotificationCenter from './pages/Inbox/NotificationCenter';
import ChatPage from './pages/Inbox/chatPage';

// Modals / Search
import DateSelectionScreens from './pages/UserSearch/Date';
import GuestsSelectionScreen from './pages/UserSearch/Invités';

import ExploreLayout from './pages/Layout/Layout';
import VillaMakarska from './pages/Propriétés/VillaMakarska';
import EditProfileScreen from './pages/Profile/EditProfile';
import DocumentUpload from './utilities/DocumentUpload';

// Explore affiché en fond avec modal devant
function ModalLayout({ children }) {
  return (
    <div className="relative">
      <div className="opacity-30 pointer-events-none">
        <ExploreLayout/>
      </div>
      {children}
    </div>
  );
}

// Wrapper pour l'écran de sélection de date
function DateSelectionScreensWrapper() {
  const navigate = useNavigate();
  const selectedDestination = "Paris"; // à remplacer par une vraie valeur

  const handleBack = () => navigate(-1);

  return (
    <DateSelectionScreens
      selectedDestination={selectedDestination}
      onBack={handleBack}
    />
  );
}

// Wrapper pour l'écran d'invités
function GuestsSelectionScreenWrapper() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location || {};

  const handleBack = () => navigate(-1);

  const handleSearch = (guestData) => {
    console.log('Final search data:', { ...state, guests: guestData });
    // navigate('/search-results', { state: { ... } });
  };

  return (
    <GuestsSelectionScreen
      onBack={handleBack}
      onSearch={handleSearch}
    />
  );
}

// Conditional mobile navbar
function ConditionalNavbar() {
  const location = useLocation();
  const isChatPage = location.pathname.startsWith('/chat/');

  if (isChatPage) return null;

  return (
    <div className="block md:hidden">
      <Navbar />
    </div>
  );
}

// Main App
function App() {
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    role: '',
    fullName: '',
  });

  return (
    <PropertyCreationProvider>
      <Routes>
        {/* Explore layout */}
        <Route path="/" element={<ExploreLayout />}>
          <Route index element={<Explore />} />
          <Route path="restauration" element={<Restauration />} />
        </Route>

        {/* General / Auth */}
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/signup" element={<SignUpScreen />} />
        <Route path="/signup-confirmation" element={<SignupScreenConf />} />
        <Route path="/identification" element={<IdentificationScreen />} />
        <Route
          path="/complete-profile"
          element={<ProfileSignupScreen signupData={signupData} setSignupData={setSignupData} />}
        />
        <Route path="/password-recovery" element={<PasswordRecoveryScreen />} />
        <Route path="/password-recovery-confirmation" element={<PasswordRecoveryConfirmation />} />
        <Route path="/reset-password/:token" element={<ResetPasswordScreen />} />
        <Route path="/welcomescreen" element={<WelcomeScreen />} />

        {/* User sections */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfileScreen />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/partner-welcome" element={<HomeIntermédiaire />} />
        <Route path="/VillaMakarska" element={<VillaMakarska />} />
        <Route path="/property/:id" element={<PropertyPreview />} />
        <Route path="/owner/:ownerId" element={<CoHostPropertyPreview />} />

        {/* Co-hosting routes - ADD THIS SECTION */}
        <Route path="/cohosting-explore" element={<CohostingExplore />} />
        <Route path="/cohosting-preview/:propertyId" element={<CoHostPropertyPreview />} />
        <Route path="/partner/cohosting-management" element={<PartnerCohostingManagement />} />

        {/* Messages */}
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/notifications" element={<NotificationCenter />} />
        <Route path="/chat/:sender" element={<ChatPage />} />

        {/* Modals */}
        <Route path="/search-date" element={<DateSelectionScreensWrapper />} />
        <Route path="/search-guests" element={<GuestsSelectionScreenWrapper />} />

        {/* Property owner flow */}
        <Route path="/owner-welcome" element={<WelcomeOwner />} />
        <Route path="/add-property" element={<AddProperty />} />
        <Route path="/property-type" element={<PropertyTypeStep />} />
        <Route path="/property-info" element={<PropertyInfoStep />} />
        <Route path="/property-equipments" element={<PropertyEquipmentsStep />} />
        <Route path="/property-photos" element={<PropertyPhotosStep />} />
        <Route path="/property-title" element={<PropertyTitleStep />} />
        <Route path="/property-description" element={<PropertyDescriptionStep />} />
        <Route path="/property-price" element={<PropertyPriceStep />} />
        <Route path="/property-documents" element={<PropertyDocumentsStep />} />
        <Route path="/property-summary" element={<PropertySummary />} />
        <Route path="/publish-property/:id" element={<PublishProperty />} />

        <Route path="/my-properties" element={<MyProperties />} />

        {/* Intermediate */}
        <Route path="/create-package" element={<CreatePackage />} />
        <Route path="/select-property" element={<SelectPropertyStep />} />
        {/* <Route path="/select-res" element={<SelectResStep />} /> */}
        {/* <Route path="/package-name" element={<PackageNameStep />} />
        
        <Route path="/package-price" element={<PackagePriceStep />} /> */}

        <Route path="/data" element={<DocumentUpload />} />
      </Routes>

      <ConditionalNavbar />
    </PropertyCreationProvider>
  );
}

export default App;