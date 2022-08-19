---
title: "Build virtual machines (VM's) using QEMU"
date: 2020-09-06T21:00:00-03:00
tags:
    - virtualization
images: 
  - src: "/images/posts/qemu.jpg"
    alt: "QEMU"
    stretch: "vertical"
url: "/posts/2020-09/build-virtual-machines-using-qemu/"
---

Recently I needed to perform some simple tests of an application that only worked on Windows and as I don't have this environment, I decided to create a VM with Windows 10. My first idea was to use [VirtualBox](https://www.virtualbox.org/) , however, for some reason, I couldn't start the installer at all, always generating a random error or else the screen was like the hiss of a TV, but colorful and without sound.

This problem prevented me from proceeding with the installation and almost made me give up on the test I was going to perform, however, I decided to test create a VM using [QEMU](https://www.qemu.org/).

Although there are interfaces (GUI) to configure VM's for QEMU, I didn't find any of the alternatives I know in Homebrew ([aqemu](https://github.com/tobimensch/aqemu), [virt-manager](https ://virt-manager.org/)) and to carry out my test, I decided to do the procedure manually.

## What is QEMU

It can be said that QEMU is an open source, cross-platform application that serves to emulate machines (VM) and virtualize instructions from other platforms, such as, for example, emulating ARM and PowerPC instructions in x86 environments.

## Installing QEMU

Installation can be done in several ways, all of which can be found [here](https://www.qemu.org/download/). In this text, I will describe how to install on macOS using Homebrew and Linux systems, which are based on Debian/Ubuntu.

```bash
# macOS
brew install qemu

# Debian/Ubuntu
apt-get install qemu
```

## Creating an operating system installation disk

We use the `qemu-img` command for this, for example:

```bash
qemu-img create -f qcow2 windows10.qcow2 30G
```

In the above command, we are creating a file, called `windows10.qcow2` with 30G. This file will be used to install Windows 10.

## Installing the operating system on the created disk

At this point, we must pay attention to the system that will be virtualized, being necessary to execute the command accordingly. For example, if the installation is Windows 10 64-bit, the command should be `qemu-system-x86_64`, in case the environment is ARM-based, the command would be: `qemu-system-arm`.

For my scenario, I will install Windows 10 64-bit, so the command I will run will be the following:

```bash
qemu-system-x86_64 -hda windows10.qcow2 -m 4G -cdrom ~/Downloads/tibia/Win10_2004_EnglishInternational_x64.iso -boot c
```

In the above command, QEMU will simulate a 64-bit environment, with 4G of RAM, using the file created previously as a disk and the ISO file, [downloaded from Microsoft's website](https://www.microsoft.com/pt -br/software-download/windows10ISO), which contains the installation image, will be presented to the system as if it were a CD.

## Booting the installed system

After the whole procedure, if you do not close QEMU, you will normally access your virtual machine, however, after closed, if you want to access again, just run the following command:

```bash
qemu-system-x86_64 -m 4G -hda windows10.qcow2
```

## Conclusion

As seen, related to virtualization, there is a free alternative to VirtualBox that can often meet our needs for creating and running virtual machines. Despite its greater complexity, knowing QEMU can be useful for situations where we don't have a friendlier solution to create our VMs.

To learn more about QEMU, I recommend looking at the official Wiki: [https://wiki.qemu.org/Main_Page](https://wiki.qemu.org/Main_Page)
