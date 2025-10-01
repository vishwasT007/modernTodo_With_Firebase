import { authMiddleWare } from '../auth';

// Mock history object
const mockHistory = {
  push: jest.fn(),
};

describe('authMiddleWare', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset mock functions
    jest.clearAllMocks();
  });

  it('should redirect to login when no auth token exists', () => {
    // Ensure no token in localStorage
    expect(localStorage.getItem('AuthToken')).toBeNull();

    authMiddleWare(mockHistory);

    expect(mockHistory.push).toHaveBeenCalledWith('/login');
  });

  it('should not redirect when auth token exists', () => {
    // Set a mock token
    localStorage.setItem('AuthToken', 'mock-token');

    authMiddleWare(mockHistory);

    expect(mockHistory.push).not.toHaveBeenCalled();
  });

  it('should handle null token explicitly', () => {
    localStorage.setItem('AuthToken', null);

    authMiddleWare(mockHistory);

    expect(mockHistory.push).toHaveBeenCalledWith('/login');
  });

  it('should handle empty string token', () => {
    localStorage.setItem('AuthToken', '');

    authMiddleWare(mockHistory);

    expect(mockHistory.push).toHaveBeenCalledWith('/login');
  });
});
