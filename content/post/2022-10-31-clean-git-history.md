+++
title = "This is how you get a clean git history"
description = "Cleaning up your git history, and why it matters."
author = "Morten Dæhli Aslesen"
date = 2022-10-31T16:58:13.000Z
tags = ["git", "teamwork"]
draft = false
+++

Communication is a core pillar when it comes to working as a team. Without good communication it is almost
impossible for a team to achieve great things. As developers, we are lucky to have many tools helping us to become great
communicators and good team players. One of those tools are git. It's infamous for being counter-intuitive and easy to
screw up. It's quite fitting that [Oh Shit, Git!?!](https://ohshitgit.com/) has helped many developers in dire need of git
guidance.

There are many important topics that should be covered, but today I want to  talk specifically about getting a clean
git history.

Note: I'm writing this from the perspective of [Trunk Based Development](https://trunkbaseddevelopment.com/) and
short-lived feature branches. If you do long-living feature branches, GitFlow, or similar. I'm sorry, you are on your own...

## Why does it matter?
A well written and clean git history makes it easy to track down inevitable bugs, revert changes, patch releases,
automate releases, and to write great user-friendly release notes!

## Merging vs. rebasing
There are in general two strategies when it comes to merging the work done in two branches. You can either rebase onto,
or merge a feature branch into the main working branch. They both achieve the same thing, but in a quite different way.
Let us have a look on both.

Say you have a main branch and a feature branch.

    git switch -c feature

You then do some work on your branch while your teammates makes changes to the main branch. Your git history may
end up looking like this:

```goat
                    feature
              *----*----*
             /           
            /             
 o----o----o----o----o----o
                          main
                     
```

### Git merge

Merging is the easiest option when integrating your work into the main branch. What git merge does is that it safeguards
both the commit history in your branch and the history of the main branch, and it looks like this:

    git merge main

This will merge the main branch into the feature branch by creating a new commit in the current branch:

```goat
                    feature
              *----*----*----* new commit
             /              ^
            /              /
 o----o----o----o----o----o
                          main
                     
```

This is great! Job well done! 😃 Well, not so fast... This may get really messy if there are a lot of work going
on in the main branch. You may need to marge with main multiple times, and the commits may be split between merges,
and it may quickly become a mess.

### Git rebase
**Warning!** Never do this if you share a branch with someone else, unless you warn them and know what you do.

Another strategy is possible if you are working alone on a private branch. You can rewrite the history where your branch
start so that it starts on the tip of the main branch. This is really simple

    git rebase main

When you rebase, git will reply all your changes onto the tip of the main branch, and your git history is suddenly linear.
You may have to resolve rebase conflicts. If this happens, then the rebasing is paused, and you can resolve your
conflicts before continuing using

    git rebase --continue

It is also possible to abort using

    git rebase --abort

Finally, since you are rewriting your git history, you need to force push the changes to the remote. This is the reason
you should not do this if you share the branch with others.

    git push -f



```goat
                                            feature
                             *----*----*----*
                            /
                           /
 o----o----o----o----o----o
                          main
                     
```

Now your git history is super-clean, and it makes it very easy to do stuff like git bisect, patch releases,
and many other things.

## Cleaning up your local git history
It's good practice to clean up your local git history regardless if you plan to squash and rebase (or merge) when
you are merging your work with the main working branch. **Note** again that you should only do this if you work alone
on your branch, or warn others, since you will be rewriting the git history of your branch.

### Change your last commit
Git makes it easy for you to change your last commit, by using 'git commit --amend'. This is useful if you realize that
you forgot something, fixing formatting, changed your mind or if you are doing work-in-progress-commits. I myself often
do these small commits as I go along, and then squash or amend the commits into more sensible chunks before a pull
request.

    git commit --amend

All you have to do is to add or remove the stuff that you want to amend before you run the command. This will open
a prompt for you to write a commit message. If you want to change the commit message directly without a prompt, you
can do it like so:

    git commit --amend -m "my new commit message"

To change committed files. Let say you forgot to add a file, you can simply add the changes to the last commit by
staging the additional changes before running:

    git commit --amend --no-edit

The difference is that you do not edit the commit message, and it will look like you did the commit in a single go.

Remember to do a forced git push in order to push to the remote.

### Squash your commits
It is also possible to change the history of your own branch by rebasing, also known as squashing your own commits. By
doing so, you will be able to edit, squash, remove and change the order of your commits. It is all done interactively.
There are two ways of doing this. Either:

    git rebase -i HEAD~<X>

Where <X> is the number of commits you want to rebase. Or you can specifically target a commit has:

    git rebase -i <hash>

To get either the has or the HEAD number, you can check the reflog:

    git reflog


### Tips

Git is a decentralized version control, and before you start any rebase or merging activity you should make sure that
you are up-to-date with the remote repository:

    git fetch

Another