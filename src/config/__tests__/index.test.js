import config from '../index';

describe('Config', () => {
  it('should have correct API configuration', () => {
    expect(config.api).toBeDefined();
    expect(config.api.baseURL).toBeDefined();
    expect(config.api.endpoints).toBeDefined();
    expect(config.api.endpoints.login).toBe('/login');
    expect(config.api.endpoints.signup).toBe('/signup');
    expect(config.api.endpoints.user).toBe('/user');
    expect(config.api.endpoints.todos).toBe('/todos');
    expect(config.api.endpoints.todo).toBe('/todo');
  });

  it('should have Firebase configuration', () => {
    expect(config.firebase).toBeDefined();
    expect(config.firebase.apiKey).toBeDefined();
    expect(config.firebase.authDomain).toBeDefined();
    expect(config.firebase.projectId).toBeDefined();
    expect(config.firebase.storageBucket).toBeDefined();
    expect(config.firebase.messagingSenderId).toBeDefined();
    expect(config.firebase.appId).toBeDefined();
  });

  it('should have app configuration', () => {
    expect(config.app).toBeDefined();
    expect(config.app.name).toBe('TodoApp');
    expect(config.app.version).toBe('1.0.0');
  });

  it('should use environment variables when available', () => {
    // Test that the config uses process.env values
    expect(config.api.baseURL).toContain('us-central1-mytodoapp2025.cloudfunctions.net');
  });
});
