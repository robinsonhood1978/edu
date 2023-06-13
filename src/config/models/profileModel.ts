import { Schema, Document, model, Model } from 'mongoose';

export interface ProfileAttrs {
	email: string;
    user_id: string;
	courses: Array<string>;
	name: string;
    first_name: string;
    last_name: string;
    nick: string;
    gender: string;
    birthday: string;
    education: string;
	profession: string;
    country: string;
    city: string;
    // address: string;
    // mobile: string;
    // wechat: string;
	// enigma: string;
    baptism_date: string;
    church: string;
    church_time: string;
    church_experience: string;
    bible_once: string;
    pastor_agree: string;
    recommender: string;
    recommender_contact: string;
    video_times: string;
    book_times: string;
    gifts: string;
    know_channel: string;
    personal_testimony: string;
    ideas_needs: string;
	recommendation_letter: string;
	status: string;
	viewed_bible: string;
	agreed_pastor: string;
	interview_marks: Array<string>;
}

export interface ProfileModel extends Model<ProfileDocument> {
	addOne(doc: ProfileAttrs): ProfileDocument;
}

export interface ProfileDocument extends Document {
	email: string;
	user_id: string;
	courses: Array<string>;
	name: string;
    first_name: string;
    last_name: string;
    nick: string;
    gender: string;
    birthday: string;
    education: string;
	profession: string;
    country: string;
    city: string;
    // address: string;
    // mobile: string;
    // wechat: string;
	// enigma: string;
    baptism_date: string;
    church: string;
    church_time: string;
    church_experience: string;
    bible_once: string;
    pastor_agree: string;
    recommender: string;
    recommender_contact: string;
    video_times: string;
    book_times: string;
    gifts: string;
    know_channel: string;
    personal_testimony: string;
    ideas_needs: string;
	recommendation_letter: string;
	status: string;
	viewed_bible: string;
	agreed_pastor: string;
	interview_marks: Array<string>;
	createdAt: string;
	updatedAt: string;
}

export const profileSchema: Schema = new Schema(
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
			// required: true
		},
        name: {
			type: String,
			// required: true
		},
        first_name: {
			type: String,
			// required: true
		},
        last_name: {
			type: String,
			// required: true
		},
        nick: {
			type: String
		},
        country: {
			type: String,
			// required: true
		},
        city: {
			type: String,
			// required: true
		},
        // address: {
		// 	type: String,
		// 	required: true
		// },
        // mobile: {
		// 	type: String,
		// 	required: true
		// },
        // wechat: {
		// 	type: String,
		// 	required: true
		// },
		// enigma: {
		// 	type: String,
		// },
        church: {
			type: String,
			// required: true
		},
        church_time: {
			type: String,
			// required: true
		},
        recommender: {
			type: String,
			// required: true
		},
        recommender_contact: {
			type: String,
			// required: true
		},
        gifts: {
			type: String
		},
        know_channel: {
			type: {title: String},
            _id : false ,
			// required: true
		},
        church_experience: {
			type: String,
			// required: true
		},
        personal_testimony: {
			type: String,
		},
        ideas_needs: {
			type: String,
		},
        birthday: {
			type: String,
			// required: true
		},
        baptism_date: {
			type: String,
			// required: true
		},
        gender: {
			type: {title: String},
            _id : false ,
			// required: true
		},
        education: {
			type: {title: String},
            _id : false ,
			// required: true
		},
		profession: {
			type: {title: String},
            _id : false ,
			// required: true
		},
        video_times: {
            type: {title: String},
            _id: false
        },
        book_times: {
            type: {title: String},
            _id: false
        },
		recommendation_letter: {
			type: String,
		},
		status: {
			type: String,
		},
		viewed_bible: {
			type: String,
		},
		agreed_pastor: {
			type: String,
		},
		interview_marks: {
			type: Array<string>,
		},
	},
	{
		timestamps: true
	}
);

profileSchema.statics.addOne = (doc: ProfileAttrs) => {
	return new Profile(doc);
};

export const Profile = model<ProfileDocument, ProfileModel>('Profile', profileSchema);
