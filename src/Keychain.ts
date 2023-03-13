import * as exec from '@actions/exec'
import * as path from 'path'
import { ArgumentBuilder } from '@akiojin/argument-builder'

export default class Keychain
{
	static GenerateKeychainPath(keychain: string): string
	{
		const tmp = !path.dirname(keychain) ? `${process.env.HOME}/Library/Keychains/${keychain}` : keychain
		return !path.extname(tmp) ? `${tmp}.keychain-db` : tmp
	}

	static GetDefaultLoginKeychainPath(): string
	{
		return this.GenerateKeychainPath('login.keychain-db')
	}

	static async CreateKeychain(keychain: string, password: string): Promise<string>
	{
		if (!password) {
			throw new Error('CreaterKeychain: Password required.')
		}

		keychain = this.GenerateKeychainPath(keychain)

		const builder = new ArgumentBuilder()
			.Append('create-keychain')
			.Append('-p', password)
			.Append(keychain)

		await exec.exec('security', builder.Build())

		return keychain
	}

	static ImportCertificateFromFile(keychain: string, certificate: string, passphrase: string): Promise<number>
	{
		const builder = new ArgumentBuilder()
			.Append('import', certificate)
			.Append('-k', keychain)
			.Append('-P', passphrase)
			.Append('-f', 'pkcs12')
			.Append('-A')
			.Append('-T', '/usr/bin/codesign')
			.Append('-T', '/usr/bin/security')

		return exec.exec('security', builder.Build())
	}

	static ChangeKeychainPassword(keychain: string, oldPassword: string, newPassword: string): Promise<number>
	{
		const options: exec.ExecOptions = {
			input: Buffer.from(`${oldPassword}\n${newPassword}\n${newPassword}`)
		}

		const builder = new ArgumentBuilder()
			.Append('set-keychain-password')
			.Append(keychain)

		return exec.exec('security', builder.Build(), options)
	}

	static LockKeychain(keychain?: string): Promise<number>
	{
		const builder = new ArgumentBuilder()
			.Append('lock-keychain')

		if (keychain != null) {
			builder.Append(keychain)
		}

		return exec.exec('security', builder.Build())
	}

	static LockKeychainAll(): Promise<number>
	{
		const builder = new ArgumentBuilder()
			.Append('lock-keychain')
			.Append('-a')

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
			.Append('unlock-keychain')
			.Append('-p', password)

		if (keychain != null) {
			builder.Append(keychain)
		}

		return exec.exec('security', builder.Build())
	}

	static SetKeychainTimeout(keychain: string, seconds: number)
	{
		const builder = new ArgumentBuilder()
			.Append('set-keychain-settings')
			.Append('-lut', seconds.toString())
			.Append(keychain)

		return exec.exec('security', builder.Build())
	}

	static DeleteKeychain(keychain: string): Promise<number>
	{
		const builder = new ArgumentBuilder()
			.Append('delete-keychain')
			.Append(keychain)

		return exec.exec('security', builder.Build())
	}

	private static async GetKeychain(name: string): Promise<string[]>
	{
		const builder = new ArgumentBuilder()
			.Append(name)
			.Append('-d', 'user')

		let output = ''
		const options: exec.ExecOptions = {}
		options.listeners = {
			stdout: (data: Buffer) => {
				output += data.toString()
			}
		}

		try {
			await exec.exec('security', builder.Build(), options)
		} catch (err: any) {
			return []
		}

		let keychains: string[] = []

		if (!!output) {
			for (const i of output.split('\n')) {
				const tmp = i.trim().replace(/"(.*)"/, '$1')
				if (!!tmp) {
					keychains.push(tmp)
				}
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
			.Append(name)
			.Append('-d', 'user')
			.Append('-s', keychain)

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
			.Append('login-keychain')

		return exec.exec('security', builder.Build())
	}

	static ShowListKeychains(): Promise<number>
	{
		const builder = new ArgumentBuilder()
			.Append('list-keychains')
			.Append('-d', 'user')

		return exec.exec('security', builder.Build())
	}

	static SetListKeychain(keychain: string): Promise<number>
	{
		const builder = new ArgumentBuilder()
			.Append('list-keychains')
			.Append('-d', 'user')
			.Append('-s', keychain)

		return exec.exec('security', builder.Build())
	}

	static SetListKeychains(keychains: string[]): Promise<number>
	{
		const builder = new ArgumentBuilder()
			.Append('list-keychains')
			.Append('-d', 'user')
			.Append('-s')
			.Append(keychains)

		return exec.exec('security', builder.Build())
	}

	static AllowAccessForAppleTools(keychain: string, password: string): Promise<number>
	{
		const builder = new ArgumentBuilder()
			.Append('set-key-partition-list')
			.Append('-S', 'apple-tool:,apple:')
			.Append('-s')
			.Append('-k', password)
			.Append(keychain)

		return exec.exec('security', builder.Build())
	}

	static FindGenericPassword(service: string): Promise<number>
	static FindGenericPassword(service: string, keychain: string): Promise<number>
	static FindGenericPassword(service: string, keychain?: string): Promise<number>
	{
		const builder = new ArgumentBuilder()
			.Append('find-generic-password')
			.Append('-s', `"${service}"`)

		if (keychain != null) {
			builder.Append(keychain)
		}

		return exec.exec('security', builder.Build())
	}

	static ShowCodeSigning(): Promise<number>
	{
		const builder = new ArgumentBuilder()
			.Append('find-identity')
			.Append('-p')
			.Append('codesigning')
			.Append('-v')

		return exec.exec('security', builder.Build())
	}


    static async GetCodeSigning(): Promise<string>
    {
        const builder = new ArgumentBuilder()
            .Append('find-identity')
            .Append('-p')
            .Append('codesigning')
            .Append('-v')

        let output = ''
        const options: exec.ExecOptions = {}
        options.listeners = {
            stdout: (data: Buffer) => {
                output += data.toString()
            }
        }

        try {
            await exec.exec('security', builder.Build(), options)
        } catch (err: any) {
            return ''
        }

        return output
    }
}
