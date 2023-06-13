import { Schema, Document, model, Model } from 'mongoose';

export interface EvaluationAttrs {
	_id: any;
	email: string;
    user_id: string;
	courses: Array<string>;
    video_times: string;
    book_times: string;
    weekreport_times: string;
    interactive_times: string;
    talking_times: string;
    absence_times: string;
    answer: Array<string>;
    score: number;
    summary: string;
    
}

export interface EvaluationModel extends Model<EvaluationDocument> {
	addOne(doc: EvaluationAttrs): EvaluationDocument;
}

export interface EvaluationDocument extends Document {
	email: string;
	user_id: string;
	courses: Array<string>;
    video_times: string;
    book_times: string;
    weekreport_times: string;
    interactive_times: string;
    talking_times: string;
    absence_times: string;
    summary: string;
    answer: Array<string>;
    score: number;
	createdAt: string;
	updatedAt: string;
}

export const evaluationSchema: Schema = new Schema(
	{
		email: {
			type: String,
			required: true
		},
		user_id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
		},
		courses: {
			type: Array<string>,
			required: true
		},
        video_times: {
            type: {title: String},
            _id: false,
        },
        book_times: {
            type: {title: String},
            _id: false,
        },
        weekreport_times: {
            type: {title: String},
            _id: false,
        },
        interactive_times: {
            type: {title: String},
            _id: false,
        },
        talking_times: {
            type: {title: String},
            _id: false,
        },
        absence_times: {
            type: {title: String},
            _id: false,
        },
        summary: {
			type: String
		},
        answer: {
			type: Array<string>,
		},
        score: {
			type: Number
		},
	},
	{
		timestamps: true
	}
);

evaluationSchema.statics.addOne = (doc: EvaluationAttrs) => {
	return new Evaluation(doc);
};

export const Evaluation = model<EvaluationDocument, EvaluationModel>('Evaluation', evaluationSchema);
