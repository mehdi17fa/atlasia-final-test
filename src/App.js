import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from 'react-router-dom';

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
import WelcomeScreen from './pages/WelcomeScreen';
import HomeIntermédiaire from './pages/Intermediate/Acceuil';
import DateSelectionScreens from './pages/UserSearch/Date';
import GuestsSelectionScreen from './pages/UserSearch/Invités';
import ExploreLayout from './pages/Layout/Layout';
import VillaMakarska from './pages/Propriétés/VillaMakarska';
import EditProfileScreen from './pages/Profile/EditProfile';
import Performance from './pages/Intermediate/Performance';
import ListeInter from './pages/propertyOwner/ListeInter';
import ListPropertyOwner from './pages/propertyOwner/ListPropertyOwner';
import WelcomeOwner from './pages/propertyOwner/WelcomeOwner';
import AddProperty from './pages/propertyOwner/AddProperty';
import PropertyDescriptionStep from './pages/propertyOwner/PropertyDescriptionStep';
import PropertyTypeStep from './pages/propertyOwner/PropertyTypeStep';
import PropertyInfoStep from './pages/propertyOwner/PropertyInfoStep';
import PropertyEquipmentsStep from './pages/propertyOwner/PropertyEquipmentsStep';
import PropertyPhotosStep from './pages/propertyOwner/PropertyPhotosStep';
import PropertyDocumentsStep from './pages/propertyOwner/PropertyDocumentsStep';
import PropertyTitleStep from './pages/propertyOwner/PropertyTitleStep';
import PropertyPriceStep from './pages/propertyOwner/PropertyPriceStep';
import MyProperties from './pages/propertyOwner/MyProperties';
import Inbox from './pages/Inbox/Inbox';
import NotificationCenter from './pages/Inbox/NotificationCenter';
import ChatPage from './pages/Inbox/chatPage';
import CreatePackage from './pages/Intermediate/createPackage';
import SelectPropertyStep from './pages/Intermediate/SelectPropertyStep';
import ActivitiesStep from './pages/Intermediate/SelectResStep';
import { PropertyCreationProvider } from './context/PropertyCreationContext';

function App() {
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    role: '',
    fullName: '',
  });

  return (
    <>
      <Routes>
        {/* TEMP: Root replaced with PropertyDescriptionStep instead of ExploreLayout */}
        <Route path="/" element={<ExploreLayout/>}>
          <Route index element={<Explore />} />
          <Route path="restauration" element={<Restauration />} />
        </Route>


        {/* Auth routes */}
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/password-recovery" element={<PasswordRecoveryScreen />} />
        <Route path="/password-recovery-confirmation" element={<PasswordRecoveryConfirmation />} />
        <Route path="/signup" element={<SignUpScreen />} />
        <Route path="/signup-confirmation" element={<SignupScreenConf />} />
        <Route path="/identification" element={<IdentificationScreen />} />
        <Route path="/complete-profile" element={<ProfileSignupScreen signupData={signupData} setSignupData={setSignupData} />} />

        {/* Profile routes */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfileScreen />} />
        <Route path="/favorites" element={<Favorites />} />

        {/* Recherche */}
        <Route path="/search-date" element={<DateSelectionScreensWrapper />} />
        <Route path="/search-guests" element={<GuestsSelectionScreenWrapper />} />

        {/* Pages diverses */}
        <Route path="/welcomescreen" element={<WelcomeScreen />} />
        <Route path="/partner-welcome" element={<HomeIntermédiaire />} />
        <Route path="/VillaMakarska" element={<VillaMakarska />} />

        {/* Propriétaire / Intermédiaire */}
        <Route path='/liste-inter' element={<ListeInter />} />
        <Route path='/list-property-owner' element={<ListPropertyOwner />} />
        <Route path='/welcome-owner' element={<WelcomeOwner />} />

        <Route path='/my-properties' element={<MyProperties />} />
        <Route path='/inbox' element={<Inbox />} />
        <Route path='/notifications' element={<NotificationCenter />} />
        <Route path='chat/:sender' element={<ChatPage />} />
        <Route path='/create-package' element={<CreatePackage />} />
        <Route path='/select-property' element={<SelectPropertyStep />} />
        <Route path='/activities' element={<ActivitiesStep />} />

        <Route
          path="/add-property"
          element={
            <PropertyCreationProvider>
              <AddProperty />
            </PropertyCreationProvider>
          }
        />

        {/* Étape de création de propriété avec contexte */}
        <Route path="/property-description" element={
          <PropertyCreationProvider>
            <PropertyDescriptionStep />
          </PropertyCreationProvider>
        } />

        <Route path="/property-type" element={
          <PropertyCreationProvider>
            <PropertyTypeStep />
          </PropertyCreationProvider>
        } />

        <Route path="/property-infos" element={
          <PropertyCreationProvider>
            <PropertyInfoStep />
          </PropertyCreationProvider>
        } />

        <Route path="/property-equip" element={
          <PropertyCreationProvider>
            <PropertyEquipmentsStep />
          </PropertyCreationProvider>
        } />

        <Route path="/property-photos" element={
          <PropertyCreationProvider>
            <PropertyPhotosStep />
          </PropertyCreationProvider>
        } />

        <Route path="/property-documents" element={
          <PropertyCreationProvider>
            <PropertyDocumentsStep />
          </PropertyCreationProvider>
        } />

        <Route path="/property-title" element={
          <PropertyCreationProvider>
            <PropertyTitleStep />
          </PropertyCreationProvider>
        } />

        <Route path="/property-price" element={
          <PropertyCreationProvider>
            <PropertyPriceStep />
          </PropertyCreationProvider>
        } />
      </Routes>

      

      {/* Navbar visible uniquement sur mobile */}
      <div className="block md:hidden">
        <Navbar />
      </div>
      
    </>
  );
}

// Layout modal (si besoin dans d'autres cas)
function ModalLayout({ children }) {
  return (
    <div className="relative">
      <div className="opacity-30 pointer-events-none">
        <ExploreLayout />
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

export default App;
