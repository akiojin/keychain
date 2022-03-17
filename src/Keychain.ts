import * as exec from '@actions/exec'
import { ArgumentBuilder } from '@akiojin/argument-builder'
import { default as KeychainFile } from './KeychainFile'

export default class Keychain
{
	static GenerateKeychainPath(name: string): string
	{
		return `${process.env.HOME}/Library/Keychains/${name}.keychain-db`
	}

	static GetDefaultLoginKeychainPath(): string
	{
		return this.GenerateKeychainPath('login')
	}

	static async CreateKeychain(keychain: string, password: string): Promise<KeychainFile>
	{
		if (password === '') {
			throw new Error('CreaterKeychain: Password required.')
		}

		const builder = new ArgumentBuilder()
		builder.Append('create-keychain')
		builder.Append('-p', password)
		builder.Append(keychain)

		await exec.exec('security', builder.Build())

		return this.OpenKeychain(keychain)
	}

	static OpenKeychain(keychain: string, password?: string): KeychainFile
	{
		return new KeychainFile(keychain, password)
	}

	static ImportCertificateFromFile(keychain: string, certificate: string, passphrase: string): Promise<number>
	{
		const builder = new ArgumentBuilder()
		builder.Append('import', certificate)
		builder.Append('-k', keychain)
		builder.Append('-P', passphrase)
		builder.Append('-f', 'pkcs12')
		builder.Append('-A')
		builder.Append('-T', '/usr/bin/codesign')
		builder.Append('-T', '/usr/bin/security')

		return exec.exec('security', builder.Build())
	}

	static ChangeKeychainPassword(keychain: string, oldPassword: string, newPassword: string)
	{
		const options: exec.ExecOptions = {
			input: Buffer.from(`${oldPassword}\n${newPassword}\n${newPassword}`)
		}

		const builder = new ArgumentBuilder()
		builder.Append('set-keychain-password')
		builder.Append(keychain)

		return exec.exec('security', builder.Build(), options)
	}

	static LockKeychain(keychain?: string): Promise<number>
	{
		const builder = new ArgumentBuilder()
		builder.Append('lock-keychain')

		if (keychain != null) {
			builder.Append(keychain)
		}

		return exec.exec('security', builder.Build())
	}

	static LockKeychainAll(): Promise<number>
	{
		const builder = new ArgumentBuilder()
		builder.Append('lock-keychain')
		builder.Append('-a')

		return exec.exec('security', builder.Build())
	}

	static UnlockKeychain(keychain: string, password: string): Promise<number>
	static UnlockKeychain(password: string): Promise<number>
	static UnlockKeychain(keychain?: string, password?: string): Promise<number>
	{
		if (password == null) {
			throw new Error('UnlockKeychain: Password required.')
		}

		const builder = new ArgumentBuilder()
		builder.Append('unlock-keychain')
		builder.Append('-p', password)

		if (keychain != null) {
			builder.Append(keychain)
		}

		return exec.exec('security', builder.Build())
	}

	static SetKeychainTimeout(keychain: string, seconds: number)
	{
		const builder = new ArgumentBuilder()
		builder.Append('set-keychain-settings')
		builder.Append('-lut', seconds.toString())
		builder.Append(keychain)

		return exec.exec('security', builder.Build())
	}

	static DeleteKeychain(keychain: string): Promise<number>
	{
		const builder = new ArgumentBuilder()
		builder.Append('delete-keychain')
		builder.Append(keychain)

		return exec.exec('security', builder.Build())
	}

	private static SetKeychain(name: string, keychain: string): Promise<number>
	{
		const builder = new ArgumentBuilder()
		builder.Append(name)
		builder.Append('-d', 'user')
		builder.Append('-s', keychain)

		return exec.exec('security', builder.Build())
	}

	static SetDefaultKeychain(keychain: string): Promise<number>
	{
		return this.SetKeychain('default-keychain', keychain)
	}

	static ShowDefaultKeychain(): Promise<number>
	{
		return exec.exec('security', ['default-keychain'])
	}

	static SetLoginKeychain(keychain: string): Promise<number>
	{
		return this.SetKeychain('login-keychain', keychain)
	}

	static ShowLoginKeychain(): Promise<number>
	{
		const builder = new ArgumentBuilder()
		builder.Append('login-keychain')

		return exec.exec('security', builder.Build())
	}

	static ShowListKeychains(): Promise<number>
	{
		const builder = new ArgumentBuilder()
		builder.Append('list-keychains')
		builder.Append('-d', 'user')

		return exec.exec('security', builder.Build())
	}

	static SetListKeychain(keychain: string): Promise<number>
	{
		const builder = new ArgumentBuilder()
		builder.Append('list-keychains')
		builder.Append('-d', 'user')
		builder.Append('-s', keychain)

		return exec.exec('security', builder.Build())
	}

	static SetListKeychains(keychains: string[]): Promise<number>
	{
		const builder = new ArgumentBuilder()
		builder.Append('list-keychains')
		builder.Append('-d', 'user')
		builder.Append('-s')
		builder.Append(keychains)

		return exec.exec('security', builder.Build())
	}

	static AllowAccessForAppleTools(keychain: string, password: string): Promise<number>
	{
		const builder = new ArgumentBuilder()
		builder.Append('set-key-partition-list')
		builder.Append('-S', 'apple-tool:,apple:')
		builder.Append('-s')
		builder.Append('-k', password)
		builder.Append(keychain)

		return exec.exec('security', builder.Build())
	}

	static FindGenericPassword(service: string): Promise<number>
	static FindGenericPassword(service: string, keychain: string): Promise<number>
	static FindGenericPassword(service: string, keychain?: string): Promise<number>
	{
		const builder = new ArgumentBuilder()
		builder.Append('find-generic-password')
		builder.Append('-s', `"${service}"`)

		if (keychain != null) {
			builder.Append(keychain)
		}

		return exec.exec('security', builder.Build())
	}

	static ShowCodeSigning(keychain: string): Promise<number>
	{
		const builder = new ArgumentBuilder()
		builder.Append('find-identity')
		builder.Append('-p')
		builder.Append('codesigning')
		builder.Append('-v', keychain)

		return exec.exec('security', builder.Build())
	}
}
