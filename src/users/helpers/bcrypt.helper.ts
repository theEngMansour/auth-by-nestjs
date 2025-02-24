import * as bcrypt from 'bcryptjs';

export default async function bcryptPassword(
  password: string,
): Promise<string> {
  const salt: string = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}
