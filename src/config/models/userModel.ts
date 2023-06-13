import { Schema, Document, model, Model } from 'mongoose';

export interface UserAttrs {
	email: string;
	password: string;
	channel: string;
	lang: string;
	code: string;
	ability: { action: string; subject: string; }[];
}

export interface UserModel extends Model<UserDocument> {
	addOne(doc: UserAttrs): UserDocument;
}

export interface UserDocument extends Document {
	email: string;
	password: string;
	channel: string;
	lang: string;
	code: string;
	createdAt: string;
	updatedAt: string;
	ability: { action: string; subject: string; }[];
}

export const userSchema: Schema = new Schema(
	{
		email: {
			type: String,
			required: true
		},
		password: {
			type: String,
			required: true
		},
		channel: {
			type: String,
			required: true
		},
		lang: {
			type: String,
			required: true
		},
		code: {
			type: String
		},
		ability: {
			type: [Schema.Types.Mixed]
		}
	},
	{
		timestamps: true
	}
);

userSchema.statics.addOne = (doc: UserAttrs) => {
	return new User(doc);
};

export const User = model<UserDocument, UserModel>('User', userSchema);
