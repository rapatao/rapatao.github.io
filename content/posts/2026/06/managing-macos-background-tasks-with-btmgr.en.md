---
title: "BTManager: A Better Way to Manage macOS Background Tasks"
date: 2026-06-06T10:00:00Z
tags: [macos, go, tools, productivity]
url: "/posts/2026-06/managing-macos-background-tasks-with-btmgr/"
---

It started with a simple question: *what is that thing running in the background of my Mac?*

I had just uninstalled an app, but something from it was clearly still lurking, showing up in Activity Monitor, consuming resources, and behaving like it never left. I opened System Settings, went to Login Items & Extensions, and found the entry. I toggled it off. Problem solved, right?

Not quite. I still had no idea what executable it mapped to, where it lived on disk, or whether removing the toggle was actually enough. To answer those questions, I ended up running a handful of terminal commands, reading walls of JSON output, and manually cross-referencing information across multiple tools.

That's when I realized the problem wasn't the app I had installed, it was how difficult macOS makes it to inspect its own background task information.

## The Native Tooling Gap

macOS does expose everything you need to know about background tasks. The data is there. The issue is that accessing it means learning and combining several command-line tools:

```bash
# Dump all background task management records
sfltool dumpbtm

# Inspect a launch agent's plist
cat ~/Library/LaunchAgents/com.example.agent.plist

# Query a running service
launchctl print system/com.example.agent

# List plugin extensions
pluginkit -m -A -v
```

Each tool serves a different purpose, speaks a different output format, and answers only part of the question. Getting the full picture of a single service, its name, developer, Team ID, executable path, and configuration, means running several commands and mentally stitching the results together.

For a one-off investigation, it's manageable. But it's the kind of thing that comes up constantly, and the friction never goes away.

## Building Something Better

I decided to build a tool that I actually wanted to use. The goal was simple: one place where I could see everything macOS tracks as a background task, with enough detail to actually understand what I was looking at, and the controls to act on it.

The result is [BTManager](https://github.com/rapatao/btmgr).

It reads from the same Background Task Manager database that System Settings uses, so the data is always authoritative. But instead of a minimal toggle list, it gives you a full picture:

- **Filter by type**: Login Item, Launch Agent, Daemon, App, Background App Refresh, Developer Tool, QuickLook, Spotlight
- **Search** across names, identifiers, and developer information
- **Inspect** the full details of any service, including its plist configuration in a built-in viewer
- **Enable or disable** individual services
- **Remove** services entirely, including their plist files from disk

What used to be a multi-command investigation now fits in a single window.

## Try It

Pre-built releases are available on the [GitHub releases page](https://github.com/rapatao/btmgr/releases). Download, open, and your full list of background services is right there, no terminal required.

## Closing Thoughts

BTManager isn't trying to replace macOS's native tools. It's a layer on top of them, built for the moments when you just want to understand what's running on your own machine without spending ten minutes piecing together command output.

If that sounds familiar, give it a try. The project is open source at [github.com/rapatao/btmgr](https://github.com/rapatao/btmgr), and feedback is always welcome.