export default class KeychainFile {
    #private;
    static Open(keychain: string, password?: string): Promise<KeychainFile>;
    constructor(keychain: string, password?: string);
    GetPath(): string;
    GetName(): string;
    SetPassword(password: string): void;
    ChangePassword(oldPassword: string, newPassword: string): Promise<number>;
    Lock(): Promise<number>;
    Unlock(password?: string): Promise<number>;
    SetTimeout(seconds: number): Promise<number>;
    SetDefault(): Promise<number>;
    SetLogin(): Promise<number>;
    SetList(): Promise<number>;
    ImportCertificateFromFile(certificate: string, passphrase: string): Promise<number>;
    AllowAccessForAppleTools(password?: string): Promise<number>;
    FindGenericPassword(service: string): Promise<number>;
    ShowCodeSigning(): Promise<number>;
}
