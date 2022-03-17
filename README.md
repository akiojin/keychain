# keychain
This package uses the security command to manipulate the keychain.

## Usage
### Import
```js
import { Keychain, KeychainFile } from '@akiojin/keychain'
```

### `Keychain`
```js
const keychain = Keychain.GenerateKeychainPath('test')
const password = 'ABC0123'

await Keychain.CreateKeychain(keychain, password)
await Keychain.UnlockKeychain(keychain, password)
await Keychain.SetKeychainTimeout(keychain, 21600)
await Keychain.SetDefaultKeychain(keychain)
await Keychain.SetLoginKeychain(keychain)
await Keychain.SetListKeychain(keychain)
await Keychain.DeleteKeychain(keychain)

await Keychain.SetDefaultKeychain(Keychain.GetDefaultLoginKeychainPath())
```

### `KeychainFile`
```js
const keychain = await Keychain.CreateKeychain('<Keychain name or path>', '<Password>')
keychain.Lock()
keychain.Unlock()
keychain.SetDefault()
```
```js
const keychain = await Keychain.OpenKeychain('<Keychain name or path>')
keychain.Lock()
keychain.Unlock('<Password>')
keychain.SetDefault()
```

## Reference
### class `Keychain`
#### `static GenerateKeychainPath(name: string): string`
##### Description
Returns the keychain path given the keychain name.
This method does not create the keychain, only generates the path.

##### Arguments
|Name|Type|Description|
|:--|:--|:--|
|`name`|`string`|The keychain name.|

##### Return
|Type|Description|
|:--|:--|
|`string`|keychain path|


#### `static GetDefaultLoginKeychainPath(): string`
##### Description
Returns the path to `login.keychain-db`, which exists by default.

##### Return
|Type|Description|
|:--|:--|
|`string`|keychain path|


#### `static ImportCertificateFromFile(keychain: string, certificate: string, passphrase: string): Promise<number>`
##### Description
Import the certificate into the specified keychain.
The keychain must be unlocked.

##### Arguments
|Name|Type|Description|
|:--|:--|:--|
|`keychain`|`string`|Path of the keychain. If no path is specified and only the keychain name is given, it is searched from `~/Library/Keychains/`.|
|`certificate`|`string`|Certificate Path|
|`passphrase`|`string`|Certificate passphrase|

##### Return
|Type|Description|
|:--|:--|
|`number`|Exit code|


#### `static LockKeychain(keychain?: string): Promise<number>`
##### Description
Lock keychain.
If `keychain` is omitted, locks default keychains.

##### Arguments
|Name|Type|Description|
|:--|:--|:--|
|`keychain?`|`string`|Path of the keychain. If no path is specified and only the keychain name is given, it is searched from `~/Library/Keychains/`.|

##### Return
|Type|Description|
|:--|:--|
|`number`|Exit code|


#### `static LockKeychainAll(): Promise<number>`
##### Description
Locks all keychains.

##### Return
|Type|Description|
|:--|:--|
|`number`|Exit code|


#### `static UnlockKeychain(keychain: string, password: string): Promise<number>`
#### `static UnlockKeychain(password: string): Promise<number>`
#### `static UnlockKeychain(keychain?: string, password?: string): Promise<number>`
##### Description
Unlock the keychain.
Unlock the default keychain if the keyholder is omitted.

##### Arguments
|Name|Type|Description|
|:--|:--|:--|
|`keychain`|`string`|Path of the keychain. If no path is specified and only the keychain name is given, it is searched from `~/Library/Keychains/`.|
|`password`|`string`|Keychain password|

##### Return
|Type|Description|
|:--|:--|
|`number`|Exit code|


#### `static CreateKeychain(keychain: string, password: string): Promise<number>`
##### Description
Create a new keychain and set a password.
Immediately after creation, the keychain is unlocked.

##### Arguments
|Name|Type|Description|
|:--|:--|:--|
|`keychain`|`string`|Path of the keychain. If only the keychain name is specified, it will be placed in `~/Library/Keychains`.|
|`password`|`string`|Keychain password|

##### Return
|Type|Description|
|:--|:--|
|`number`|Exit code|


#### `static SetKeychainTimeout(keychain: string, seconds: number)`
##### Description
Sets the number of timeout seconds before the keychain locks without operation.
This setting also sets the lock at sleep at the same time.

##### Arguments
|Name|Type|Description|
|:--|:--|:--|
|`keychain`|`string`|Path of the keychain. If no path is specified and only the keychain name is given, it is searched from `~/Library/Keychains/`.|
|`seconds`|`number`|Timeout in seconds (omitting this option specifies "no timeout")|

##### Return
|Type|Description|
|:--|:--|
|`number`|Exit code|


#### `static DeleteKeychain(keychain: string): Promise<number>`
##### Description
Deletes the specified keychain.

##### Arguments
|Name|Type|Description|
|:--|:--|:--|
|`keychain`|`string`|Path of the keychain. If no path is specified and only the keychain name is given, it is searched from `~/Library/Keychains/`.|

##### Return
|Type|Description|
|:--|:--|
|`number`|Exit code|


#### `static SetDefaultKeychain(keychain: string): Promise<number>`
##### Description
Sets the specified keychain as the default keychain.

##### Arguments
|Name|Type|Description|
|:--|:--|:--|
|`keychain`|`string`|Path of the keychain. If no path is specified and only the keychain name is given, it is searched from `~/Library/Keychains/`.|

##### Return
|Type|Description|
|:--|:--|
|`number`|Exit code|


#### `static ShowDefaultKeychain(): Promise<number>`
##### Description
Display the default keychain on the console.

##### Return
|Type|Description|
|:--|:--|
|`number`|Exit code|


#### `static SetLoginKeychain(keychain: string): Promise<number>`
##### Description
Set the specified keychain as the login keychain.

##### Arguments
|Name|Type|Description|
|:--|:--|:--|
|`keychain`|`string`|Path of the keychain. If no path is specified and only the keychain name is given, it is searched from `~/Library/Keychains/`.|

##### Return
|Type|Description|
|:--|:--|
|`number`|Exit code|


#### `static ShowLoginKeychain(): Promise<number>`
##### Description
Display the login keychain on the console.

##### Return
|Type|Description|
|:--|:--|
|`number`|Exit code|


#### `static SetListKeychain(keychain: string): Promise<number>`
##### Description
Set in the key chain list.
This method overrides any other keychain list that may have been set.

##### Arguments
|Name|Type|Description|
|:--|:--|:--|
|`keychain`|`string`|Path of the keychain. If no path is specified and only the keychain name is given, it is searched from `~/Library/Keychains/`.|

##### Return
|Type|Description|
|:--|:--|
|`number`|Exit code|


#### `static SetListKeychains(keychains: string[]): Promise<number>`
##### Description
Set in the key chain list.
This method overrides any other keychain list that may have been set.

##### Arguments
|Name|Type|Description|
|:--|:--|:--|
|`keychains`|`string[]`|Path of the keychain. If no path is specified and only the keychain name is given, it is searched from `~/Library/Keychains/`.|

##### Return
|Type|Description|
|:--|:--|
|`number`|Exit code|


#### `static AllowAccessForAppleTools(keychain: string, password: string): Promise<number>`
##### Description
Set permissions for Apple tools for the keychain.
Since this method is an access permission to the signature, the signature must have been imported in advance.

##### Arguments
|Name|Type|Description|
|:--|:--|:--|
|`keychain`|`string`|Path of the keychain. If no path is specified and only the keychain name is given, it is searched from `~/Library/Keychains/`.|
|`password`|`string`|Keychain password|

##### Return
|Type|Description|
|:--|:--|
|`number`|Exit code|


#### `static FindGenericPassword(service: string): Promise<number>`
##### Description
Retrieves passwords for specified services and displays them in the console.

##### Arguments
|Name|Type|Description|
|:--|:--|:--|
|`service`|`string`|Services to search|

##### Return
|Type|Description|
|:--|:--|
|`number`|Exit code|


#### `static ShowCodeSigning(keychain: string): Promise<number>`
##### Description
Displays a list of certificates imported into the specified keychain.

##### Arguments
|Name|Type|Description|
|:--|:--|:--|
|`keychain`|`string`|Path of the keychain. If no path is specified and only the keychain name is given, it is searched from `~/Library/Keychains/`.|

##### Return
|Type|Description|
|:--|:--|
|`number`|Exit code|
