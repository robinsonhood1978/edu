import { FastifyInstance, FastifyPluginOptions, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { join } from 'path/posix';

import { Db } from '../config/index';
import { ProfileAttrs } from '../config/models/profileModel';

// Declaration merging
declare module 'fastify' {
	export interface FastifyInstance {
		db: Db;
		authenticate: any;
	}
}

interface profileParams {
	id: string;
	code: string;
	status: string;
	email: string;
}

const fs = require('fs')
const pump = require('pump')
const ProfileRoute: FastifyPluginAsync = async (server: FastifyInstance, options: FastifyPluginOptions) => {

	server.get<{ Params: profileParams }>('/profiles/:code/:status', {
		onRequest: [server.authenticate]
	  }, async (request, reply) => {	
		try {
			const code = request.params.code;
			const status = request.params.status;
			
			const { Profile, Course } = server.db.models;

			const course = await Course.findOne({code});
			// console.log('course', course?.title);
			const res = await Profile.updateMany({"courses.title": course?.title}, { status });
			// const res = await Profile.updateMany({"courses.title": "灵修与明白神的旨意【祝健】- 2022年10月秋季班"}, { status: 'W' });
			
			// console.log('res', res);

			const profiles = await Profile.find({"courses.title": course?.title});

			return reply.code(200).send(profiles);
		} catch (error) {
			request.log.error(error);
			return reply.send(500);
		}
	});
	server.get<{ Params: profileParams }>('/profiles/:code', {
		onRequest: [server.authenticate]
	  }, async (request, reply) => {	
		try {
			const code = request.params.code;
			
			const { Profile, Course } = server.db.models;

			const course = await Course.findOne({code});
			// console.log('course', course?.title);
			// const res = await Profile.updateMany({"courses.title": course?.title}, { status: 'S' });
			// const res = await Profile.updateMany({"courses.title": "灵修与明白神的旨意【祝健】- 2022年10月秋季班"}, { status: 'W' });
			
			// console.log('res', res);

			const profiles = await Profile.find({"courses.title": course?.title});

			return reply.code(200).send(profiles);
		} catch (error) {
			request.log.error(error);
			return reply.send(500);
		}
	});
	
	server.post('/upload', {
		onRequest: [server.authenticate]
	  }, async function (req, reply) {
		const options = { limits: { fileSize: 2000000 } };
		const data = await req.file(options)
		const time = new Date().getTime();
		const ori = data?.filename
		const ext = ori.split('.').pop()
		// console.log('aa', process.cwd())
		// console.log('robin', __basedir)
		const path = join(__basedir, '/public/');
		await pump(data?.file, fs.createWriteStream(path + time +'.'+ ext))
		reply.code(200).send({ name: time +'.'+ ext })
	  })
	  
	  server.post<{ Body: ProfileAttrs }>('/profile', {
		onRequest: [server.authenticate]
	  }, async (request, reply) => {
		try {
            const user: any = request.user;
            const { Profile } = server.db.models;
            // const us = await User.findOne({email: user.email});
            // console.log('us', us);
			
			const {email} = request.body;

			const p = await Profile.findOne({email});
			if(p){
                p.overwrite({ ...request.body, user_id: user?.id });
                await p.save();
                return reply.code(201).send(p);
            }
            else{
                const profile = await Profile.addOne({ ...request.body, user_id: user?.id });
                await profile.save();
                return reply.code(201).send(profile);
            }
			
		} catch (error) {
			request.log.error(error);
			return reply.send(500);
		}
	});

	server.get<{ Params: profileParams }>('/profile', {
		onRequest: [server.authenticate]
	  }, async (request, reply) => {
		try {
			//const ID = request.params.id;
			const u: any = request.user;
			const { Profile } = server.db.models;
            // console.log('robin', u);
			const profile = await Profile.findOne({email: u.email}).populate('user_id', '-password');

			if (!profile) {
				return reply.code(200).send({email:u.email});
			}

			return reply.code(200).send(profile);
		} catch (error) {
			request.log.error(error);
			return reply.send(400);
		}
	});
	server.get<{ Params: profileParams }>('/profile/:email', {
		onRequest: [server.authenticate]
	  }, async (request, reply) => {
		try {
			const email = request.params.email;
			const { Profile } = server.db.models;
            // console.log('robin', u);
			const profile = await Profile.findOne({email}).populate('user_id', '-password');

			if (!profile) {
				return reply.code(200).send({email});
			}

			return reply.code(200).send(profile);
		} catch (error) {
			request.log.error(error);
			return reply.send(400);
		}
	});
};

export default fp(ProfileRoute);
