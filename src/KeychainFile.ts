import * as path from 'path'
import * as fs from 'fs/promises'
import Keychain from './Keychain'

export default class KeychainFile
{
	#keychain: string = ''
	#password: string = ''

	static async Open(keychain: string, password?: string): Promise<KeychainFile>
	{
		await fs.access(keychain)
		return new KeychainFile(keychain, password)
	}

	constructor(keychain: string, password?: string)
	{
		this.#keychain = Keychain.GenerateKeychainPath(keychain)
		this.#password = password ?? ''
	}

	GetPath(): string
	{
		return this.#keychain
	}

	GetName()
	{
		return path.basename(this.#keychain)
	}

	SetPassword(password: string): void
	{
		this.#password = password
	}

	async ChangePassword(oldPassword: string, newPassword: string): Promise<number>
	{
		const result = await Keychain.ChangeKeychainPassword(this.#keychain, oldPassword, newPassword)

		if (result === 0) {
			this.SetPassword(newPassword)
		}

		return result;
	}

	Lock(): Promise<number>
	{
		return Keychain.LockKeychain(this.#keychain)
	}

	Unlock(password?: string): Promise<number>
	{
		return Keychain.UnlockKeychain(this.#keychain, password ?? this.#password)
	}

	SetTimeout(seconds: number): Promise<number>
	{
		return Keychain.SetKeychainTimeout(this.#keychain, seconds)
	}

	SetDefault(): Promise<number>
	{
		return Keychain.SetDefaultKeychain(this.#keychain)
	}

	SetLogin(): Promise<number>
	{
		return Keychain.SetLoginKeychain(this.#keychain)
	}

	SetList(): Promise<number>
	{
		return Keychain.SetListKeychain(this.#keychain)
	}

	ImportCertificateFromFile(certificate: string, passphrase: string): Promise<number>
	{
		return Keychain.ImportCertificateFromFile(this.#keychain, certificate, passphrase)
	}

	AllowAccessForAppleTools(password?: string): Promise<number>
	{
		return Keychain.AllowAccessForAppleTools(this.#keychain, password ?? this.#password)
	}

	FindGenericPassword(service: string): Promise<number>
	{
		return Keychain.FindGenericPassword(service, this.#keychain)
	}

	ShowCodeSigning(): Promise<number>
	{
		return Keychain.ShowCodeSigning(this.#keychain)
	}
}
