import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SocialMediaProvider } from './context/SocialMediaContext';
import Layout from './components/Layout';
import FeedPage from './pages/FeedPage';
import TopUsersPage from './pages/TopUsersPage';
import TrendingPostsPage from './pages/TrendingPostsPage';
import TestPage from './pages/TestPage';
import DashboardPage from './pages/DashboardPage';
import ApiTestPage from './pages/ApiTestPage';

function App() {
  return (
    <Router>
      <SocialMediaProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<FeedPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/top-users" element={<TopUsersPage />} />
            <Route path="/trending" element={<TrendingPostsPage />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/api-test" element={<ApiTestPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Layout>
      </SocialMediaProvider>
    </Router>
  );
}

export default App;
