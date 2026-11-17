import bcrypt from "bcrypt";

export async function hash(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
}

export async function compareHash(
    password: string,
    hashedPassword: string,
): Promise<boolean> {
    const result = await bcrypt.compare(password, hashedPassword);
    return result;
}
