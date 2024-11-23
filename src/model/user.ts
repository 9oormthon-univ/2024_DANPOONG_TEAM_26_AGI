import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface 정의
interface Provider {
    uid: string;
    connectedAt: Date;
    _id: mongoose.Types.ObjectId;
}

interface Prompt {
    fields: string[];
    techs: string[];
    companies: string[];
    _id: mongoose.Types.ObjectId;
}

export interface IUser extends Document {
    providers: {
        kakao?: Provider;
    };
    registered: boolean;
    token: string;
    email: string;
    name: string;
    prompt: Prompt;
    lastGeneratedAssignment: string;
}

// Schema 정의
const providerSchema = new Schema<Provider>({
    uid: { type: String, required: true },
    connectedAt: { type: Date, required: true },
    _id: { type: Schema.Types.ObjectId, required: true },
});

const promptSchema = new Schema<Prompt>({
    fields: { type: [String], required: true },
    techs: { type: [String], required: true },
    companies: { type: [String], required: true },
    _id: { type: Schema.Types.ObjectId, required: true },
});

const userSchema = new Schema<IUser>({
    providers: {
        kakao: providerSchema,
    },
    registered: { type: Boolean, required: true },
    token: { type: String, required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    prompt: { type: promptSchema, required: true },
    lastGeneratedAssignment: { type: String, required: true },
});

// 모델 생성
const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
