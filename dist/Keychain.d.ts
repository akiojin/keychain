import { default as KeychainFile } from './KeychainFile';
export default class Keychain {
    static GenerateKeychainPath(name: string): string;
    static GetDefaultLoginKeychainPath(): string;
    static CreateKeychain(keychain: string, password: string): Promise<KeychainFile>;
    static OpenKeychain(keychain: string, password?: string): KeychainFile;
    static ImportCertificateFromFile(keychain: string, certificate: string, passphrase: string): Promise<number>;
    static ChangeKeychainPassword(keychain: string, oldPassword: string, newPassword: string): Promise<number>;
    static LockKeychain(keychain?: string): Promise<number>;
    static LockKeychainAll(): Promise<number>;
    static UnlockKeychain(keychain: string, password: string): Promise<number>;
    static UnlockKeychain(password: string): Promise<number>;
    static SetKeychainTimeout(keychain: string, seconds: number): Promise<number>;
    static DeleteKeychain(keychain: string): Promise<number>;
    private static SetKeychain;
    static SetDefaultKeychain(keychain: string): Promise<number>;
    static ShowDefaultKeychain(): Promise<number>;
    static SetLoginKeychain(keychain: string): Promise<number>;
    static ShowLoginKeychain(): Promise<number>;
    static ShowListKeychains(): Promise<number>;
    static SetListKeychain(keychain: string): Promise<number>;
    static SetListKeychains(keychains: string[]): Promise<number>;
    static AllowAccessForAppleTools(keychain: string, password: string): Promise<number>;
    static FindGenericPassword(service: string): Promise<number>;
    static FindGenericPassword(service: string, keychain: string): Promise<number>;
    static ShowCodeSigning(keychain: string): Promise<number>;
}
