local cocosVersion = '3.6.3'; // cocos engine version
local settingPerEnv = {
    web: {
        server_ws: "ws://192.168.127.152:9004/api/v1/games",
        debug: 'true',
        encrypt: 'false',
        website: 'http://web.ttech.cc/game/crash/hilo',
        # deploy setting (DON'T CHANGE)
        tag: true, # tag auto deploy
        branch: '',
        path: '//FXG/web/game/crash/hilo/',
    },
    staging: {
        server_ws: "wss://rng.api.helloholyfa.com/api/v1/games",
        debug: 'false',
        encrypt: 'true',
        website: "",
        # deploy setting (DON'T CHANGE)
        tag: false, # tag auto deploy
        branch: "master", # only deploy master branch
        path: "//FXG/artifact/staging/game/crash/hilo",
    },
    production: {
        server_ws: "wss://rng.api.holyfago.com/api/v1/games",
        debug: 'false',
        encrypt: 'true',
        website: '',
        # deploy setting (DON'T CHANGE)
        tag: false, # tag auto deploy
        branch: "master", # only deploy master branch
        path: '//FXG/artifact/prod/game/crash/hilo',
    },
};

local testing_pipeline = {
    kind: "pipeline",
    type: "exec",
    name: "testing",
    platform: {
        os: "windows",
        arch: "amd64"
    },
    steps: [
        {
            name: "fetch",
            commands: [
                "git fetch --tags",
                // print env (powershell)
                "Get-ChildItem Env:",
            ],
        },
    ],
};

local fetch() = {
    name: "fetch",
    commands: [
        "git fetch --tags",
        "git submodule update --init --recursive",
        // print env (powershell)
        "Get-ChildItem Env:",
    ],
};

local build(setting) = {
    name: "compile",
    environment: {
        SERVER_WS: setting.server_ws,
        DEBUG: setting.debug,
        ENCRYPT: setting.encrypt,
        USERPROFILE: "C:/Users/User",
    },
    commands: [
        "Get-ChildItem Env:",
        "yarn install",
        "node C:/Users/User/Desktop/cocos/cicd/compile.js " + cocosVersion + " ./ ",
    ],
};

local deploy(setting) = {
    name: "deploy",
    commands: [
        // check mount path (powershell)
        "net use",
        "rm " + setting.path + "/* -Recurse -Force",
        // copy to deploy path (powershell)
        "cp ./build/web-mobile/* " + setting.path + " -Recurse -Force",
    ],
};

local build_pipeline(env, setting) = {
    kind: "pipeline",
    type: "exec",
    name: "build_" + env,
    platform: {
        os: "windows",
        arch: "amd64"
    },
    steps: [
        fetch(),
        build(setting),
        deploy(setting),
    ],
    trigger: {
        // when tag is true, trigger by tag, otherwise trigger by promote and target
        [ if !setting.tag then "target" ] : [ env ],
        event: [ if setting.tag then "tag" else "promote" ],
        // when tag is false and branch is not empty, trigger by branch
        [ if setting.branch != "" && !setting.tag then "branch" ] : [ setting.branch ],
    },
    depends_on: [
        "testing",
    ],
};

[
    testing_pipeline,
] +
[
    build_pipeline(env, settingPerEnv[env])
    for env in std.objectFieldsAll(settingPerEnv) 
]
