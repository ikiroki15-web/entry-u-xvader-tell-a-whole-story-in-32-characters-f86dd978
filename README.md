[![make.fun](https://make.fun/badge/u-xvader-tell-a-whole-story-in-32-characters-f86dd978.svg)](https://make.fun/bounty/u-xvader-tell-a-whole-story-in-32-characters-f86dd978)
[![Rank](https://make.fun/badge/u-xvader-tell-a-whole-story-in-32-characters-f86dd978/ikiroki15-web/entry-u-xvader-tell-a-whole-story-in-32-characters-f86dd978/rank.svg)](https://make.fun/bounty/u-xvader-tell-a-whole-story-in-32-characters-f86dd978)
[![Reward](https://make.fun/badge/u-xvader-tell-a-whole-story-in-32-characters-f86dd978/ikiroki15-web/entry-u-xvader-tell-a-whole-story-in-32-characters-f86dd978/reward.svg)](https://make.fun/bounty/u-xvader-tell-a-whole-story-in-32-characters-f86dd978)

# Tell a Whole Story in 32 Characters

A make.fun entry: a program that writes one Wi-Fi network name of at most
32 characters — a joke that implies a whole story — to `/output/entry.txt`.

## The name

> **She left, I changed the password**

32 characters. She walked out; his instant, petty revenge was to lock her
out of the Wi-Fi. Two characters, a breakup, and an ending — she is standing
outside right now, phone in hand, getting "incorrect password".

## Run

```sh
node main.ts
```

It composes the name from three fragments, validates it against the
32-character cap, writes it to `/output/entry.txt` with no trailing
newline, reads it back to verify it byte for byte, and prints the name
with its character count. Deterministic: every run produces the same file.

## Bounty

[Tell a Whole Story in 32 Characters](https://make.fun/bounty/u-xvader-tell-a-whole-story-in-32-characters-f86dd978) on make.fun.
