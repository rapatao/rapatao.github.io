---
title: "Your dotfiles under control"
date: 2020-08-15T15:00:00-03:00
tags:
  - dotfiles
  - yadm
  - shell
images:
  - "/images/posts/pexels-pixabay-207580.jpg"
url: "/posts/2020-08/your-dotfiles-under-control/"
---

Many developers throughout their career end up creating many *scripts*, *aliases* and customizations in their development environments. These settings are normally kept in files, and when this user changes their environment, they sometimes make a copy of these files to the new environment. This process tends to be done by copying your files from one environment to another.

Although it works, there is a more practical way to manage these files, making the proper associations as needed, including supporting different profiles. That is, it is possible to create a *dotfile* with different profiles, defining different settings according to your needs. An example of this use would be to build a profile for your personal environment, another for your professional environment, changing server access keys and *commits* signature settings in *git*.

## What are dotfiles

On Unix-based systems, it is common for settings to be kept in files starting with a period (.). These files or folders are considered to be “hidden” and are not normally listed using commands such as *ls*, unless specified to be displayed.

Examples of files and folders starting with a dot (.):

```bash
.gitignore
.m2
.bashrc
.zshrc
```

This doesn't mean that your files need to start with a period (.) and in fact there are many people who don't define it that way, separating them into folders with matching names, like, for example, “*$HOME/etc”*. Particularly, I prefer to keep such files inside a folder starting with a period (.), specifically “*$HOME/.dotifiles.d*”, as this folder is not listed by default, so it will not be noticed most of the time, generating in me a sense of organization.

## A dotfiles manager

As said before, there are several ways to manage your *dotfiles*, either manually or automatically with the help of applications. Using a version controller, such as *git* is an interesting way to do it, however, we will still need to perform the links manually in each installed environment.

Although it is possible to version your *$HOME*, by doing this, by default, your list of ignored files would be extremely long, in addition to the risk of adding inappropriate files to our repository. Using the versatility that *git* offers us, but without the difficulty of having to add several files and directories to our *gitignore*, *[yadm (Yet Another Dotfiles Manager)](https://yadm.io/)* helps us in the task of managing our settings, with a number of interesting additional features.

As a kind of "shell" of *Git*, with *yadm* you will be able to version your *$HOME* in a simplified way, with the ability to add encryption to sensitive files, such as access key, use alternative files according to the environment which your *dotfiles* are being used, in addition to knowing exactly what has changed before updating your settings repository.

## Installing yadm

There are several ways to install *yadm*, from using package managers like *Homebrew and apt-get* to downloading the file to a folder on your device. All these ways can be found in the official documentation [here](https://yadm.io/docs/install).

Each operating system offers a way to install, which ends up facilitating the *yadm* update process and below is the installation method with greater compatibility, that is, regardless of whether your operating system is macOS, Ubuntu, Arch Linux or FreeBSD.

```bash
$ curl -fLo /usr/local/bin/yadm https://github.com/TheLocehiliosan/yadm/raw/master/yadm && chmod a+x /usr/local/bin/yadm
```

*yadm* requires that *Git* be installed on your system and when trying to run without this dependency, the following error message will be displayed:

```bash
$ yadm version
/usr/local/bin/yadm: line 909: git: command not found
ERROR: This functionality requires Git to be installed, but the command 'git' cannot be located
```

With *Git* installed the message should be as follows:

```bash
$ yadm version
yadm 2.5.0
```

## Adding your first files

The commands used to start a repository, add files, perform *commit* as well as send and download updates from a repository are the same commands available in *Git*, only started with *yadm*.

To start your first repository, the following command must be run:

```bash
$ yadm init
Initialized empty shared Git repository in /home/rapatao/.config/yadm/repo.git/
```

Once initialized, you can add all the files that you consider important and should be versioned, this usually includes files like, for example: *.bashrch and .zshrc*

To add files, just run the command below, where *<file>* should be replaced by the file you want to version.

```bash
$ yadm add <file>
```

After adding the files, it's time to perform your first *commit* and for that, just run the following command:

```bash
$ yadm commit -m "primeiro commit"
[master (root-commit) 506b780] primeiro commit
 1 file changed, 117 insertions(+)
 create mode 100644 .bashrc
```

If your *Git* is not correctly configured, the message below will be displayed, informing you that your email and name were not configured, preventing your *commit* from being performed. To solve it, just run the command as instructed in the message and repeat the procedure, thus achieving your *commit*.

```bash
$ yadm commit -m "primeiro commit"

*** Please tell me who you are.

Run

  git config --global user.email "you@example.com"
  git config --global user.name "Your Name"

to set your account's default identity.
Omit --global to set the identity only in this repository.

fatal: unable to auto-detect email address (got 'rapatao@89122a756847.(none)')
```

## Your settings in a remote repository

One of the advantages of *Git* is that you can have a local repository and a copy of this repository remotely. This is extremely helpful in ensuring that your files can be accessed from virtually anywhere.

To upload your files to a remote repository, you can use services available on the Internet, such as GitHub, BitBucket or GitLab. The procedure is similar to the one performed with the *Git* command, only a remote repository needs to exist. Example:

```bash
$ yadm remote add origin <url>
$ yadm push -u origin master
```

## Your settings in a new environment

With the advent of the decentralized repository, to install your files in a new environment, just run the following command:

```bash
$ yadm clone <url>
```

The command will clone the repository locally and the versioned files will be copied to the appropriate locations, that is, everything you configured will be automatically replicated to this new environment and all you had to do was install *yadm*.

It is important to note that when performing the *clone*, *yadm* will try to perform a *merge* with the pre-existing files in the new environment, which may cause conflicts or even fail in the process. Normally these files will, in fact, be replaced by the content you previously versioned, so the simplest way to solve such a problem is to delete such existing files locally before performing the clone.

## Different systems with different files

One of the great advantages of *yadm* is the possibility of having files with different configurations and these being used according to a pre-defined rule. For example, it is possible to create *Git* configuration files and, depending on the environment, one of these files will be used.

Let's assume that you use *macOS* at home and *Linux* at your company. When you are at home, you would like to have your *commits* signed with the email “*luiz@example.com*” and when you are at the company with “*luiz.empresa@example.com*”.

To do this, just create the files with the appropriate differences and save them using the following pattern:

```bash
<file>##<condition>[,<condition>,...]
```

The full list of conditions can be found [here](https://yadm.io/docs/alternates).

In the scenario reported above, we will have the following files:

```bash
$ ls -a .gitconfig*
.gitconfig##os.Darwin  .gitconfig##os.Linux
```

Now we just manage these files with *yadm* and that's it, a symbolic link will be created pointing to the file for which the condition is true.

```bash
$ yadm add .gitconfig*
$ ls -la .gitconfig*
lrwxrwxrwx 1 rapatao rapatao 20 Aug 15 17:25 .gitconfig -> .gitconfig##os.Linux
-rw-rw-r-- 1 rapatao rapatao 57 Aug 15 17:18 .gitconfig##os.Darwin
-rw-rw-r-- 1 rapatao rapatao 57 Aug 15 17:18 .gitconfig##os.Linux
```

As we can see, when we added the file, *yadm* automatically created a symbolic link pointing from "*.gitconfig"* to "*.gitconfig##os.Linux".*

## Conclusion

As we can see so far, using *yadm* can help control our settings, bringing together all the potential that *Git* offers us, such as change control and content distribution, as well as several other features, such as the example above , where we “customize” our settings based on the operating system we are running.

In addition to the resources mentioned above, there are others and although I do not describe them in this text, I believe they can be interesting for almost all users:

- [Encryption](https://yadm.io/docs/encryption): Encrypts sensitive content. Useful for versioning SSH keys, since to decode, you will need to supply a user-defined password.
- [Bootstrap](https://yadm.io/docs/bootstrap): A *script* that can be run when cloning a repository. Useful to install applications normally used and/or necessary for the correct functioning of your environment.

I believe I have talked about the main topics about dotfiles and how to manage them using *yadm*. For more details, I recommend checking the official website [yadm.io](https://yadm.io/), but feel free to ask me something directly about it.
