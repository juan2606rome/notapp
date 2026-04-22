const http = require('http');
const url = require('url');
const { Client } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';

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

const client = new Client({
  connectionString: "postgresql://postgres.osvoizwprmxlrgqmbqbp:HUKO98**sjde@aws-1-us-east-1.pooler.supabase.com:5432/postgres",
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
    title: 'Pokemon Microservice API',
    version: '1.0.0',
    description:
      'Microservicio REST para consultar 10 Pokémon almacenados en PostgreSQL (Supabase). ' +
      'Pokémon disponibles: bulbasaur, charmander, squirtle, pikachu, jigglypuff, meowth, gengar, eevee, snorlax, ditto.'
  },
  servers: [
    { url: 'https://microserviciopokemon.onrender.com', description: 'Producción (Render)' },
    { url: 'http://localhost:3000', description: 'Desarrollo local' }
  ],
  tags: [
    { name: 'Root',    description: 'Información general del microservicio' },
    { name: 'Pokemon', description: 'Operaciones sobre los Pokémon registrados' }
  ],
  paths: {
    '/': {
      get: {
        tags: ['Root'],
        summary: 'Información del servicio',
        operationId: 'getRoot',
        responses: {
          '200': {
            description: 'Metadata del microservicio',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ServiceInfo' }
              }
            }
          }
        }
      }
    },
    '/pokemon': {
      get: {
        tags: ['Pokemon'],
        summary: 'Listar todos los Pokémon',
        operationId: 'getAllPokemon',
        responses: {
          '200': {
            description: 'Lista completa de los 10 Pokémon',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Pokemon' } }
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
    '/pokemon/{idOrName}': {
      get: {
        tags: ['Pokemon'],
        summary: 'Buscar Pokémon por ID o nombre',
        operationId: 'getPokemonByIdOrName',
        parameters: [
          {
            name: 'idOrName',
            in: 'path',
            required: true,
            description: 'ID numérico (ej: 132) o nombre en minúsculas (ej: ditto)',
            schema: { type: 'string' },
            examples: {
              porNombre: { summary: 'Por nombre', value: 'ditto' },
              porId:     { summary: 'Por ID',     value: '132'  }
            }
          }
        ],
        responses: {
          '200': {
            description: 'Pokémon encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Pokemon' },
                example: {
                  id: 132, name: 'ditto',
                  front_image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png',
                  back_image:  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/132.png',
                  shiny_image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/132.png',
                  height: 3, weight: 40, type: 'normal'
                }
              }
            }
          },
          '404': {
            description: 'Pokémon no encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { error: 'Pokemon "mewtwo" no encontrado' }
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
      Pokemon: {
        type: 'object',
        properties: {
          id:          { type: 'integer', example: 132 },
          name:        { type: 'string',  example: 'ditto' },
          front_image: { type: 'string',  format: 'uri', example: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png' },
          back_image:  { type: 'string',  format: 'uri', example: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/132.png' },
          shiny_image: { type: 'string',  format: 'uri', example: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/132.png' },
          height:      { type: 'integer', example: 3 },
          weight:      { type: 'integer', example: 40 },
          type:        { type: 'string',  example: 'normal' }
        }
      },
      ServiceInfo: {
        type: 'object',
        properties: {
          servicio:  { type: 'string', example: 'Pokemon Microservice' },
          version:   { type: 'string', example: '1.0.0' },
          endpoints: {
            type: 'object',
            properties: {
              todos:     { type: 'string', example: '/pokemon' },
              porNombre: { type: 'string', example: '/pokemon/ditto' },
              porId:     { type: 'string', example: '/pokemon/132' }
            }
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Pokemon "x" no encontrado' }
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
    // crear estudiante
    await client.query(
      'INSERT INTO estudiantes VALUES ($1,$2,$3,$4)',
      [cedula, nombre, correo, celular]
    );

    // crear registro de notas vacío
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

  const { cedula, nota1, nota2, nota3, nota4 , definitiva} = body;

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


// ─── LISTAR TODO ─────────────
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
    <title>Pokemon API - Swagger UI</title>
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
      <h1>Pokemon API Docs</h1>
      <ul>
        <li>GET /pokemon → lista todos</li>
        <li>GET /pokemon/:id → buscar por id</li>
        <li>GET /pokemon/:name → buscar por nombre</li>
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