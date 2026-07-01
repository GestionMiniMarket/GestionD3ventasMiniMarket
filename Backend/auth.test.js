const request = require('supertest');
const app = require('./src/app');

describe('RF01 — Login de usuario', () => {
  
  it('Debe retornar Status 401 con credenciales incorrectas', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin_falso@gmail.com',
        password: 'clave_equivocada'
      });
    
    expect(response.statusCode).toBe(401);
    expect(response.body.mensaje).toBe('Credenciales incorrectas');
  });

  it('Debe retornar Status 400 si hay campos vacíos', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: '',
        password: ''
      });
    
    expect(response.statusCode).toBe(400);
    expect(response.body.mensaje).toBe('Correo y contraseña son requeridos');
  });

});