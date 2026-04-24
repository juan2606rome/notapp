const http = require('http');
const url = require('url');
const { Client } = require('pg');

// ─── CONEXIÓN DB ─────────────────────────────
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

client.connect()
  .then(() => console.log('✅ Conectado a PostgreSQL'))
  .catch(err => {
    console.error('❌ Error DB:', err.message);
    process.exit(1);
  });

// ─── HEADERS CORS ────────────────────────────
const setCorsHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

// ─── RESPUESTA JSON ──────────────────────────
const sendJSON = (res, status, data) => {
  setCorsHeaders(res);
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};

// ─── SWAGGER SPEC ────────────────────────────
const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'NotApp – API de Registro de Notas',
    version: '1.0.0',
    description:
      'Microservicio REST para gestión de estudiantes y notas académicas. ' +
      'Permite registrar estudiantes, consultar sus notas por cédula y actualizar calificaciones. ' +
      'Base de datos PostgreSQL (Supabase). Desplegado en Render.'
  },
  servers: [
    { url: 'https://notapp-jekr.onrender.com', description: 'Producción (Render)' },
    { url: 'http://localhost:3000', description: 'Desarrollo local' }
  ],
  tags: [
    { name: 'Estudiantes', description: 'Operaciones sobre estudiantes' },
    { name: 'Notas',       description: 'Operaciones sobre notas académicas' }
  ],
  paths: {
    '/estudiante': {
      post: {
        tags: ['Estudiantes'],
        summary: 'Registrar un nuevo estudiante',
        operationId: 'crearEstudiante',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/EstudianteInput' },
              example: {
                cedula: '12345',
                nombre: 'Juan Pérez',
                correo: 'juan@gmail.com',
                celular: '3001234567',
                materia: 'Python'
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Estudiante registrado exitosamente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/MensajeOK' },
                example: { msg: 'Estudiante creado con notas' }
              }
            }
          },
          '500': {
            description: 'Error del servidor (ej: cédula ya registrada)',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Error' } }
            }
          }
        }
      }
    },
    '/estudiante/{cedula}': {
      get: {
        tags: ['Estudiantes'],
        summary: 'Consultar estudiante y sus notas por cédula',
        operationId: 'getEstudiantePorCedula',
        parameters: [
          {
            name: 'cedula',
            in: 'path',
            required: true,
            description: 'Número de cédula del estudiante',
            schema: { type: 'string' },
            examples: {
              ejemplo1: { summary: 'Cédula de ejemplo', value: '12345' }
            }
          }
        ],
        responses: {
          '200': {
            description: 'Datos del estudiante con sus notas',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/EstudianteConNotas' },
                example: {
                  cedula: '12345',
                  nombre: 'Juan Pérez',
                  correo: 'juan@gmail.com',
                  celular: '3001234567',
                  materia: 'Python',
                  nota1: 45,
                  nota2: 48,
                  nota3: 50,
                  nota4: 42,
                  definitiva: 46.25
                }
              }
            }
          },
          '404': {
            description: 'Estudiante no encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { error: 'Estudiante no encontrado' }
              }
            }
          },
          '500': {
            description: 'Error del servidor',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Error' } }
            }
          }
        }
      }
    },
    '/notas': {
      get: {
        tags: ['Notas'],
        summary: 'Listar todos los estudiantes con sus notas',
        operationId: 'getAllNotas',
        responses: {
          '200': {
            description: 'Lista completa de estudiantes con sus calificaciones',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/EstudianteConNotas' }
                }
              }
            }
          },
          '500': {
            description: 'Error del servidor',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Error' } }
            }
          }
        }
      },
      put: {
        tags: ['Notas'],
        summary: 'Actualizar las notas de un estudiante por cédula',
        operationId: 'actualizarNotas',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/NotasInput' },
              example: {
                cedula: '12345',
                nota1: 45,
                nota2: 48,
                nota3: 50,
                nota4: 42,
                definitiva: 46.25
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Notas actualizadas exitosamente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/MensajeOK' },
                example: { msg: 'Notas actualizadas' }
              }
            }
          },
          '404': {
            description: 'No existe un estudiante con esa cédula',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { error: 'No existe ese estudiante' }
              }
            }
          },
          '500': {
            description: 'Error del servidor',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Error' } }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      EstudianteInput: {
        type: 'object',
        required: ['cedula', 'nombre', 'correo', 'celular', 'materia'],
        properties: {
          cedula:  { type: 'string',  example: '12345' },
          nombre:  { type: 'string',  example: 'Juan Pérez' },
          correo:  { type: 'string',  format: 'email', example: 'juan@gmail.com' },
          celular: { type: 'string',  example: '3001234567' },
          materia: { type: 'string',  example: 'Python' }
        }
      },
      NotasInput: {
        type: 'object',
        required: ['cedula'],
        properties: {
          cedula:     { type: 'string',  example: '12345' },
          nota1:      { type: 'number',  minimum: 0, maximum: 50, example: 45 },
          nota2:      { type: 'number',  minimum: 0, maximum: 50, example: 48 },
          nota3:      { type: 'number',  minimum: 0, maximum: 50, example: 50 },
          nota4:      { type: 'number',  minimum: 0, maximum: 50, example: 42 },
          definitiva: { type: 'number',  example: 46.25 }
        }
      },
      EstudianteConNotas: {
        type: 'object',
        properties: {
          cedula:     { type: 'string',  example: '12345' },
          nombre:     { type: 'string',  example: 'Juan Pérez' },
          correo:     { type: 'string',  example: 'juan@gmail.com' },
          celular:    { type: 'string',  example: '3001234567' },
          materia:    { type: 'string',  example: 'Python' },
          nota1:      { type: 'number',  example: 45 },
          nota2:      { type: 'number',  example: 48 },
          nota3:      { type: 'number',  example: 50 },
          nota4:      { type: 'number',  example: 42 },
          definitiva: { type: 'number',  example: 46.25 }
        }
      },
      MensajeOK: {
        type: 'object',
        properties: {
          msg: { type: 'string', example: 'Operación exitosa' }
        }
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Descripción del error' }
        }
      }
    }
  }
};

// ─── SERVIDOR ────────────────────────────────
const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    return res.end();
  }

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;

  // ─── CREAR ESTUDIANTE + NOTAS ─────────────
  if (path === '/estudiante' && req.method === 'POST') {
    const body = await new Promise(resolve => {
      let data = '';
      req.on('data', chunk => data += chunk);
      req.on('end', () => resolve(JSON.parse(data)));
    });

    const { cedula, nombre, correo, celular, materia } = body;

    try {
      await client.query(
        'INSERT INTO estudiantes VALUES ($1,$2,$3,$4)',
        [cedula, nombre, correo, celular]
      );
      await client.query(
        `INSERT INTO notas (cedula, materia, nota1, nota2, nota3, nota4, definitiva)
         VALUES ($1,$2,0,0,0,0,0)`,
        [cedula, materia]
      );
      return sendJSON(res, 201, { msg: 'Estudiante creado con notas' });
    } catch (err) {
      return sendJSON(res, 500, { error: err.message });
    }
  }

  // ─── ACTUALIZAR NOTAS POR CÉDULA ─────────────
  if (path === '/notas' && req.method === 'PUT') {
    const body = await new Promise(resolve => {
      let data = '';
      req.on('data', chunk => data += chunk);
      req.on('end', () => resolve(JSON.parse(data)));
    });

    const { cedula, nota1, nota2, nota3, nota4, definitiva } = body;

    try {
      const result = await client.query(
        `UPDATE notas 
         SET nota1=$1, nota2=$2, nota3=$3, nota4=$4, definitiva=$5
         WHERE cedula=$6`,
        [nota1, nota2, nota3, nota4, definitiva, cedula]
      );
      if (result.rowCount === 0) {
        return sendJSON(res, 404, { error: 'No existe ese estudiante' });
      }
      return sendJSON(res, 200, { msg: 'Notas actualizadas' });
    } catch (err) {
      return sendJSON(res, 500, { error: err.message });
    }
  }

  // ─── CONSULTAR ESTUDIANTE POR CÉDULA ─────────────
  if (path.startsWith('/estudiante/') && req.method === 'GET') {
    const cedula = path.split('/')[2];
    try {
      const result = await client.query(`
        SELECT e.cedula, e.nombre, e.correo, e.celular,
               n.materia, n.nota1, n.nota2, n.nota3, n.nota4, n.definitiva
        FROM estudiantes e
        JOIN notas n ON e.cedula = n.cedula
        WHERE e.cedula = $1
      `, [cedula]);

      if (result.rows.length === 0) {
        return sendJSON(res, 404, { error: 'Estudiante no encontrado' });
      }
      return sendJSON(res, 200, result.rows[0]);
    } catch (err) {
      return sendJSON(res, 500, { error: err.message });
    }
  }

  // ─── LISTAR TODOS ─────────────
  if (path === '/notas' && req.method === 'GET') {
    try {
      const result = await client.query(`
        SELECT e.nombre, e.cedula, n.*
        FROM notas n
        JOIN estudiantes e ON e.cedula = n.cedula
      `);
      return sendJSON(res, 200, result.rows);
    } catch (err) {
      return sendJSON(res, 500, { error: err.message });
    }
  }

  // ─── SWAGGER JSON SPEC ────
  if (path === '/swagger.json' && req.method === 'GET') {
    setCorsHeaders(res);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(swaggerSpec));
  }

  // ─── SWAGGER UI ───────────
  if (path === '/api-docs' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(`<!DOCTYPE html>
<html lang="es">
  <head>
    <title>NotApp – Documentación API</title>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css"/>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js"></script>
    <script>
      SwaggerUIBundle({
        url: '/swagger.json',
        dom_id: '#swagger-ui',
        presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
        layout: 'StandaloneLayout',
        deepLinking: true
      });
    </script>
  </body>
</html>`);
  }

  // ─── DOCS HTML BÁSICO ─────
  if (path === '/docs') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(`
      <h1>NotApp – API de Notas</h1>
      <ul>
        <li>POST /estudiante → registrar estudiante</li>
        <li>GET /estudiante/:cedula → consultar por cédula</li>
        <li>GET /notas → listar todos</li>
        <li>PUT /notas → actualizar notas</li>
        <li>GET /api-docs → Swagger UI</li>
        <li>GET /swagger.json → OpenAPI spec</li>
      </ul>
    `);
  }

  // ─── 404 ─────────────────
  return sendJSON(res, 404, {
    error: 'Ruta no existe. Ve a /api-docs para la documentación.'
  });
});

// ─── INICIAR SERVIDOR ────────────────────────
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
  console.log(`📚 Swagger UI en http://localhost:${PORT}/api-docs`);
});


// CREATE TABLE estudiantes (
//     cedula VARCHAR(20) PRIMARY KEY,
//     nombre VARCHAR(100),
//     correo VARCHAR(100),
//     celular VARCHAR(20)
// );

// CREATE TABLE notas (
//     id SERIAL PRIMARY KEY,
//     cedula VARCHAR(20) REFERENCES estudiantes(cedula),
//     materia VARCHAR(100),
//     nota1 DECIMAL,
//     nota2 DECIMAL,
//     nota3 DECIMAL,
//     nota4 DECIMAL,
//     definitiva DECIMAL
// );






// ─── CONEXIÓN DB ─────────────────────────────
// const client = new Client(
//   isProduction
//     ? {
//         connectionString: process.env.DATABASE_URL,
//         ssl: { rejectUnauthorized: false }
//       }
//     : {
//         host: 'localhost',
//         port: 5432,
//         database: 'notapp_db',
//         user: 'postgres',
//         password: '1234'
//       }
// );

// const client = new Client({
//   connectionString: "postgresql://postgres.osvoizwprmxlrgqmbqbp:HUKO98**sjde@aws-1-us-east-1.pooler.supabase.com:5432/postgres",
//   ssl: { rejectUnauthorized: false }
// });