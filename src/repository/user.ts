import User, {IUser} from "#model/user";


export class UserRepository {
    public getPromptByUserId = async (userId: string): Promise<IUser['prompt'] | null> => {
        try {
            const user = await User.findById(userId, 'prompt').lean();
            return user?.prompt || null;
        } catch (error) {
            console.error('Error fetching prompt by user ID:', error);
            throw new Error('Unable to fetch prompt data.');
        }
    }
}

export default UserRepository;
