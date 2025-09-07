function New-PasswordHash {
    param([SecureString]$Password)

    $saltBytes = New-Object byte[] 32
    [System.Security.Cryptography.RNGCryptoServiceProvider]::new().GetBytes($saltBytes)
    $salt = [System.BitConverter]::ToString($saltBytes) -replace '-',''

    if ($null -eq $Password) {
        $Password = Read-Host "Passwort:" -AsSecureString
    }

    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($Password)
    $plain = [System.Runtime.InteropServices.Marshal]::PtrToStringBSTR($BSTR)
    [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR)

    $passwordBytes = [System.Text.Encoding]::UTF8.GetBytes($plain)
    $saltBytesForHash = [System.Convert]::FromHexString($salt)

    $pbkdf2 = New-Object System.Security.Cryptography.Rfc2898DeriveBytes($passwordBytes, $saltBytesForHash, 10000, [System.Security.Cryptography.HashAlgorithmName]::SHA512)
    $hashBytes = $pbkdf2.GetBytes(64)
    $hash = [System.BitConverter]::ToString($hashBytes) -replace '-',''

    Write-Host "Salt: $salt"
    Write-Host "Hash: $hash"
}

New-PasswordHash