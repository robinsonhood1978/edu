import { Schema, Document, model, Model } from 'mongoose';

export interface EvaluationAttrs {
	email: string;
    user_id: string;
	courses: Array<string>;
    video_times: string;
    book_times: string;
    weekreport_times: string;
    interactive_times: string;
    talking_times: string;
    absence_times: string;
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
			required: true
        },
        book_times: {
            type: {title: String},
            _id: false,
			required: true
        },
        weekreport_times: {
            type: {title: String},
            _id: false,
			required: true
        },
        interactive_times: {
            type: {title: String},
            _id: false,
			required: true
        },
        talking_times: {
            type: {title: String},
            _id: false,
			required: true
        },
        absence_times: {
            type: {title: String},
            _id: false,
			required: true
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
