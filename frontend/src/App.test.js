import { render } from '@testing-library/react';
import { AuthProvider } from './context/AuthContext';
import App from './App';

test('renders App without crashing', () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
});