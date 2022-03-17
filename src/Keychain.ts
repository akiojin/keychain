import * as exec from '@actions/exec'
import * as path from 'path'
import { ArgumentBuilder } from '@akiojin/argument-builder'

export default class Keychain
{
	static GenerateKeychainPath(keychain: string): string
	{
		return path.dirname(keychain) === '' ?
			`${process.env.HOME}/Library/Keychains/${keychain}.keychain-db` : keychain
	}

	static GetDefaultLoginKeychainPath(): string
	{
		return this.GenerateKeychainPath('login')
	}

	static async CreateKeychain(keychain: string, password: string): Promise<string>
	{
		if (password === '') {
			throw new Error('CreaterKeychain: Password required.')
		}

		keychain = this.GenerateKeychainPath(keychain)

		const builder = new ArgumentBuilder()
		builder.Append('create-keychain')
		builder.Append('-p', password)
		builder.Append(keychain)

		await exec.exec('security', builder.Build())

		return keychain
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

	static ChangeKeychainPassword(keychain: string, oldPassword: string, newPassword: string): Promise<number>
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

	private static async GetKeychain(name: string): Promise<string[]>
	{
		const builder = new ArgumentBuilder()
		builder.Append(name)
		builder.Append('-d', 'user')

		let output = ''
		const options: exec.ExecOptions = {}
		options.listeners = {
			stdout: (data: Buffer) => {
				output += data.toString()
			}
		}

		await exec.exec('security', builder.Build(), options)

		let keychains: string[] = []

		if (output !== '') {
			for (const i of output.split('\n')) {
				keychains.push(i.trim().replace(/"(.*)"/, '$1'))
			}
		}

		return keychains;
	}

	static async GetDefaultKeychain(): Promise<string[]>
	{
		return this.GetKeychain('default-keychain')
	}

	static async GetLoginKeychain(): Promise<string[]>
	{
		return this.GetKeychain('login-keychain')
	}

	static async GetListKeychain(): Promise<string[]>
	{
		return this.GetKeychain('list-keychains')
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
