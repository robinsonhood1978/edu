import { FastifyInstance, FastifyPluginOptions, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

import { Db } from '../config/index';
import { CourseAttrs } from '../config/models/courseModel';

// Declaration merging
declare module 'fastify' {
	export interface FastifyInstance {
		db: Db;
		authenticate: any;
	}
}

interface courseParams {
	id: string;
}

const CourseRoute: FastifyPluginAsync = async (server: FastifyInstance, options: FastifyPluginOptions) => {

	server.post<{ Body: CourseAttrs }>('/course', {
		onRequest: [server.authenticate]
	  }, async (request, reply) => {
		try {
			//const ID = request.params.id;
			const u: any = request.user;
			const { Course } = server.db.models;
            const {title} = request.body;

			const course = await Course.findOne({title});
            // console.log(course);

			if (!course) {
				return reply.code(200).send(course);
			}

			return reply.code(200).send(course);
		} catch (error) {
			request.log.error(error);
			return reply.send(400);
		}
	});
};

export default fp(CourseRoute);
