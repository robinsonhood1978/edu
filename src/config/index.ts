import { FastifyInstance } from 'fastify';
import { FastifyPluginAsync, FastifyPluginOptions } from 'fastify';
import fp from 'fastify-plugin';
import mongoose from 'mongoose';
import { User, UserModel } from './models/userModel';
import { Profile, ProfileModel } from './models/profileModel';
import { Evaluation, EvaluationModel } from './models/evaluationModel';
import { Course, CourseModel } from './models/courseModel';

export interface Models {
	User: UserModel;
	Profile: ProfileModel;
	Evaluation: EvaluationModel;
	Course: CourseModel;
}

export interface Db {
	models: Models;
}

// define options
export interface MyPluginOptions {
	uri: string;
}

const ConnectDB: FastifyPluginAsync<MyPluginOptions> = async (
	fastify: FastifyInstance,
	options: FastifyPluginOptions
) => {
	try {
		mongoose.connection.on('connected', () => {
			fastify.log.info({ actor: 'MongoDB' }, 'connected');
		});

		mongoose.connection.on('disconnected', () => {
			fastify.log.error({ actor: 'MongoDB' }, 'disconnected');
		});

		const db = await mongoose.connect(options.uri);

		const models: Models = { User, Profile, Evaluation, Course };

		fastify.decorate('db', { models });
	} catch (error) {
		console.error(error);
	}
};

export default fp(ConnectDB);
