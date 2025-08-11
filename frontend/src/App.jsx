import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import EndpointSettings from './pages/EndpointSettings';

function App() {
  return (
    <>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Private Routes */}
              <Route path="/" element={<PrivateRoute />}>
                <Route path="/" element={<Dashboard />} />
              </Route>
              <Route path="/settings" element={<PrivateRoute />}>
                <Route path="/settings" element={<EndpointSettings />} />
              </Route>
            </Routes>
          </main>
        </div>
      </Router>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App;