import { Schema, Document, model, Model } from 'mongoose';

export interface CourseAttrs {
	title: string;
	type: number;
	status: string;
	code: string;
	standardAnswer: Array<string>;
}

export interface CourseModel extends Model<CourseDocument> {
	addOne(doc: CourseAttrs): CourseDocument;
}

export interface CourseDocument extends Document {
	title: string;
	type: number;
	status: string;
	code: string;
	standardAnswer: Array<string>;
}

export const courseSchema: Schema = new Schema(
	{
		title: {
			type: String,
			required: true
		},
		type: {
			type: Number,
			required: true
		},
		status: {
			type: String,
			required: true
		},
		code: {
			type: String,
			required: true
		},
		standardAnswer: {
			type: Array<string>,
		},
	},
	{
		timestamps: true
	}
);

courseSchema.statics.addOne = (doc: CourseAttrs) => {
	return new Course(doc);
};

export const Course = model<CourseDocument, CourseModel>('Course', courseSchema);
