# Daybreak: Crimson Tide, Animated Series

A private series player that is separate from the game and Story Mode. Open `series.html` (the main page has an "Animated Series" button that opens it in a new window).

One generic player plays every episode. An episode is only data in `registry.json`: nothing in the player is written per episode, so it scales to hundreds.

## Files

| File | What it is |
| --- | --- |
| `series.html` | The page shell. |
| `series/series.js`, `series/series.css` | The player and the episode list. |
| `series/config.json` | Series title, tagline, where the video lives, the access rule, player timing. |
| `series/registry.json` | The episode registry (metadata only). |

## Video storage (keep videos out of the repo)

Set `storage.baseUrl` in `config.json` to your private storage, for example `https://media.example.com/daybreak/`. A clip's `src` is relative to it (`ep001/clip-01-the-storm.mp4`) or a full `https://` URL. Leave `baseUrl` empty to use `series/media/` for local testing.

Authorisation is sent with every clip request: `storage.auth` is `{ "type": "query", "param": "key" }` (the access key is added as `?key=...`) or `{ "type": "none" }`. A base URL containing `{key}` has it replaced by the key. `storage.versionParam` (default `v`) adds the clip's `version` to its URL so a replaced clip is not served from a cache; set it to `""` if your storage uses signed URLs that a changed query would break.

**Protection.** A static site cannot keep a file private by itself. The page only holds the player; real protection must come from the storage refusing requests without a valid key (for example a signed URL, or a small Worker or edge function that checks `?key=`). Videos should not be placed in the public repo or the public game files.

## Access

`access.required: true` asks for a key. The key is stored on the device and sent to storage with each clip.
- `access.keyHash`: SHA-256 of the owner key. The player compares the entered key's hash. (The unlock screen shows a key's hash under "Owner: key hash" so you can paste it here.)
- `access.checkUrl`: a URL that returns 200 only for a valid key (the key is added as for clips).
- If neither is set, the first key entered becomes the key for that device (a soft gate).

## Adding an episode

Add an entry to `registry.json`:

```json
{ "number": 2, "arc": 1, "title": "...", "description": "...",
  "chapters": [ { "arc": 1, "chapter": 2 } ], "thumbnail": "assets/comics/arc1/ch02-the-first-port.webp",
  "status": { "production": "in_production", "approval": "pending" },
  "ending": { "art": "" },
  "clips": [ { "id": "002-01", "title": "...", "src": "ep002/clip-01.mp4", "duration": null, "status": "ready", "version": 1 } ] }
```

For many episodes, keep the registry small and give each episode its own file: `{ "number": 2, "title": "...", "file": "series/episodes/ep002.json" }`. It is loaded only when opened.

- `duration`: seconds, or `null` to let the player read it from the file (it caches what it reads).
- `status`: `pending` for a clip that is not uploaded yet (the player shows a title card and moves on), `ready` once it is.
- `production`: `planned`, `in_production` or `ready`. `approval`: `pending`, `approved` or `rejected`.
- `ending.art`: an optional image to show behind the closing tagline; otherwise the last frame is held.

## Replacing a clip

Upload the new file to storage and change that clip's `src`, or bump its `version`. The other clips and the episode do not change.

## Playback

Clips play in order from two video elements: the next clip is loaded in the background and swapped in without a gap (the old frame stays on screen until the new one is playing). One progress bar spans the whole episode, with a mark at each clip boundary. Play and pause, seek, volume, fullscreen (landscape is requested on phones), and skip between clips. Progress is saved on the device and offered as Resume. The episode opens with the series title, number and name, and ends with the tagline over the held last frame, a fade, and Next episode, Replay and Episode list.

Keys: space or K play and pause, left and right 5 seconds, Shift plus left or right previous or next clip, F fullscreen, M mute.
