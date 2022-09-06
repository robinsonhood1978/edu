import { FastifyInstance, FastifyPluginOptions, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

import { Db } from '../config/index';
import { UserAttrs } from '../config/models/userModel';

// Declaration merging
declare module 'fastify' {
	export interface FastifyInstance {
		db: Db;
		authenticate: any;
	}
}

interface userParams {
	[x: string]: any;
	id: string;
}

const nodemailer = require("nodemailer");

const UserRoute: FastifyPluginAsync = async (server: FastifyInstance, options: FastifyPluginOptions) => {
	server.post<{ Body: UserAttrs }>('/pwd', {
		onRequest: [server.authenticate]
	  }, async (request, reply) => {
		try {
			const u: any = request.user;
			const { User } = server.db.models;
			const {password} = request.body;

			// let user = await User.findOne({email: u.email});
			// console.log(user)
			
			const { createHash } = await import('node:crypto');

			const hash = createHash('md5')
               .update(password)
               .digest('hex');

			await User.updateOne({email: u.email}, {
				password: hash
			  });

			return reply.code(201).send({code:0});
		} catch (error) {
			request.log.error(error);
			return reply.send(500);
		}
	});
	server.get('/users', {
		onRequest: [server.authenticate]
	  }, async (request, reply) => {	
		try {
			const { User } = server.db.models;

			const users = await User.find({});

			return reply.code(200).send(users);
		} catch (error) {
			request.log.error(error);
			return reply.send(500);
		}
	});
	server.post<{ Body: UserAttrs }>('/resetpwd', {}, async (request, reply) => {
		try {
			const { User } = server.db.models;
			const {password,code} = request.body;

			let user = await User.findOne({code});
			if(!user)reply.send(false);
			// console.log(user)
			
			const { createHash } = await import('node:crypto');

			const hash = createHash('md5')
               .update(password)
               .digest('hex');

			await User.updateOne({code}, {
				password: hash
			  });

			return reply.send(true);
		} catch (error) {
			request.log.error(error);
			return reply.send(500);
		}
	});
	server.get<{ Params: userParams }>('/verify_email/:code', {}, async (request, reply) => {
		try {
			const {code} = request.params;

			const { User } = server.db.models;
			const user = await User.findOne({code});
			// console.log(user)

			if (!user) {
				return reply.send(false);
			}

			return reply.code(200).send(true);
		} catch (error) {
			request.log.error(error);
			return reply.send(400);
		}
	});
	server.get<{ Params: userParams }>('/forgot_pwd/:email', {}, async (request, reply) => {
		try {
			const {email} = request.params;
			const domain = request.headers.origin;
			const { createHash } = await import('node:crypto');

			const code = createHash('md5')
               .update(Date.now().toString())
               .digest('hex');

			const { User } = server.db.models;
			await User.updateOne({email: email}, {
				code
			});
			const link = domain + '/resetpwd/' + code;
			// console.log(link)
			// let transporter = nodemailer.createTransport({
			// 	host: "smtp.tom.com",
			// 	port: 25,
			// 	secure: false, // true for 465, false for other ports
			// 	auth: {
			// 	  user: 'bobpaul@tom.com', // generated ethereal user
			// 	  pass: 'niboul', // generated ethereal password
			// 	},
			//   });

			let transporter = nodemailer.createTransport({
				host: "smtp.gmail.com",
				port: 465,
				secure: true, // true for 465, false for other ports
				auth: {
				  user: process.env.MAIL_USER, // generated ethereal user
				  pass: process.env.MAIL_PASS, // generated ethereal password
				},
			  });
			
			await transporter.sendMail({
				from: '"华牧网校" <uhope2u@gmail.com>', // sender address
				to: email, // list of receivers
				subject: "忘记密码", // Subject line
				text: "点击链接重置密码 "+link, // plain text body
				html: `点击链接重置密码 <a href='${link}'>${link}</a>`, // html body
			  });
			// 
			// const user = await User.findById(ID);

			// if (!user) {
			// 	return reply.send(404);
			// }

			return reply.code(200).send(email);
		} catch (error) {
			request.log.error(error);
			return reply.send(400);
		}
	});

	server.post<{ Body: UserAttrs }>('/signup', {}, async (request, reply) => {
		try {
			const { User } = server.db.models;
			const {email,password} = request.body;

			const u = await User.findOne({email});
			// console.log('robin', user);
			if(u)return reply.code(409).send({msg: 'EMAIL_ALREADY_TAKEN'});

			const { createHash } = await import('node:crypto');

			const hash = createHash('md5')
               .update(password)
               .digest('hex');

			const user = await User.addOne({...request.body, password:hash});
			await user.save();
			// console.log('robin',user);
			const token = server.jwt.sign({id: user._id, email});
			// return reply.code(201).send({user});
			return reply.code(201).send({token});
		} catch (error) {
			request.log.error(error);
			return reply.send(500);
		}
	});

	server.post<{ Body: UserAttrs }>('/login', {}, async (request, reply) => {
		try {
			const { User } = server.db.models;
			const {email,password} = request.body;
			const { createHash } = await import('node:crypto');

			const hash = createHash('md5')
						.update(password)
						.digest('hex');

			const user = await User.findOne({email});

			const token = server.jwt.sign({id: user?._id, email});
			
			if (user) {
				// check password
				if (hash === user.password) {
					reply.code(200).send({ token });
				}
				// password mismatch
				else {
					reply.code(401).send({msg: 'PASSWORD_MISMATCH'});
				}
			} else {
				reply.code(404).send({msg: 'USER_NOT_FOUND'});
			}
		} catch (error) {
			request.log.error(error);
			return reply.send(500);
		}
	});

	server.get<{ Params: userParams }>('/users/:id', {}, async (request, reply) => {
		try {
			const ID = request.params.id;
			const { User } = server.db.models;
			const user = await User.findById(ID);

			if (!user) {
				return reply.send(404);
			}

			return reply.code(200).send(user);
		} catch (error) {
			request.log.error(error);
			return reply.send(400);
		}
	});

	server.get<{ Params: userParams }>('/user', {
		onRequest: [server.authenticate]
	  }, async (request, reply) => {
		try {
			//const ID = request.params.id;
			const u: any = request.user;
			const { User } = server.db.models;
			const user: {password?: string} | null = await User.findOne({email: u.email}).select("-password");

			if (!user) {
				return reply.send(404);
			}

			return reply.code(200).send(user);
		} catch (error) {
			request.log.error(error);
			return reply.send(400);
		}
	});
};

export default fp(UserRoute);
