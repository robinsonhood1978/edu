import { FastifyInstance, FastifyPluginOptions, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

import { Db } from '../config/index';
import { EvaluationAttrs } from '../config/models/evaluationModel';

// Declaration merging
declare module 'fastify' {
	export interface FastifyInstance {
		db: Db;
		authenticate: any;
	}
}

interface evaluationParams {
	id: string;
}

const EvaluationRoute: FastifyPluginAsync = async (server: FastifyInstance, options: FastifyPluginOptions) => {

	server.post<{ Body: EvaluationAttrs }>('/evaluation', {
		onRequest: [server.authenticate]
	  }, async (request, reply) => {
		try {
            const user: any = request.user;
            const { Evaluation } = server.db.models;
            // const us = await User.findOne({email: user.email});
            // console.log('us', us);
			
			// const {email} = request.body;

			const p = await Evaluation.findOne({email: user.email});
			if(p){
                p.overwrite({ ...request.body, user_id: user?.id });
                await p.save();
                return reply.code(201).send(p);
            }
            else{
                const evaluation = await Evaluation.addOne({ ...request.body, user_id: user?.id });
                await evaluation.save();
                return reply.code(201).send(evaluation);
            }
			
		} catch (error) {
			request.log.error(error);
			return reply.send(500);
		}
	});

	server.get<{ Params: evaluationParams }>('/evaluation', {
		onRequest: [server.authenticate]
	  }, async (request, reply) => {
		try {
			//const ID = request.params.id;
			const u: any = request.user;
			const { Evaluation } = server.db.models;
            // console.log('robin', u);
			const evaluation = await Evaluation.findOne({email: u.email}).populate('user_id', '-password');

			if (!evaluation) {
				return reply.code(200).send({email:u.email});
			}

			return reply.code(200).send(evaluation);
		} catch (error) {
			request.log.error(error);
			return reply.send(400);
		}
	});
};

export default fp(EvaluationRoute);
