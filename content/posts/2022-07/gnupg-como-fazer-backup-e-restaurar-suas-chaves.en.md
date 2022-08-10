---
title: "GnuPG: how to backup and restore your keys?"
date: 2022-07-31T12:00:00-03:00
tags:
    - security
    - encryption
images: 
  - src: "/images/posts/pexels-lucas-seebacher-5599449.jpeg"
    alt: "GnuPG: how to backup and restore your keys?"
url: "/posts/2022-07/gnupg-how-to-backup-and-restore-your-keys/"
aliases:
  - "/posts/2022-07/gnupg-como-fazer-backup-e-restaurar-suas-chaves/"
---

Recently, I had to transfer my private keys to a different computer. Since this looks like a trivial task (it was my first time doing it), I have decided to search for a "how-to" blog post that details the steps required for this task. After a few minutes, I got shocked that it seems to be a task that people don't usually do, they seem to transfer only one key at once, never the whole key-ring.

It took more time than expected to find the commands required to transfer all my key-ring, probably more than it would take if I transfer each key individually, but I finally have it.

## Exporting the keys

The following command generates a single file that contains all your keys:

```bash
gpg --export-options backup -o ~/keyring.gpg --export-secret-keys
```

The export process will ask for the passphrase of your keys and generates a single file **keyring.gpg** in the user $HOME directory.

## Importing the keys

After the exporting process succeeds, copy the generated file to its destination and proceed with the importing process, using the following command:

```bash
gpg --import ~/keyring.gpg
```

As in the exporting process, the passphrases are mandatory in the import process.

## List the keys

Simple as is, your keys are now available, and you can check them using the following command:

```bash
gpg --list-secret-keys
```
There is probably a better way to transfer and store your keys, but this process could be useful for you and is simple to execute.

The file that was generated in the export process can be stored, just be careful to store it in a safe and trusted location. Remember: *There are your keys!*

## References:

- [GPG Input and Output (Using the GNU Privacy Guard)](https://www.gnupg.org/documentation/manuals/gnupg/GPG-Input-and-Output.html)