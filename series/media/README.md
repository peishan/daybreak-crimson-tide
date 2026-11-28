# Series video folder

Upload clips straight into the episode folder using the clip number as the file name:

    series/media/ep001/01.mp4  ...  series/media/ep001/10.mp4
    series/media/ep002/01.mp4  ...

Notes
- Anything in this folder is part of the repository and is served with the site. If the site is public, these files are public. For private videos, point `storage.baseUrl` in `series/config.json` at private storage and use the same `ep001/01.mp4` layout there.
- GitHub's browser upload accepts files up to 25 MB each (100 MB through git). Compress with `tools/process-cinematic.sh in.mp4 out.mp4` first.
- To replace a clip, upload a file with the same name and bump that clip's `version` in `series/registry.json`.
