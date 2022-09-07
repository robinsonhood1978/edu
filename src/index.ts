import { fastify } from 'fastify';
import fastifyJwt from '@fastify/jwt';
import fastifyMutipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'
import cors from '@fastify/cors'
import * as dotenv from 'dotenv'
dotenv.config()
import * as path from 'path'
import pino from 'pino';
import db from './config/index';
import userRoutes from './routes/userRoute';
import profileRoutes from './routes/profileRoute';
import evaluationRoutes from './routes/evaluationRoute';

declare global {
    var __basedir: string;
}
global.__basedir = __dirname;

// console.log('Robin', process.env)
const Port : any = process.env.PORT ;
const uri : any = process.env.MONGODB_URI;
const secret: any = process.env.SECRET;
// console.log('Robin', secret);
const server = fastify({
	logger: pino({ level: 'info' })
});

server.register(fastifyJwt, { secret } );
server.register(cors, {});
server.register(fastifyMutipart);
// server.register(fastifyStatic, {
// 	root: path.join(__dirname, 'public'),
// 	prefix: '/public/',
// 	index: false,
//   	list: true
//   })

  server.register(fastifyStatic, {
	root: path.join(__dirname, '/public'),
	prefix: '/public',
	prefixAvoidTrailingSlash: true,
	list: {
	  format: 'json',
	  names: ['/']
	}
  })

server.decorate("authenticate", async function(request: any, reply: any) {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
});
// Activate plugins below:
server.register(db, { uri });
server.register(userRoutes);
server.register(profileRoutes);
server.register(evaluationRoutes);

server.listen({port: Port, host: '0.0.0.0'}, (err) => {
	if (err) {
	  server.log.error(err)
	  process.exit(1)
	}
  })
// server.listen({ port: 7000, host: '0.0.0.0' })
// 		.catch(err => {
// 			console.log('Error starting server:', err)
// 			process.exit(1)
// 		})

// Run the server!
// server.listen({ port: 7000, host: '0.0.0.0' }, (err, address) => {
// 	if (err) throw err
// 	// console.log(`server listening on ${address}`);
//   })
// const start = async () => {
	
// 	try {
// 		await server.listen(Port);
// 		console.log('Server started successfully');
// 	} catch (err) {
// 		server.log.error(err);
// 		process.exit(1);
// 	}
// };
// start();
