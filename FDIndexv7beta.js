const FDIndex_version = 7 + "beta"; // beta/release
const Types = Object.freeze({ // 网盘类型
    google_drive: 1,
    cf_d1_kv: 2,
    deno_mysql: 3,
    zoho_workdrive: 4,
    netlify_blob: 5,
    pcloud: 6,
    fermyon_db_kv: 7,
    infomaniak_drive: 8,
});
const DataCentres = Object.freeze({ // 数据存储中心
    us: 1, eu: 2, au: 3, in: 4, jp: 5, cn: 6,
});
const DatabasePlatforms = Object.freeze({ // 数据库平台
    tidbcloud: 1, neon: 2,
});
let roots = [ // ?ri=id ?rt=title &theme=dark
    {
        "type": Types.google_drive, // 网盘类型
        "id": "", // root是网盘根目录，可换成文件夹ID
        "client_id": "",
        "client_secret": "",
        "refresh_token": "",
        "script_deployment_id": "",
        "account": "",
        "password": "",
        "totp": "",
        "drive_id": "",
        "api_token": "",
        "data_centre": DataCentres.eu,
        "db_platform": DatabasePlatforms.tidbcloud,
        "binding_kv": "KV",
        "binding_db": "DB",
        "env_ca": "CA",
        "db_hostname": ["", 4000],
        "db_username": "",
        "db_password": "",
        "db_database": "test",
        "db_table_name": "table001",
        "title": "FDIndex", // 显示的网站名称
        "upload": true, // 是否允许上传
        "download": true, // 是否允许下载文件
        "download_as_zip": true, // 是否允许打包下载文件夹
        "new_folder": true, // 是否允许新建文件夹
        "new_shortcut": true, // 是否允许创建捷径
        "copy_from": true, // 是否允许转存自
        "rename": true, // 是否允许重命名
        "share": true, // 是否允许修改共享
        "move": true, // 是否允许移动操作
        "trash": true, // 是否允许移至垃圾桶
        "delete": true, // 是否允许永久删除
        "reply": true, // 是否允许添加回复标记
        "auth": false, // 是否需要身份验证
        "user": "", // 用户名
        "pass": "", // 密码
        "accept_drive_page_auth": false, // 也接受网盘列表页面的用户名和密码
        "unique_name": true, // 不允许目录下文件重名
        "btn_goto_drive": true, // 显示右上角`在网盘打开`按钮
        "auto_upload_after_drop": false, // 拖放文件后自动开始上传
        "disallowed_upload": "txt;odt;doc;docx;rtf;xlsx;xlsm;xlsb;xls;lnk;wps;", // 不允许上传的类型
    },
];
// 筛选路径
const allowed_paths = [ // 筛选路径
    "",
];
// 默认链接
const default_urls = [
    "https://cn.bing.com/",
    "https://www.microsoft.com/",
    "https://www.apple.com/",
    "https://www.dell.com/support/",
    "https://support.hp.com/drivers/",
    "https://www.asus.com/support/download-center/",
    "https://www.acer.com/",
];

// 是否启用多选操作
const multiple_selection = true;

// 是否用首层路径表示网盘，取代ri/rt请求参数
const first_layer_as_drive = false;
const drive_page_settings = { // 对网盘列表页面的设置
    "title": "FD", "auth": true, "user": "", "pass": "", "accept_drive_auths": false, // 也接受各网盘的用户名和密码
}

// 是否显示文件修改日期
const display_modified_time = true;

// 是否使用白色背景色
const prefer_white_background = false;

// 显示的网站图标
const logo = "data:;base64,UklGRoABAABXRUJQVlA4WAoAAAAQAAAAHwAAHwAAQUxQSJwAAAABcFRbexrFQET8LqpowEJ8ZBdLBQG0ZlgNlNvA/3dgHRETwP5L76713EBIbbtoB3kEm/uiNy3HO8ayLMMwDK1GmDgIG1sJXCeqCqeqhE4t6OocFxnhRfLCwO96vKXzAfyuw+t0C1mPt2h6gr4/R06R+wBRvhDmEVFOtugeeA/Ng+IRAcQUwyMGiAfSw0IaA2Q02Qm4ikkVZxxIOQNWUDggvgAAADAGAJ0BKiAAIAA+0VykTKglI6IwGAgBABoJbACdMw5EUIK1ZMUmwAAoseUZbjY+XRZl6jTbE466fw4A/lHPV8ZKC+LAihiuMKujQT1vYTWozV9qEfZ/wVr6ruMLe5ZePP03ryfBQyVgVcZBNeItfaJAx2zy95tyr5dFQkNIBDaSB2O/9edLQQUuj/gOkxRbLr88x5tc2FvZafnLa2gn4WjZleG3Jw3KjUoPkZIacPQomUvRMOGym4jCcyrAAAA=";


const Platforms = Object.freeze({
    unknown: "unknown",
    deno: "deno",
    cloudflare: "cloudflare",
    netlify: "netlify",
    fastly: "fastly",
    fermyon: "fermyon",
    wasmer: "wasmer",
    vercel: "vercel",
});
let Platform = Platforms.unknown;
if (typeof globalThis?.Netlify !== "undefined" || typeof globalThis?.netlifyBlobsContext !== "undefined") {
    Platform = Platforms.netlify;
} else if (typeof globalThis?.fastly !== "undefined" || typeof globalThis?.FastlyBody !== "undefined") {
    Platform = Platforms.fastly;
} else if (typeof process !== "undefined" && process?.env?.WASMER_APP_VERSION_ID) {
    Platform = Platforms.wasmer;
} else if (typeof process !== "undefined" && process?.env?.VERCEL) {
    Platform = Platforms.vercel;
} else if (typeof Deno !== "undefined") {
    Platform = Platforms.deno;
} else if (typeof self !== "undefined" && self.constructor && self.constructor.name === "ServiceWorkerGlobalScope") {
    Platform = Platforms.cloudflare;
} else if (typeof MultipartFormData !== "undefined") {
    Platform = Platforms.fermyon;
}
console.log(`hello! ${Platform}.`,);


let sql = null;
let mysql = null;
let kv = null;
let blobs = null;
let totp_authenticator = null;
let chunked_download_if_filesize_great_than = 0;

const ItemTypes = Object.freeze({
    drive: "drive", file: "file", folder: "folder", symlink: "symlink",
});

function core(root_attr,) {
    return Cores[root_attr.type];
}

let Cores = {

    isSymlink(attr,) {
        return attr["type"] === ItemTypes.symlink;
    },

    isFolder(attr, exactly = true) {
        if (attr["type"] === ItemTypes.folder) {
            return true;
        }
        if (!exactly && Cores.isSymlink(attr,) && Cores.isFolder(attr["symlink_target"])) {
            return true;
        }
        return false;
    },

    async permissionByPath(request, root_attr, data,) {
        let d;
        if (!root_attr) {
            d = {
                "type": 0, // 网盘列表
                "title": drive_page_settings.title, "version": FDIndex_version,
            }
        } else {
            d = {
                "title": root_attr.title,
                "version": FDIndex_version,

                "unique": roots.length === 1,
                "id": `${root_attr.btn_goto_drive ? root_attr.id : null}`,
                "type": root_attr.type,
                "upload": root_attr.upload,
                "download": root_attr.download,
                "download_as_zip": root_attr.download_as_zip,
                "new_folder": root_attr.new_folder,
                "new_shortcut": root_attr.new_shortcut,
                "copy_from": root_attr.copy_from,
                "rename": root_attr.rename,
                "share": root_attr.share,
                "move": root_attr.move,
                "trash": root_attr.trash,
                "delete": root_attr.delete,
                "reply": root_attr.reply,
                "unique_name": root_attr.unique_name,
                "btn_goto_drive": root_attr.btn_goto_drive,
                "auto_upload_after_drop": root_attr.auto_upload_after_drop,
                "disallowed_upload": root_attr.disallowed_upload,

                "multiple_selection": multiple_selection,
                "first_layer_as_drive": first_layer_as_drive,

                "can_trash": Cores.can_trash,
                "can_share": Cores.can_share,
                "can_copy": Cores.can_copy,
                "can_shortcut": Cores.can_shortcut,
                "can_zip": Cores.can_zip,
                "can_resume": Cores.can_resume,
                "max_upload_size": Cores.max_upload_size,

            }
        }
        return d;
    },

    async checkUniqueName(request, root_attr, id, unique_name) {
        let list = [];
        let data = await Cores.listFolder(request, root_attr, id);
        for (const datumElement of data["files"]) {
            let c = await Cores.formatInfo(request, root_attr, datumElement);
            list.push(c);
        }
        for (const datumElement of list) {
            if (datumElement["name"] === unique_name) {
                return false;
            }
        }
        return true;
    },

    // 位置在isAuthorized之前=私有属性
    [Types.google_drive]: {
        MimeTypes: {
            "application/vnd.google-apps.folder": ItemTypes.folder,
            "application/vnd.google-apps.shortcut": ItemTypes.symlink,
        },

        get_Authorization(root_attr,) {
            return root_attr.Authorization;
        },

        isAuthorized(root_attr,) {
            // console.log("isAuthorized", Cores.access_token);
            return !!root_attr.access_token;
        },

        can_trash: true,
        can_share: true,
        can_copy: true,
        can_shortcut: true,
        can_zip: false,
        can_chunk: true,
        can_resume: true,
        max_upload_size: -1,

        isShared(item) {
            if (!item) {
                return false;
            }
            if ("shared" in item && item["shared"]) {
                return true;
            } else if ("permissionIds" in item && Array.isArray(item["permissionIds"]) && item["permissionIds"].some(id => String(id).toLowerCase() === "anyonewithlink")) {
                return true;
            }
            return false;
        },

        async initializeClient(root_attr,) {
            if (root_attr.Authorization) {
                if (Date.now() < root_attr.access_token_expires) {
                    return;
                }
            }
            const requestData = {
                client_id: root_attr.client_id,
                client_secret: root_attr.client_secret,
                refresh_token: root_attr.refresh_token,
                grant_type: "refresh_token",
            };
            const url = new URL('https://www.googleapis.com/oauth2/v4/token');
            const response = await fetch(url, {
                ...attachBackend(url),
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(requestData)
            });
            const data = await response.json();

            root_attr.access_token = data["access_token"];
            root_attr.access_token_expires = Date.now() + 3400 * 1000; // 访问令牌1小时后就过期了
            root_attr.Authorization = `Bearer ${data["access_token"]}`;
            // console.log("root_attr.Authorization", response, data, root_attr.Authorization);
        },

        async checkId(root_attr, id,) {
            if (id === "root") return true;
            const queryString = new URLSearchParams({
                includeItemsFromAllDrives: true, supportsAllDrives: true, fields: 'id,name',
            }).toString();
            const url = new URL(`https://www.googleapis.com/drive/v3/files/${id}?${queryString}`);
            let resp = await fetch(url, {
                ...attachBackend(url), method: 'GET', headers: {
                    'Content-Type': 'application/json', Authorization: core(root_attr).get_Authorization(root_attr),
                },
            });
            // console.log(resp, await resp.json())
            if (resp.status === 200) {
                return true;
            }
            return false;
        },

        async getId(request, root_attr, parentId, childName, resolve_symlink) {
            childName = childName.replace(/\'/g, `\\'`); // escape single quote
            let qs = {
                includeItemsFromAllDrives: true,
                supportsAllDrives: true,
                q: `'${parentId}' in parents and name = '${childName}' and trashed = false`,
                fields: 'files(id,name,mimeType,size,modifiedTime,shared,permissionIds,shortcutDetails)'
            };
            const queryString = new URLSearchParams(qs).toString();
            try {
                const url = new URL(`https://www.googleapis.com/drive/v3/files?${queryString}`);
                const response = await fetch(url, {
                    ...attachBackend(url), method: 'GET', headers: {
                        'Content-Type': 'application/json',
                        'Authorization': core(root_attr).get_Authorization(root_attr),
                    },
                });
                const resp = await response.json();
                // console.log("Cores.getId", response, resp,);
                if (!resp.files || resp.files.length === 0) {
                    return null;
                }
                if (resolve_symlink) {
                    const v = await Cores.formatInfo(request, root_attr, resp.files[0]);
                    if (Cores.isSymlink(v)) {
                        return v["symlink_target"]["id"];
                    }
                }
                return resp.files[0].id; // when there are more than 1 items, simply return the first one
            } catch (e) {
                return null;
            }
        },

        async resolvePath(request, root_attr, path, resolve_symlink = 0) {
            const toks = path.split('/').map(decodeURIComponent).map(decodeURIComponent).filter(Boolean);
            let id = root_attr.id;
            let name = null;
            let parents = [];
            let rs = false;
            for (let i = 0; i < toks.length; i++) {
                if (resolve_symlink === 0) {
                    rs = false;
                } else if (resolve_symlink === 1) {
                    rs = true;
                } else if (resolve_symlink < 0) {
                    if (i - toks.length >= resolve_symlink) {
                        rs = false;
                    } else {
                        rs = true;
                    }
                }
                parents.push({id, name});
                id = await Cores.getId(request, root_attr, id, toks[i], rs);
                name = toks[i];
                if (!id) return {id, name, parents};
            }
            console.log("Cores.resolvePath", id, toks,);
            return {id, name, parents};
        },

        async formatInfo(request, root_attr, datumElement,) {
            let c = {
                "id": datumElement["id"],
                "type": datumElement["mimeType"] in core(root_attr).MimeTypes ? core(root_attr).MimeTypes[datumElement["mimeType"]] : ItemTypes.file,
                "name": datumElement["name"],
                "size": "size" in datumElement ? datumElement["size"] : null,
                "shared": Cores.isShared(datumElement),
                "modified_time": display_modified_time ? parseInt(new Date(datumElement["modifiedTime"]).getTime() / 1000) : null,
            };
            if (Cores.isSymlink(c)) {
                c["symlink_target"] = {
                    "id": datumElement["shortcutDetails"]["targetId"],
                    "type": datumElement["shortcutDetails"]["targetMimeType"] in core(root_attr).MimeTypes ? core(root_attr).MimeTypes[datumElement["shortcutDetails"]["targetMimeType"]] : ItemTypes.file,
                };
                let cc = await Cores.getMeta(request, root_attr, c["symlink_target"]["id"]);
                if (c["symlink_target"]["type"] === ItemTypes.file) {
                    if (cc) { // 如果目标被删除，就得不到size了
                        c["size"] = cc["size"];
                    }
                }
                c["shared"] = Cores.isShared(cc);
            }
            return c;
        },

        async getInfo(request, root_attr, id,) {
            let datumElement = await Cores.getMeta(request, root_attr, id);
            if (!datumElement) return null;
            return Cores.formatInfo(request, root_attr, datumElement);
        },

        async getInfoByPath(request, root_attr, path,) {
            const id = (await Cores.resolvePath(request, root_attr, path, -1))["id"];
            if (!id) return null;
            return Cores.getInfo(request, root_attr, id,);
        },

        async getMeta(request, root_attr, id,) {
            const queryString = new URLSearchParams({
                includeItemsFromAllDrives: true, supportsAllDrives: true, fields: '*',
            }).toString();
            const url = new URL(`https://www.googleapis.com/drive/v3/files/${id}?${queryString}`);
            let resp = await fetch(url, {
                ...attachBackend(url), method: 'GET', headers: {
                    'Content-Type': 'application/json', Authorization: core(root_attr).get_Authorization(root_attr),
                },
            });
            // console.log("getMeta", resp.status);
            if (resp.status !== 200) return null;
            return await resp.json();
        },

        async listFolder(request, root_attr, id) {
            const getList = pageToken => {
                const qs = {
                    includeItemsFromAllDrives: true,
                    supportsAllDrives: true,
                    q: `'${id}' in parents and trashed = false`,
                    orderBy: 'folder,name,modifiedTime desc',
                    fields: 'files(id,name,mimeType,size,modifiedTime,shared,permissionIds,shortcutDetails),nextPageToken',
                    pageSize: 1000
                };
                if (pageToken) {
                    qs.pageToken = pageToken;
                }
                const queryString = new URLSearchParams(qs).toString();
                const url = new URL(`https://www.googleapis.com/drive/v3/files?${queryString}`);
                return fetch(url, {
                    ...attachBackend(url), method: 'GET', headers: {
                        'Content-Type': 'application/json', Authorization: core(root_attr).get_Authorization(root_attr),
                    },
                });
            };
            const files = [];
            let pageToken;
            do {
                let resp = await getList(pageToken);
                let data = await resp.json();
                // console.log("Cores.listFolder", id, resp, data,);
                files.push(...data.files);
                pageToken = data.nextPageToken;
            } while (pageToken);
            return {
                files
            };
        },

        async listFolderByPath(request, root_attr, path,) {
            let id = (await Cores.resolvePath(request, root_attr, path, 1))["id"];
            if (!id) return null;

            let list = [];
            let data = await Cores.listFolder(request, root_attr, id);
            for (const datumElement of data["files"]) {
                let c = await Cores.formatInfo(request, root_attr, datumElement);
                list.push(c);
            }
            return {
                "parent": root_attr.btn_goto_drive ? id : null, "list": list,
            };
        },

        async moveByPath(request, root_attr, data,) {
            // console.log("moveByPath", data);
            const {id: source_id, name,} = await Cores.resolvePath(request, root_attr, data["source"], -1);
            // console.log("moveByPath source_id", source_id);
            if (!source_id) return null;
            let to_id = (await Cores.resolvePath(request, root_attr, data["to"], 1))["id"];
            // console.log("moveByPath to_id", to_id);
            if (!to_id) return null;

            if (root_attr.unique_name && !await Cores.checkUniqueName(request, root_attr, to_id, name)) {
                return null;
            }

            const qs = {
                supportsAllDrives: true,
                addParents: to_id,
                removeParents: (await Cores.getMeta(request, root_attr, source_id))["parents"].join(","),
                fields: "id, parents",
            };
            const queryString = new URLSearchParams(qs).toString();
            const url = new URL(`https://www.googleapis.com/drive/v3/files/${source_id}?${queryString}`);
            const response = await fetch(url, {
                ...attachBackend(url), method: 'PATCH', headers: {
                    'Content-Type': 'application/json', Authorization: core(root_attr).get_Authorization(root_attr),
                },
            });
            return response.json();
        },

        async renameByPath(request, root_attr, data,) {
            const {id: source_id, parents} = await Cores.resolvePath(request, root_attr, data["source"], -1,);
            if (!source_id) return null;

            if (root_attr.unique_name && !await Cores.checkUniqueName(request, root_attr, parents.at(-1)["id"], data["name"])) {
                return null;
            }

            const qs = {
                supportsAllDrives: true,
            };
            const queryString = new URLSearchParams(qs).toString();
            const url = new URL(`https://www.googleapis.com/drive/v3/files/${source_id}?${queryString}`);
            const response = await fetch(url, {
                ...attachBackend(url), method: 'PATCH', headers: {
                    'Content-Type': 'application/json', Authorization: core(root_attr).get_Authorization(root_attr),
                }, body: JSON.stringify({
                    "name": data["name"],
                }),
            });
            return response.json();
        },

        async shareByPath(request, root_attr, data,) {
            const {id: source_id, parents} = await Cores.resolvePath(request, root_attr, data["source"], -1,);
            if (!source_id) return null;

            let permissions;
            {
                const qs = {
                    supportsAllDrives: true,
                };
                const queryString = new URLSearchParams(qs).toString();
                const url = new URL(`https://www.googleapis.com/drive/v3/files/${source_id}/permissions?${queryString}`);
                const response = await fetch(url, {
                    ...attachBackend(url), method: 'GET', headers: {
                        'Content-Type': 'application/json', Authorization: core(root_attr).get_Authorization(root_attr),
                    },
                });
                permissions = (await response.json())["permissions"];
            }
            if (data["type"] === "anyone") {
                let co = false;
                for (const permission of permissions) {
                    if (permission["type"] === "anyone") {
                        const qs = {
                            supportsAllDrives: true,
                        };
                        const queryString = new URLSearchParams(qs).toString();
                        const url = new URL(`https://www.googleapis.com/drive/v3/files/${source_id}/permissions/${permission["id"]}?${queryString}`);
                        const response = await fetch(url, {
                            ...attachBackend(url), method: 'PATCH', headers: {
                                'Content-Type': 'application/json',
                                Authorization: core(root_attr).get_Authorization(root_attr),
                            }, body: JSON.stringify({
                                role: data["role"],
                            }),
                        });
                        co = true;
                        break;
                    }
                }
                if (!co) {
                    const qs = {
                        supportsAllDrives: true,
                    };
                    const queryString = new URLSearchParams(qs).toString();
                    const url = new URL(`https://www.googleapis.com/drive/v3/files/${source_id}/permissions?${queryString}`);
                    const response = await fetch(url, {
                        ...attachBackend(url), method: 'POST', headers: {
                            'Content-Type': 'application/json',
                            Authorization: core(root_attr).get_Authorization(root_attr),
                        }, body: JSON.stringify({
                            type: "anyone", role: data["role"], //'reader': "writer"
                        }),
                    });
                }
            } else {
                for (const permission of permissions) {
                    if (permission["type"] === "anyone") {
                        const qs = {
                            supportsAllDrives: true,
                        };
                        const queryString = new URLSearchParams(qs).toString();
                        const url = new URL(`https://www.googleapis.com/drive/v3/files/${source_id}/permissions/${permission["id"]}?${queryString}`);
                        const response = await fetch(url, {
                            ...attachBackend(url), method: 'DELETE', headers: {
                                'Content-Type': 'application/json',
                                Authorization: core(root_attr).get_Authorization(root_attr),
                            },
                        });
                    }
                }
            }
            return null;
        },

        async trash(request, root_attr, did,) {
            const qs = {
                supportsAllDrives: true,
            };
            const queryString = new URLSearchParams(qs).toString();
            const url = new URL(`https://www.googleapis.com/drive/v3/files/${did}?${queryString}`);
            const response = await fetch(url, {
                ...attachBackend(url), method: 'PATCH', headers: {
                    'Content-Type': 'application/json', Authorization: core(root_attr).get_Authorization(root_attr),
                }, body: JSON.stringify({
                    "trashed": true
                }),
            });
            return response.json();
        },

        async trashByPath(request, root_attr, data,) {
            const source_id = (await Cores.resolvePath(request, root_attr, data["source"], -1,))["id"];
            if (!source_id) return null;
            return await Cores.trash(request, root_attr, source_id);
        },

        async delete(request, root_attr, did,) {
            const qs = {
                supportsAllDrives: true,
            };
            const queryString = new URLSearchParams(qs).toString();
            const url = new URL(`https://www.googleapis.com/drive/v3/files/${did}?${queryString}`);
            const response = await fetch(url, {
                ...attachBackend(url), method: 'DELETE', headers: {
                    'Content-Type': 'application/json', Authorization: core(root_attr).get_Authorization(root_attr),
                },
            });
            // return response.json();
            return response.status.toString()
        },

        async deleteByPath(request, root_attr, data,) {
            const source_id = (await Cores.resolvePath(request, root_attr, data["source"], -1,))["id"];
            if (!source_id) return null;
            return await Cores.delete(request, root_attr, source_id);
        },

        async trashSelectedByPath(request, root_attr, data,) {
            const location_id = (await Cores.resolvePath(request, root_attr, data["location"], 1,))["id"];
            if (!location_id) return null;

            for (const name of data["names"]) {
                const source_id = await Cores.getId(request, root_attr, location_id, name, false,);
                if (!source_id) continue;
                if (source_id === "root") continue;
                await Cores.trash(request, root_attr, source_id);
            }
            return {};
        },

        async deleteSelectedByPath(request, root_attr, data,) {
            const location_id = (await Cores.resolvePath(request, root_attr, data["location"], 1,))["id"];
            if (!location_id) return null;

            for (const name of data["names"]) {
                const source_id = await Cores.getId(request, root_attr, location_id, name, false,);
                if (!source_id) continue;
                if (source_id === "root") continue;
                await Cores.delete(request, root_attr, source_id);
            }
            return {};
        },

        async replySelectedByPath(request, root_attr, data,) {
            const location_id = (await Cores.resolvePath(request, root_attr, data["location"], 1,))["id"];
            if (!location_id) return null;

            const results = [];

            for (const name of data["names"]) {
                const source_id = await Cores.getId(request, root_attr, location_id, name, false,);
                if (!source_id || source_id === "root") continue;

                const newName = name.includes('.') ? name.replace(/(\.[^.]*)$/, '【OK】$1') : `${name}【OK】`;

                await Cores.renameByPath(request, root_attr, {
                    source: `${data["location"]}/${name}`,
                    name: newName,
                });
            }
            return {};
        },

        async newFolderByPath(request, root_attr, data, path,) {
            let id = (await Cores.resolvePath(request, root_attr, path, 1))["id"];
            if (!id) return null;

            if (root_attr.unique_name && data["name"] && !await Cores.checkUniqueName(request, root_attr, id, data["name"])) {
                return null;
            }

            data["names"] = data.names || [];
            if (data["name"]) data["names"].push(data["name"]);
            let r = []
            for (const name of data["names"]) {
                if (root_attr.unique_name && !await Cores.checkUniqueName(request, root_attr, id, name)) {
                    continue;
                }
                const qs = {
                    supportsAllDrives: true,
                };
                const queryString = new URLSearchParams(qs).toString();
                const url = new URL(`https://www.googleapis.com/drive/v3/files?${queryString}`);
                const response = await fetch(url, {
                    ...attachBackend(url), method: 'POST', headers: {
                        'Content-Type': 'application/json', Authorization: core(root_attr).get_Authorization(root_attr),
                    }, body: JSON.stringify({
                        "name": name,
                        "mimeType": "application/vnd.google-apps.folder",
                        "parents": [id,],
                        "fields": "id, parents",
                    }),
                });
                // console.log("newFolderByPath", response.status, response);
                if (response.status !== 200) {
                    r.push(false);
                }
                r.push(await response.json());
            }
            return r;
        },

        async zipByPath(request, root_attr, data,) {
            const source_id = (await Cores.resolvePath(request, root_attr, data["location"], -1,))["id"];
            if (!source_id) return null;

            let id_url = new URL(`https://script.google.com/macros/s/${root_attr.script_deployment_id}/exec?folderId=${source_id}`);
            const id_response = await fetch(id_url, {
                ...attachBackend(id_url), method: 'GET',
            });
            console.log("zipByPath", id_response.status, id_response);
            if (!id_response.ok) return null;
            const id_data = await id_response.json();
            if (!id_data || id_data.status !== 0 || !id_data.id) {
                return null;
            }

            let url = new URL(request.url);
            url.searchParams.set('zip', id_data.id);
            const response = await fetch(url, {
                ...attachBackend(url),
                method: 'GET',
                redirect: 'follow',
            })
            if (!response.ok) return null;

            return new Response(response.body, {
                status: 200,
                headers: {
                    "Content-Type": "application/zip",
                    "Content-Disposition": 'attachment; filename="archive.zip"',
                    "Cache-Control": "no-store",
                }
            });
        },

        async newShortcutByPath(request, root_attr, data, path,) {
            let id = (await Cores.resolvePath(request, root_attr, path, 1))["id"];
            if (!id) return null;

            if (root_attr.unique_name && data["name"] && !await Cores.checkUniqueName(request, root_attr, id, data["name"])) {
                return null;
            }

            let r = []
            const qs = {
                supportsAllDrives: true,
            };
            const queryString = new URLSearchParams(qs).toString();
            const url = new URL(`https://www.googleapis.com/drive/v3/files?${queryString}`);
            const response = await fetch(url, {
                ...attachBackend(url), method: 'POST', headers: {
                    'Content-Type': 'application/json', Authorization: core(root_attr).get_Authorization(root_attr),
                }, body: JSON.stringify({
                    // "name": data["name"],
                    "mimeType": "application/vnd.google-apps.shortcut",
                    "parents": [id,],
                    "fields": "id, parents",
                    "shortcutDetails": {"targetId": data["source"]}
                }),
            });
            // console.log("newShortcutByPath", response.status, response);
            if (response.status !== 200) {
                r.push(false);
            }
            r.push(await response.json());
            return r;
        },

        async copyFromByPath(request, root_attr, data, path,) {
            let id = (await Cores.resolvePath(request, root_attr, path, 1))["id"];
            if (!id) return null;
            // 此函数一次转存多个文件到当前目录
            let index = 0;
            for (const datumElement of data["sources"]) {
                const qs = {
                    supportsAllDrives: true, includeItemsFromAllDrives: true, fields: "id, parents",
                };
                const queryString = new URLSearchParams(qs).toString();
                const url = new URL(`https://www.googleapis.com/drive/v3/files/${datumElement["id"]}/copy?${queryString}`);
                const response = await fetch(url, {
                    ...attachBackend(url), method: 'POST', headers: {
                        'Content-Type': 'application/json', Authorization: core(root_attr).get_Authorization(root_attr),
                    }, body: JSON.stringify({
                        "name": datumElement["name"], "parents": [id,], // "fields": "id, parents",
                    }),
                });
                // return response.json();
                // console.log("copyFromByPath", response.status, response);
                if (response.status !== 200) {
                    return {"status": 1, "index": index};
                }
                index++;
            }
            return {"status": 0};
        },

        async resolveTree(request, root_attr, data, tree, summary, paths,) {
            let li = await Cores.listFolder(request, root_attr, data["source"]);
            for (const datumElement of li["files"]) {
                let c = await Cores.formatInfo(request, root_attr, datumElement);
                tree.children.push(c);
                if (Cores.isFolder(c, false)) {
                    c["children"] = [];
                    summary.folderCount++;
                    let id = Cores.isSymlink(c) ? c["symlink_target"]["id"] : c["id"];
                    if (!paths.includes(id)) {
                        await Cores.resolveTree(request, root_attr, {source: id,}, c, summary, [...paths, id,])
                    } else {
                        c["recur"] = true;
                    }
                } else {
                    summary.fileCount++;
                    summary.totalSize += parseInt(c["size"]);
                }
            }
        },

        async download(request, root_attr, meta, range) {
            const qs = {
                includeItemsFromAllDrives: true, supportsAllDrives: true, alt: 'media'
            };
            const queryString = new URLSearchParams(qs).toString();
            const url = new URL(`https://www.googleapis.com/drive/v3/files/${meta["id"]}?${queryString}`);
            return fetch(url, {
                ...attachBackend(url),
                method: 'GET',
                headers: {Authorization: core(root_attr).get_Authorization(root_attr), Range: range,},
            });
        },

        async uploadByPath(request, root_attr, path, name,) {
            let id = (await Cores.resolvePath(request, root_attr, path, 1,))["id"];
            if (!id) return null;

            if (root_attr.unique_name && !await Cores.checkUniqueName(request, root_attr, id, name)) {
                return null;
            }

            const qs = {
                supportsAllDrives: true, uploadType: 'resumable',
            };
            const queryString = new URLSearchParams(qs).toString();
            const url = new URL(`https://www.googleapis.com/upload/drive/v3/files?${queryString}`);
            const response = await fetch(url, {
                ...attachBackend(url), method: 'POST', headers: {
                    'Content-Type': 'application/json', Authorization: core(root_attr).get_Authorization(root_attr),
                }, body: JSON.stringify({
                    "name": name, "parents": [id],
                }),
            });
            return fetch(response.headers.get('Location'), {
                ...attachBackend(response.headers.get('Location')),
                method: 'PUT',
                headers: {Authorization: core(root_attr).get_Authorization(root_attr),},

                // body: request.body, // fastly下报错503 Service Unavailable
                body: await preReadForUpload(request),
            });
        },

        async uploadNewSessionByPath(request, root_attr, path, name,) {
            let id = (await Cores.resolvePath(request, root_attr, path, 1,))["id"];
            if (!id) return null;

            if (root_attr.unique_name && !await Cores.checkUniqueName(request, root_attr, id, name)) {
                return null;
            }

            const qs = {
                supportsAllDrives: true, uploadType: 'resumable',
            };
            const queryString = new URLSearchParams(qs).toString();
            const url = new URL(`https://www.googleapis.com/upload/drive/v3/files?${queryString}`);
            const response = await fetch(url, {
                ...attachBackend(url), method: 'POST', headers: {
                    'Content-Type': 'application/json', Authorization: core(root_attr).get_Authorization(root_attr),
                }, body: JSON.stringify({
                    "name": name, "parents": [id],
                }),
            });
            return {
                session: {
                    Location: response.headers.get('Location'),
                }
            };
        },

        async uploadGetProgress(request, root_attr, data,) {
            const response = await fetch(data.session["Location"], {
                ...attachBackend(data.session["Location"]), method: 'PUT', headers: {
                    Authorization: core(root_attr).get_Authorization(root_attr), 'Content-Range': "bytes */*",
                },
            });
            if (response.status === 200 || response.status === 201) {
                return {
                    "status": 200,
                }
            } else if (response.status !== 308) {
                return {
                    "status": 404,
                }
            }
            let re = /bytes=0-(\d+)/, range = response.headers.get('Range') || ""
            if (re.test(range)) {
                return {
                    "status": 308, "present": parseInt(range.match(re)[1], 10),
                }
            }
            return {
                "status": 404,
            }
        },

        async uploadGoOn(request, root_attr, session,) {
            // console.log("uploadGoOn", request);
            let headers = {};
            if (request.headers.get("Content-Range")) {
                headers["Content-Range"] = request.headers.get("Content-Range")
            }
            return fetch(session['Location'], {
                ...attachBackend(session["Location"]),
                method: 'PUT',
                headers: {Authorization: core(root_attr).get_Authorization(root_attr), ...headers,},

                // body: request.body, // fastly下报错503 Service Unavailable
                body: await preReadForUpload(request),
            });
        },

    },

    [Types.zoho_workdrive]: {
        _attached_headers: {
            'Accept': 'application/vnd.api+json; charset=utf-8', // https://workdrive.zoho.com/apidocs/v1/gettingstarted/request-header
            'Accept-Language': 'en-US,en;q=0.5',

            'Accept-Encoding': 'gzip, deflate, br',

            // 'Accept-Charset': 'utf-8',
        },

        _dc_domain: {
            [DataCentres.us]: ["accounts.zoho.com", "www.zohoapis.com", "download.zoho.com", "upload.zoho.com", "api-console.zoho.com",],
            [DataCentres.eu]: ["accounts.zoho.eu", "www.zohoapis.eu", "download.zoho.eu", "upload.zoho.eu", "api-console.zoho.eu",],
            [DataCentres.au]: ["accounts.zoho.com.au", "www.zohoapis.com.au", "download.zoho.com.au", "upload.zoho.com.au", "api-console.zoho.com.au",],
            [DataCentres.in]: ["accounts.zoho.in", "www.zohoapis.in", "download.zoho.in", "upload.zoho.in", "api-console.zoho.in",],
            [DataCentres.jp]: ["accounts.zoho.jp", "www.zohoapis.jp", "download.zoho.jp", "upload.zoho.jp", "api-console.zoho.jp",],
            [DataCentres.cn]: ["accounts.zoho.com.cn", "www.zohoapis.com.cn", "download.zoho.com.cn", "upload.zoho.com.cn", "api-console.zoho.com.cn",],
        },

        _get_dc_domain(root_attr,) {
            return core(root_attr)._dc_domain[root_attr.data_centre];
        },

        _get_token_url(root_attr) {
            return `https://${core(root_attr)._get_dc_domain(root_attr)[0]}/oauth/v2/token`;
        },

        _get_base_url(root_attr) {
            return `https://${core(root_attr)._get_dc_domain(root_attr)[1]}/workdrive`;
        },

        _get_api_url(root_attr) {
            return `https://${core(root_attr)._get_dc_domain(root_attr)[1]}/workdrive/api/v1`;
        },

        _get_download_url(root_attr) {
            return `https://${core(root_attr)._get_dc_domain(root_attr)[2]}/v1/workdrive/download`;
        },

        _get_upload_url(root_attr) {
            return `https://${core(root_attr)._get_dc_domain(root_attr)[3]}/workdrive-api/v1/stream/upload`;
        },

        async _get_privatespace_attr(root_attr) {
            // console.log("_get_privatespace_attr", root_attr)
            if (!root_attr._privatespace_attr) {
                const url = new URL(`${core(root_attr)._get_api_url(root_attr)}/users/me`);
                const response = await fetch(url, {
                    ...attachBackend(url), method: 'GET', headers: {
                        ...core(root_attr)._attached_headers,   // 'Content-Type': 'application/json',
                        Authorization: core(root_attr).get_Authorization(root_attr),
                    },
                });
                // console.log("_get_privatespace_attr sent",);

                // const buffer = await response.arrayBuffer(); // arrayBuffer返回的是不是未压缩的？在fastly下怎么得到的是gzip数据？
                // const uint8Array = new Uint8Array(buffer);
                // console.log("uint8Array", uint8Array)
                // const decoder = new TextDecoder('utf-8', {fatal: false});
                // let data = decoder.decode(uint8Array);

                let data = (await response.text());

                // console.log("_get_privatespace_attr2", url, response.status, {...response.headers}, data)
                // let data = (await response.json());
                data = JSON.parse(data);
                let userid = data["data"]["id"];
                {
                    const url = new URL(`${core(root_attr)._get_api_url(root_attr)}/users/${userid}/privatespace`);
                    const response = await fetch(url, {
                        ...attachBackend(url), method: 'GET', headers: {
                            ...core(root_attr)._attached_headers, // 'Content-Type': 'application/json',
                            Authorization: core(root_attr).get_Authorization(root_attr),
                        },
                    });
                    let data = (await response.text());
                    // console.log("_get_privatespace_attr3", url, response.status, {...response.headers}, data)
                    data = JSON.parse(data);
                    root_attr._privatespace_attr = data["data"][0];
                }
            }
        },

        _is_privatespace(root_attr, id) {
            return id === root_attr._privatespace_attr.id
        },

        _spacename(root_attr, id) {
            return core(root_attr)._is_privatespace(root_attr, id) ? "privatespace" : "files";
        },

        get_Authorization(root_attr,) {
            return root_attr.Authorization;
        },

        isAuthorized(root_attr,) {
            // console.log("isAuthorized", Cores.access_token);
            return !!root_attr.access_token;
        },

        can_trash: true,
        can_share: false,
        can_copy: false,
        can_shortcut: false,
        can_zip: false,
        can_chunk: false,
        can_resume: false,
        max_upload_size: -1,

        isShared(item) {
            if (!item) {
                return false;
            }
            return false;
        },

        async initializeClient(root_attr,) {
            if (root_attr.Authorization) {
                if (Date.now() < root_attr.access_token_expires) {
                    return;
                }
            }
            // const requestData = {
            //     client_id: root_attr.client_id,
            //     client_secret: root_attr.client_secret,
            //     refresh_token: root_attr.refresh_token,
            //     grant_type: "refresh_token",
            // };
            const queryString = new URLSearchParams({
                client_id: root_attr.client_id,
                client_secret: root_attr.client_secret,
                refresh_token: root_attr.refresh_token,
                grant_type: "refresh_token",
            }).toString();
            const url = new URL(`${core(root_attr)._get_token_url(root_attr)}?${queryString}`);
            const response = await fetch(url, {
                ...attachBackend(url), method: 'POST',
            });
            const data = await response.json();

            root_attr.access_token = data["access_token"];
            root_attr.access_token_expires = Date.now() + 3400 * 1000;
            root_attr.Authorization = `Bearer ${data["access_token"]}`;
            // console.log("root_attr.Authorization", response, data, root_attr.Authorization);

            await core(root_attr)._get_privatespace_attr(root_attr)
            if (root_attr.id === "root") {
                root_attr.id = root_attr._privatespace_attr.id;
            }
        },

        async checkId(root_attr, id,) {
            if (id === "root" || id === root_attr._privatespace_attr.id) return true;
            const queryString = new URLSearchParams({}).toString();
            const url = new URL(`${core(root_attr)._get_api_url(root_attr)}/${core(root_attr)._spacename(root_attr, id)}/${id}?${queryString}`);
            let resp = await fetch(url, {
                ...attachBackend(url), method: 'GET', headers: {
                    ...core(root_attr)._attached_headers,
                    'Content-Type': 'application/json',
                    Authorization: core(root_attr).get_Authorization(root_attr),
                },
            });
            // console.log(resp, await resp.json())
            if (resp.status === 200) {
                return true;
            }
            return false;
        },

        async getId(request, root_attr, parentId, childName, resolve_symlink) {
            childName = childName.replace(/\'/g, `\\'`); // escape single quote
            let list = [];
            let data = await Cores.listFolder(request, root_attr, parentId);
            for (const datumElement of data["files"]) {
                let c = await Cores.formatInfo(request, root_attr, datumElement);
                list.push(c);
            }
            for (const listElement of list) {
                if (listElement["name"] === childName) {
                    return listElement["id"];
                }
            }
            return null;

        },

        async resolvePath(request, root_attr, path, resolve_symlink = 0) {
            const toks = path.split('/').map(decodeURIComponent).map(decodeURIComponent).filter(Boolean);
            let id = root_attr.id;
            let name = null;
            let parents = [];
            let rs = false;
            for (let i = 0; i < toks.length; i++) {
                if (resolve_symlink === 0) {
                    rs = false;
                } else if (resolve_symlink === 1) {
                    rs = true;
                } else if (resolve_symlink < 0) {
                    if (i - toks.length >= resolve_symlink) {
                        rs = false;
                    } else {
                        rs = true;
                    }
                }
                parents.push({id, name});
                id = await Cores.getId(request, root_attr, id, toks[i], rs);
                name = toks[i];
                if (!id) return {id, name, parents};
            }
            console.log("Cores.resolvePath", id, toks,);
            return {id, name, parents};
        },

        async formatInfo(request, root_attr, datumElement,) {
            // console.log(datumElement)
            let c;
            if (datumElement.id === root_attr._privatespace_attr.id) { // 根目录
                c = {
                    "id": datumElement["id"],
                    "type": ItemTypes.folder,
                    "name": "根目录",
                    "size": null,
                    "shared": false,
                    "modified_time": null,
                };
            } else {
                c = {
                    "id": datumElement["id"],
                    "type": datumElement["attributes"]["is_folder"] ? ItemTypes.folder : ItemTypes.file,
                    "name": datumElement["attributes"]["name"],
                    "size": null,
                    "shared": Cores.isShared(datumElement),
                    "modified_time": display_modified_time ? parseInt(datumElement["attributes"]["modified_time_in_millisecond"] / 1000) : null,
                };
                if (datumElement["attributes"]["storage_info"]) {
                    c["size"] = parseInt(datumElement["attributes"]["storage_info"]["size_in_bytes"]);
                }
                if (Cores.isSymlink(c)) {
                }
            }
            return c;
        },

        async getInfo(request, root_attr, id,) {
            let datumElement = await Cores.getMeta(request, root_attr, id);
            if (!datumElement) return null;
            return Cores.formatInfo(request, root_attr, datumElement);
        },

        async getInfoByPath(request, root_attr, path,) {
            const id = (await Cores.resolvePath(request, root_attr, path, -1))["id"];
            if (!id) return null;
            return Cores.getInfo(request, root_attr, id,);
        },

        async getMeta(request, root_attr, id,) {
            if (core(root_attr)._is_privatespace(root_attr, id)) {
                return root_attr._privatespace_attr;
            }
            const queryString = new URLSearchParams({}).toString();
            const url = new URL(`${core(root_attr)._get_api_url(root_attr)}/${core(root_attr)._spacename(root_attr, id)}/${id}?${queryString}`);
            let resp = await fetch(url, {
                ...attachBackend(url), method: 'GET', headers: {
                    ...core(root_attr)._attached_headers,
                    'Content-Type': 'application/json',
                    Authorization: core(root_attr).get_Authorization(root_attr),
                },
            });
            // console.log("getMeta", resp.status);
            if (resp.status !== 200) return null;
            return (await resp.json())["data"];
        },

        async listFolder(request, root_attr, id) {
            const getList = pageToken => {
                // console.log("pageToken", pageToken)
                if (pageToken) {
                    // pageToken https://www.zohoapis.com.au/workdrive/api/v1/files/g33/files?page[next]=376
                    const qs = {
                        "page[limit]": "1000",
                        "fields[files]": "parent_id,type,name,is_folder,storage_info,status,modified_time_in_millisecond",
                    };
                    const queryString = new URLSearchParams(qs).toString();
                    const url = new URL(`${pageToken}&${queryString}`);
                    return fetch(url, {
                        ...attachBackend(url), method: 'GET', headers: {
                            ...core(root_attr)._attached_headers,
                            'Content-Type': 'application/json',
                            Authorization: core(root_attr).get_Authorization(root_attr),
                        },
                    });
                } else {
                    const qs = {
                        "page[next]": "0",
                        "page[limit]": "1000",
                        "fields[files]": "parent_id,type,name,is_folder,storage_info,status,modified_time_in_millisecond",
                    };
                    const queryString = new URLSearchParams(qs).toString();
                    const url = new URL(`${core(root_attr)._get_api_url(root_attr)}/${core(root_attr)._spacename(root_attr, id)}/${id}/files?${queryString}`);
                    return fetch(url, {
                        ...attachBackend(url), method: 'GET', headers: {
                            ...core(root_attr)._attached_headers,
                            'Content-Type': 'application/json',
                            Authorization: core(root_attr).get_Authorization(root_attr),
                        },
                    });
                }
            };
            const files = [];
            let pageToken;
            do {
                let resp = await getList(pageToken);
                let data = await resp.text();
                // console.log("Cores.listFolder", id, resp, data,);
                data = JSON.parse(data);
                if (data.errors && data.errors.length > 0) {
                    throw Error(JSON.stringify(data.errors));
                }
                files.push(...data.data);
                if (data.links && data["links"]["cursor"]["has_next"]) {
                    pageToken = data["links"]["cursor"]["next"];
                } else {
                    pageToken = null;
                }
            } while (pageToken);
            return {
                files
            };
        },

        async listFolderByPath(request, root_attr, path,) {
            let id = (await Cores.resolvePath(request, root_attr, path, 1))["id"];
            if (!id) return null;

            let list = [];
            let data = await Cores.listFolder(request, root_attr, id);
            for (const datumElement of data["files"]) {
                let c = await Cores.formatInfo(request, root_attr, datumElement);
                list.push(c);
            }
            list.sort((a, b) => {
                if (Cores.isFolder(a) && !Cores.isFolder(b)) {
                    return -1;
                }
                if (a.name < b.name) return 1;
                if (a.name > b.name) return 2;
                return 0;
            })
            return {
                "parent": root_attr.btn_goto_drive ? id : null, "list": list,
            };
        },

        async moveByPath(request, root_attr, data,) {
            // console.log("moveByPath", data);
            const {id: source_id, name,} = await Cores.resolvePath(request, root_attr, data["source"], -1);
            // console.log("moveByPath source_id", source_id);
            if (!source_id) return null;
            let to_id = (await Cores.resolvePath(request, root_attr, data["to"], 1))["id"];
            // console.log("moveByPath to_id", to_id);
            if (!to_id) return null;

            if (root_attr.unique_name && !await Cores.checkUniqueName(request, root_attr, to_id, name)) {
                return null;
            }

            const qs = {};
            const queryString = new URLSearchParams(qs).toString();
            const url = new URL(`${core(root_attr)._get_api_url(root_attr)}/${core(root_attr)._spacename(root_attr, source_id)}/${source_id}?${queryString}`);
            const response = await fetch(url, {
                ...attachBackend(url), method: 'PATCH', headers: {
                    ...core(root_attr)._attached_headers,
                    'Content-Type': 'application/json',
                    Authorization: core(root_attr).get_Authorization(root_attr),
                }, body: JSON.stringify({
                    "data": {
                        "attributes": {
                            "parent_id": to_id
                        }, "type": "files"
                    }
                })
            });
            return response.json();
        },

        async renameByPath(request, root_attr, data,) {
            const {id: source_id, parents} = await Cores.resolvePath(request, root_attr, data["source"], -1,);
            if (!source_id) return null;

            if (root_attr.unique_name && !await Cores.checkUniqueName(request, root_attr, parents.at(-1)["id"], data["name"])) {
                return null;
            }

            const qs = {};
            const queryString = new URLSearchParams(qs).toString();
            const url = new URL(`${core(root_attr)._get_api_url(root_attr)}/${core(root_attr)._spacename(root_attr, source_id)}/${source_id}?${queryString}`);
            const response = await fetch(url, {
                ...attachBackend(url), method: 'PATCH', headers: {
                    ...core(root_attr)._attached_headers,
                    'Content-Type': 'application/json',
                    Authorization: core(root_attr).get_Authorization(root_attr),
                }, body: JSON.stringify({
                    "data": {
                        "attributes": {
                            "name": data["name"]
                        }, "type": "files"
                    }
                }),
            });
            return response.json();
        },

        async shareByPath(request, root_attr, data,) {
            return null;
        },

        async trash(request, root_attr, did,) {
            const qs = {};
            const queryString = new URLSearchParams(qs).toString();
            const url = new URL(`${core(root_attr)._get_api_url(root_attr)}/${core(root_attr)._spacename(root_attr, did)}/${did}?${queryString}`);
            const response = await fetch(url, {
                ...attachBackend(url), method: 'PATCH', headers: {
                    ...core(root_attr)._attached_headers,
                    'Content-Type': 'application/json',
                    Authorization: core(root_attr).get_Authorization(root_attr),
                }, body: JSON.stringify({
                    "data": {
                        "attributes": {
                            "status": "51"
                        }, "type": "files"
                    }
                }),
            });
            return response.json();
        },

        async trashByPath(request, root_attr, data,) {
            const source_id = (await Cores.resolvePath(request, root_attr, data["source"], -1,))["id"];
            if (!source_id) return null;
            return await Cores.trash(request, root_attr, source_id);
        },

        async delete(request, root_attr, did,) {
            await Cores.trash(request, root_attr, did); // 先回收
            const qs = {};
            const queryString = new URLSearchParams(qs).toString();
            const url = new URL(`${core(root_attr)._get_api_url(root_attr)}/${core(root_attr)._spacename(root_attr, did)}/${did}?${queryString}`);
            const response = await fetch(url, {
                ...attachBackend(url), method: 'PATCH', headers: {
                    ...core(root_attr)._attached_headers,
                    'Content-Type': 'application/json',
                    Authorization: core(root_attr).get_Authorization(root_attr),
                }, body: JSON.stringify({
                    "data": {
                        "attributes": {
                            "status": "61"
                        }, "type": "files"
                    }
                }),
            });
            // return response.json();
            return response.status.toString()
        },

        async deleteByPath(request, root_attr, data,) {
            const source_id = (await Cores.resolvePath(request, root_attr, data["source"], -1,))["id"];
            if (!source_id) return null;
            return await Cores.delete(request, root_attr, source_id);
        },

        async trashSelectedByPath(request, root_attr, data,) {
            const location_id = (await Cores.resolvePath(request, root_attr, data["location"], 1,))["id"];
            if (!location_id) return null;

            for (const name of data["names"]) {
                const source_id = await Cores.getId(request, root_attr, location_id, name, false,);
                if (!source_id || source_id === "root") continue;
                await Cores.trash(request, root_attr, source_id);
            }
            return {};
        },

        async deleteSelectedByPath(request, root_attr, data,) {
            const location_id = (await Cores.resolvePath(request, root_attr, data["location"], 1,))["id"];
            if (!location_id) return null;

            for (const name of data["names"]) {
                const source_id = await Cores.getId(request, root_attr, location_id, name, false,);
                if (!source_id || source_id === "root") continue;
                await Cores.delete(request, root_attr, source_id);
            }
            return {};
        },

        async replySelectedByPath(request, root_attr, data,) {
            const location_id = (await Cores.resolvePath(request, root_attr, data["location"], 1,))["id"];
            if (!location_id) return null;

            const results = [];

            for (const name of data["names"]) {
                const source_id = await Cores.getId(request, root_attr, location_id, name, false,);
                if (!source_id || source_id === "root") continue;

                const newName = name.includes('.') ? name.replace(/(\.[^.]*)$/, '【OK】$1') : `${name}【OK】`;

                await Cores.renameByPath(request, root_attr, {
                    source: `${data["location"]}/${name}`,
                    name: newName,
                });
            }
            return {};
        },

        async newFolderByPath(request, root_attr, data, path,) {
            let id = (await Cores.resolvePath(request, root_attr, path, 1))["id"];
            if (!id) return null;

            if (root_attr.unique_name && data["name"] && !await Cores.checkUniqueName(request, root_attr, id, data["name"])) {
                return null;
            }

            data["names"] = data.names || [];
            if (data["name"]) data["names"].push(data["name"]);
            let r = []
            for (const name of data["names"]) {
                if (root_attr.unique_name && !await Cores.checkUniqueName(request, root_attr, id, name)) {
                    continue;
                }
                const qs = {};
                const queryString = new URLSearchParams(qs).toString();
                const url = new URL(`${core(root_attr)._get_api_url(root_attr)}/files?${queryString}`);
                const response = await fetch(url, {
                    ...attachBackend(url), method: 'POST', headers: {
                        ...core(root_attr)._attached_headers,
                        'Content-Type': 'application/json',
                        Authorization: core(root_attr).get_Authorization(root_attr),
                    }, body: JSON.stringify({
                        "data": {
                            "attributes": {
                                "name": name, "parent_id": id,
                            }, "type": "files"
                        }
                    }),
                });
                // console.log("newFolderByPath", response.status, response);
                if (response.status !== 200) {
                    r.push(false);
                }
                r.push(await response.json());
            }
            return r;
        },

        async zipByPath(request, root_attr, data,) {
            return null;
        },

        async newShortcutByPath(request, root_attr, data, path,) {
            return null;
        },

        async copyFromByPath(request, root_attr, data, path,) {
            return null;
        },

        async resolveTree(request, root_attr, data, tree, summary, paths,) {
            let li = await Cores.listFolder(request, root_attr, data["source"]);
            for (const datumElement of li["files"]) {
                let c = await Cores.formatInfo(request, root_attr, datumElement);
                tree.children.push(c);
                if (Cores.isFolder(c, false)) {
                    c["children"] = [];
                    summary.folderCount++;
                    let id = Cores.isSymlink(c) ? c["symlink_target"]["id"] : c["id"];
                    if (!paths.includes(id)) {
                        await Cores.resolveTree(request, root_attr, {source: id,}, c, summary, [...paths, id,])
                    } else {
                        c["recur"] = true;
                    }
                } else {
                    summary.fileCount++;
                    summary.totalSize += parseInt(c["size"]);
                }
            }
        },

        async download(request, root_attr, meta, range) {
            const qs = {};
            const queryString = new URLSearchParams(qs).toString();
            const url = `${core(root_attr)._get_download_url(root_attr)}/${meta["id"]}`;
            const headers = {
                Authorization: core(root_attr).get_Authorization(root_attr), Range: range,
            };
            return fetch(url, {
                ...attachBackend(url), method: 'GET', headers: headers,
            });
        },

        async uploadByPath(request, root_attr, path, name,) {
            let id = (await Cores.resolvePath(request, root_attr, path, 1,))["id"];
            if (!id) return null;

            if (root_attr.unique_name && !await Cores.checkUniqueName(request, root_attr, id, name)) {
                return null;
            }

            const qs = {};
            const queryString = new URLSearchParams(qs).toString();
            const url = `${core(root_attr)._get_upload_url(root_attr)}?${queryString}`
            const headers = {
                Authorization: core(root_attr).get_Authorization(root_attr),
                "x-filename": encodeURIComponent(name),
                "x-parent_id": id,
                "upload-id": generateRandomString(16),
                "x-streammode": "1",
            }
            // console.log(url, headers)
            const v = await fetch(url, {
                ...attachBackend(url), method: 'POST', headers: headers,

                // body: request.body, // netlify下报错400 // fastly也报错
                body: await preReadForUpload(request),

            });
            // console.log(v.status, v.headers, await v.text());
            return v;
        },

        async uploadNewSessionByPath(request, root_attr, path, name,) {
            return null;
        },

        async uploadGetProgress(request, root_attr, data,) {
            return null;
        },

        async uploadGoOn(request, root_attr, session,) {
            return null;
        },

    },

    [Types.cf_d1_kv]: {
        ItemTypes: Object.freeze({
            file: 1, folder: 2,
        }), // 也用于位运算

        // db: null, // 已改为绑定到root_attr上
        // kv: null,
        db_did_length: 12,

        async exec_sql(root_attr, sql) {
            // console.log("sql:", sql);
            return root_attr.db.exec(sql); // {count: 1, duration: 0.1}
        },

        isAuthorized(root_attr,) {
            return !!root_attr.Initialized;
        },

        can_trash: false,
        can_share: false,
        can_copy: false,
        can_shortcut: false,
        can_zip: false,
        can_chunk: false,
        can_resume: false,
        max_upload_size: 25,

        isShared(item) {
            return false;
        },

        async initializeClient(root_attr,) {
            if (root_attr.Initialized) {
                return;
            }
            root_attr.db = root_attr.env[root_attr.binding_db];
            root_attr.kv = root_attr.env[root_attr.binding_kv];

            // sql = `DROP TABLE IF EXISTS ${root_attr.db_table_name};`; // 删表
            // await core(root_attr).exec_sql(root_attr, sql);

            sql = `CREATE TABLE IF NOT EXISTS ${root_attr.db_table_name}
                   (`; // 创建表
            sql += `did varchar(${core(root_attr).db_did_length}) PRIMARY KEY UNIQUE NOT NULL CHECK (LENGTH(did) == ${core(root_attr).db_did_length}),`;
            sql += `name varchar(10240) NOT NULL CHECK (LENGTH(name) > 0 AND LENGTH(name) <= 10240),`;
            sql += `type INTEGER NOT NULL CHECK (type IN (1, 2)),`; // 1=文件,2=文件夹
            sql += `size INTEGER NOT NULL DEFAULT 0 CHECK (size >= 0),`;
            sql += `hash varchar(40) CHECK (hash IS NULL OR LENGTH(hash) == 40),`;
            sql += `uploaded INTEGER NOT NULL DEFAULT 0 CHECK (uploaded IN (0, 1)),`; // 0=未上传
            sql += `uploaded_time TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,`; // DATETIME('now')不行，SELECT CURRENT_DATE;是常量
            sql += `parent varchar,`;
            sql += `CONSTRAINT parent_set FOREIGN KEY ("parent") REFERENCES "${root_attr.db_table_name}"("did") ON DELETE RESTRICT,`;
            sql += `CONSTRAINT no_self_reference CHECK (parent IS NULL OR did != parent),`;
            sql += `CHECK (uploaded_time LIKE '____-__-__ __:__:__')`; // 需要扩展才支持REGEXP '^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$'
            sql += `);`;
            await core(root_attr).exec_sql(root_attr, sql);

            root_attr.Initialized = true;
        },

        async checkId(root_attr, id,) {
            if (id === "root") return true;
            sql = `SELECT *
                   FROM ${root_attr.db_table_name}
                   WHERE did = "${id}";`;
            let r = await root_attr.db.prepare(sql).all();
            if (r["success"] && r["results"].length > 0) {
                return true;
            }
            return false;
        },

        async getId(request, root_attr, parentId, childName, resolve_symlink, includes = 0) {
            childName = childName.replace(/\'/g, `\\'`); // escape single quote
            if (parentId === "root") {
                sql = `SELECT *
                       FROM ${root_attr.db_table_name}
                       WHERE parent IS NULL
                         AND name = "${childName}"
                         AND uploaded = 1;`;
            } else {
                sql = `SELECT *
                       FROM ${root_attr.db_table_name}
                       WHERE parent = "${parentId}"
                         AND name = "${childName}"
                         AND uploaded = 1;`;
            } //  AND type = ${core(root_attr).ItemTypes.folder}
            if (includes > 0) {
                if (includes & core(root_attr).ItemTypes.file && includes & core(root_attr).ItemTypes.folder) {
                } else if (includes & core(root_attr).ItemTypes.file) {
                    sql = replaceWithLimit(sql, /AND/g, `AND type = ${core(root_attr).ItemTypes.file} AND`, 1);
                } else if (includes & core(root_attr).ItemTypes.folder) {
                    sql = replaceWithLimit(sql, /AND/g, `AND type = ${core(root_attr).ItemTypes.folder} AND`, 1);
                }
            }
            let r = await root_attr.db.prepare(sql).all();
            if (r["success"] && r["results"].length > 0) {
                return r["results"][0]["did"];
            }
        },

        async resolvePath(request, root_attr, path, resolve_symlink = 0, includes = 0) {
            const toks = path.split('/').map(decodeURIComponent).map(decodeURIComponent).filter(Boolean);
            let id = root_attr.id;
            let name = null;
            let parents = [];
            let rs = false;
            for (let i = 0; i < toks.length; i++) {
                if (resolve_symlink === 0) {
                    rs = false;
                } else if (resolve_symlink === 1) {
                    rs = true;
                } else if (resolve_symlink < 0) {
                    if (i - toks.length >= resolve_symlink) {
                        rs = false;
                    } else {
                        rs = true;
                    }
                }
                parents.push({id, name});
                id = await Cores.getId(request, root_attr, id, toks[i], rs, includes);
                name = toks[i];
                if (!id) return {id, name, parents};
            }
            console.log("Cores.resolvePath", id, toks,);
            return {id, name, parents};
        },

        async formatInfo(request, root_attr, datumElement,) {
            let c = {
                "id": datumElement["did"],
                "type": datumElement["type"] === core(root_attr).ItemTypes.folder ? ItemTypes.folder : ItemTypes.file,
                "name": datumElement["name"],
                "size": "size" in datumElement ? datumElement["size"] : null,
                "shared": Cores.isShared(datumElement),
                "modified_time": display_modified_time ? parseInt(new Date(datumElement["uploaded_time"]).getTime() / 1000) : null,
            };
            if (Cores.isSymlink(c)) {
            }
            return c;
        },

        async getInfo(request, root_attr, id,) {
            let datumElement = await Cores.getMeta(request, root_attr, id);
            return Cores.formatInfo(request, root_attr, datumElement);
        },

        async getInfoByPath(request, root_attr, path,) {
            const id = (await Cores.resolvePath(request, root_attr, path, -1))["id"];
            if (!id) return null;
            return Cores.getInfo(request, root_attr, id,);
        },

        async getMeta(request, root_attr, id,) {
            sql = `SELECT *
                   FROM ${root_attr.db_table_name}
                   WHERE did = "${id}"`;
            let r = await root_attr.db.prepare(sql).first();
            console.log("getMeta", r);
            return r;
        },

        async listFolder(request, root_attr, id) {
            if (id === "root") {
                sql = `SELECT *
                       FROM ${root_attr.db_table_name}
                       WHERE parent IS NULL
                         AND uploaded = 1
                       ORDER BY "type" DESC, "name" ASC;`;
            } else {
                sql = `SELECT *
                       FROM ${root_attr.db_table_name}
                       WHERE parent = "${id}"
                         AND uploaded = 1
                       ORDER BY "type" DESC, "name" ASC;`;
            }
            let r = await root_attr.db.prepare(sql).all();
            if (r["success"]) {
                // sql = `SELECT * FROM ${root_attr.db_table_name} WHERE "did"="${id}";`;
                // console.log(await root_attr.db.prepare(sql).first());
                return {
                    files: r["results"],
                }
            }
        },

        async listFolderByPath(request, root_attr, path,) {
            let id = (await Cores.resolvePath(request, root_attr, path, 1, core(root_attr).ItemTypes.folder))["id"];
            if (!id) return null;

            let list = [];
            let data = await Cores.listFolder(request, root_attr, id);
            for (const datumElement of data["files"]) {
                let c = await Cores.formatInfo(request, root_attr, datumElement);
                list.push(c);
            }
            return {
                "parent": root_attr.btn_goto_drive ? id : null, "list": list,
            };
        },

        async moveByPath(request, root_attr, data,) {
            const {id: source_id, name,} = await Cores.resolvePath(request, root_attr, data["source"], -1);
            if (!source_id) return null;
            let to_id = (await Cores.resolvePath(request, root_attr, data["to"], 1))["id"];
            if (!to_id) return null;

            if (root_attr.unique_name && !await Cores.checkUniqueName(request, root_attr, to_id, name)) {
                return null;
            }

            if (source_id === "root") return {};
            if (to_id === "root") {
                sql = `UPDATE ${root_attr.db_table_name}
                       SET "parent"=NULL
                       WHERE "did" = "${source_id}";`;
            } else {
                sql = `UPDATE ${root_attr.db_table_name}
                       SET "parent"="${to_id}"
                       WHERE "did" = "${source_id}";`;
            }
            let r = await core(root_attr).exec_sql(root_attr, sql);
            return r;
        },

        async renameByPath(request, root_attr, data,) {
            const {id: source_id, parents} = await Cores.resolvePath(request, root_attr, data["source"], -1,);
            if (!source_id) return null;

            if (root_attr.unique_name && !await Cores.checkUniqueName(request, root_attr, parents.at(-1)["id"], data["name"])) {
                return null;
            }

            if (source_id === "root") return {};
            sql = `UPDATE ${root_attr.db_table_name}
                   SET "name"="${data["name"]}",
                       "uploaded_time"=CURRENT_TIMESTAMP
                   WHERE "did" = "${source_id}";`;
            let r = await core(root_attr).exec_sql(root_attr, sql);
            return r;
        },

        async shareByPath(request, root_attr, data,) {
            return null;
        },

        async trash(request, root_attr, did,) {
            return {};
        },

        async trashByPath(request, root_attr, data,) {
            await Cores.trash(request, root_attr, null);
        },

        async delete(request, root_attr, did) {
            let r = null;
            sql = `SELECT *
                   FROM ${root_attr.db_table_name}
                   WHERE parent = "${did}"
                     AND type = ${core(root_attr).ItemTypes.file}
                   ORDER BY "type" DESC, "name" ASC;`;
            r = await root_attr.db.prepare(sql).all();
            let dids = [];
            for (const i of r["results"]) {
                await root_attr.kv.delete(i["did"]);
                dids.push(`"${i["did"]}"`);
            }
            if (dids.length > 0) {
                sql = `DELETE
                       FROM ${root_attr.db_table_name}
                       WHERE did IN (${dids.join(",")})`;
                await core(root_attr).exec_sql(root_attr, sql);
            }
            sql = `SELECT *
                   FROM ${root_attr.db_table_name}
                   WHERE parent = "${did}"
                     AND type = ${core(root_attr).ItemTypes.folder}
                   ORDER BY "type" DESC, "name" ASC;`;
            r = await root_attr.db.prepare(sql).all();
            if (r["success"]) {
                for (const i of r["results"]) {
                    await Cores.delete(request, root_attr, i["did"]);
                }
            }
            sql = `SELECT *
                   FROM ${root_attr.db_table_name}
                   WHERE did = "${did}"
                     AND type = ${core(root_attr).ItemTypes.file}
                   ORDER BY "type" DESC, "name" ASC;`;
            r = await root_attr.db.prepare(sql).all();
            for (const i of r["results"]) {
                await root_attr.kv.delete(i["did"]);
            }
            sql = `DELETE
                   FROM ${root_attr.db_table_name}
                   WHERE "did" = "${did}";`;
            await core(root_attr).exec_sql(root_attr, sql);
        },

        async deleteByPath(request, root_attr, data,) {
            const source_id = (await Cores.resolvePath(request, root_attr, data["source"], -1,))["id"];
            if (!source_id) return null;

            if (source_id === "root") return {};
            await Cores.delete(request, root_attr, source_id);
            return {};
        },

        async trashSelectedByPath(request, root_attr, data,) {
            return {};
        },

        async deleteSelectedByPath(request, root_attr, data,) {
            const location_id = (await Cores.resolvePath(request, root_attr, data["location"], 1,))["id"];
            if (!location_id) return null;

            for (const name of data["names"]) {
                const source_id = await Cores.getId(request, root_attr, location_id, name, false,);
                if (!source_id || source_id === "root") continue;
                await Cores.delete(request, root_attr, source_id);
            }
            return {};
        },

        async replySelectedByPath(request, root_attr, data,) {
            const location_id = (await Cores.resolvePath(request, root_attr, data["location"], 1,))["id"];
            if (!location_id) return null;

            const results = [];

            for (const name of data["names"]) {
                const source_id = await Cores.getId(request, root_attr, location_id, name, false,);
                if (!source_id || source_id === "root") continue;

                const newName = name.includes('.') ? name.replace(/(\.[^.]*)$/, '【OK】$1') : `${name}【OK】`;

                await Cores.renameByPath(request, root_attr, {
                    source: `${data["location"]}/${name}`,
                    name: newName,
                });
            }
            return {};
        },

        async newFolderByPath(request, root_attr, data, path,) {
            let id = (await Cores.resolvePath(request, root_attr, path, 1))["id"];
            if (!id) return null;

            if (root_attr.unique_name && !await Cores.checkUniqueName(request, root_attr, id, data["name"])) {
                return null;
            }

            let randid = generateRandomString(core(root_attr).db_did_length);
            sql = `SELECT *
                   FROM ${root_attr.db_table_name}
                   WHERE "did" = "${randid}";`;
            let n = 0;
            while (await root_attr.db.prepare(sql).first() && n < 100) {
                n++;
                randid = generateRandomString(core(root_attr).db_did_length);
                sql = `SELECT *
                       FROM ${root_attr.db_table_name}
                       WHERE "did" = "${randid}";`;
            }

            sql = `INSERT INTO ${root_attr.db_table_name} ("did", "name", "type", "uploaded", "parent")
                   VALUES (`;
            sql += `"${randid}", "${data["name"]}", ${core(root_attr).ItemTypes.folder}, 1, ${id === "root" ? "NULL" : `"${id}"`}`;
            sql += `);`;
            let r = await core(root_attr).exec_sql(root_attr, sql);
            return r;
        },

        async zipByPath(request, root_attr, data,) {
            return {};
        },

        async newShortcutByPath(request, root_attr, data, path,) {
            return {};
        },

        async copyFromByPath(request, root_attr, data, path,) {
            return {};
        },

        async resolveTree(request, root_attr, data, tree, summary, paths,) {
            let li = await Cores.listFolder(request, root_attr, data["source"]);
            for (const datumElement of li["files"]) {
                let c = await Cores.formatInfo(request, root_attr, datumElement);
                tree.children.push(c);
                if (Cores.isFolder(c, false)) {
                    c["children"] = [];
                    summary.folderCount++;
                    let id = Cores.isSymlink(c) ? c["symlink_target"]["id"] : c["id"];
                    if (!paths.includes(id)) {
                        await Cores.resolveTree(request, root_attr, {source: id,}, c, summary, [...paths, id,])
                    } else {
                        c["recur"] = true;
                    }
                } else {
                    summary.fileCount++;
                    summary.totalSize += parseInt(c["size"]);
                }
            }
        },

        async download(request, root_attr, meta, range) {
            let {start, end} = parseDownloadRange(range, meta);
            // console.log("download", start, end);
            const fullBinaryData = new Uint8Array(await root_attr.kv.get(meta["id"], {type: 'arrayBuffer'}));
            const slicedBinaryData = fullBinaryData.slice(start, end + 1);
            return {
                status: range ? 206 : 200, body: slicedBinaryData, headers: {
                    "Content-Length": slicedBinaryData.length,
                    "Content-Range": `bytes ${start}-${end}/${fullBinaryData.length}`,
                },
            }
        },

        async uploadByPath(request, root_attr, path, name,) {
            let id = (await Cores.resolvePath(request, root_attr, path, 1,))["id"];
            if (!id) return null;

            if (root_attr.unique_name && !await Cores.checkUniqueName(request, root_attr, id, name)) {
                return null;
            }

            // const reader = request.body.getReader();
            // let chunks = '';
            // while (true) {
            //     const { done, value } = await reader.read();
            //     if (done) break;
            //     chunks += new TextDecoder().decode(value);
            // }
            // console.log(chunks);

            const arrayBuffer = await request.arrayBuffer();
            // const binaryData = new Uint8Array(arrayBuffer);
            // console.log(binaryData.length, arrayBuffer.byteLength, arrayBuffer);

            let randid = generateRandomString(core(root_attr).db_did_length);
            sql = `SELECT *
                   FROM ${root_attr.db_table_name}
                   WHERE "did" = "${randid}";`;
            let n = 0;
            while (await root_attr.db.prepare(sql).first() && n < 100) {
                n++;
                randid = generateRandomString(core(root_attr).db_did_length);
                sql = `SELECT *
                       FROM ${root_attr.db_table_name}
                       WHERE "did" = "${randid}";`;
            }

            sql = `INSERT INTO ${root_attr.db_table_name} ("did", "name", "type", "uploaded", "parent", "size")
                   VALUES (`;
            sql += `"${randid}", "${name}", ${core(root_attr).ItemTypes.file}, 0, ${id === "root" ? "NULL" : `"${id}"`},`;
            sql += `${arrayBuffer.byteLength}`;
            sql += `);`;
            await core(root_attr).exec_sql(root_attr, sql);
            await root_attr.kv.put(randid, arrayBuffer);
            sql = `UPDATE ${root_attr.db_table_name}
                   SET "uploaded"=1,
                       "uploaded_time"=CURRENT_TIMESTAMP
                   WHERE "did" = "${randid}";`;
            let r = await core(root_attr).exec_sql(root_attr, sql);
            return r;
        },

        async uploadNewSessionByPath(request, root_attr, path, name,) {
            return null;
        },

        async uploadGetProgress(request, root_attr, data,) {
            return null;
        },

        async uploadGoOn(request, root_attr, session,) {
            return null;
        },

    },

    [Types.deno_mysql]: {
        ItemTypes: Object.freeze({
            file: 1, folder: 2,
        }), // 也用于位运算

        // db: null,
        db_did_length: 14,

        async exec_sql(root_attr, sql, args) {
            // console.log("sql:", sql, args);
            if (!args) {
                args = []
            }
            let v;
            try {
                v = await root_attr.db.execute(sql, args);
            } catch (e) {
                if (root_attr.Initialized) {
                    root_attr.Initialized = false; // 可能连接断了
                    await Cores.initializeClient(root_attr);
                    v = await root_attr.db.execute(sql, args);
                }
            }
            // console.log("result: ", v);
            return v;
        },
        async query_sql(root_attr, sql, args) {
            // console.log("sql:", sql, args);
            if (!args) {
                args = []
            }
            let v;
            try {
                v = await root_attr.db.query(sql, args);
            } catch (e) {
                if (root_attr.Initialized) {
                    root_attr.Initialized = false; // 可能连接断了
                    await Cores.initializeClient(root_attr);
                    v = await root_attr.db.query(sql, args);
                }
            }
            // console.log("result: ", v);
            return v[0];
        },

        isAuthorized(root_attr,) {
            return !!root_attr.Initialized;
        },

        can_trash: false,
        can_share: false,
        can_copy: false,
        can_shortcut: false,
        can_zip: false,
        can_chunk: false,
        can_resume: false,
        max_upload_size: -1,

        isShared(item) {
            return false;
        },

        async initializeClient(root_attr,) {
            if (root_attr.Initialized) {
                return;
            }
            // root_attr.kv = await Deno.openKv();
            // await root_attr.kv.set([root_attr.binding_kv, randid,], arrayBuffer);
            // root_attr.db = await new Client().connect({
            //     hostname: root_attr.db_hostname[0],
            //     port: root_attr.db_hostname[1],
            //     username: root_attr.db_username,
            //     password: root_attr.db_password,
            //     db: root_attr.db_database,
            //     poolSize: 2,
            //     tls: {
            //         mode: "verify_identity", caCerts: [Deno.env.get("CA"),],
            //     },
            // });
            root_attr.db = await mysql.createConnection({
                host: root_attr.db_hostname[0],
                port: root_attr.db_hostname[1],
                user: root_attr.db_username,
                password: root_attr.db_password,
                database: root_attr.db_database,
                pool: 2,
                ssl: {
                    ca: Deno.env.get(root_attr.env_ca)
                },
                connectTimeout: 30 * 1000, // maxPacketSize: 67108864 * 10,
            });

            // sql = `DROP TABLE IF EXISTS ${root_attr.db_table_name};`; // 删表
            // await core(root_attr).exec_sql(root_attr, sql);

            sql = `CREATE TABLE IF NOT EXISTS ${root_attr.db_table_name}
                   (`; // 创建表
            sql += `did varchar(${core(root_attr).db_did_length}) PRIMARY KEY UNIQUE NOT NULL,`;
            sql += `name varchar(10240) NOT NULL,`;
            sql += `type INTEGER NOT NULL CHECK (type IN (1, 2)),`; // 1=文件,2=文件夹
            sql += `size INTEGER NOT NULL DEFAULT 0 CHECK (size >= 0),`;
            sql += `hash varchar(40),`;
            sql += `uploaded INTEGER NOT NULL DEFAULT 0 CHECK (uploaded IN (0, 1)),`; // 0=未上传
            sql += `uploaded_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,`; // DATETIME('now')不行，SELECT CURRENT_DATE;是常量
            sql += `parent varchar(${core(root_attr).db_did_length}),`;
            sql += `CONSTRAINT parent_set FOREIGN KEY (\`parent\`) REFERENCES ${root_attr.db_table_name}(\`did\`) ON DELETE RESTRICT,`;
            sql += `CONSTRAINT no_self_reference CHECK (parent IS NULL OR did != parent),`;
            sql += `CHECK (uploaded_time LIKE '____-__-__ __:__:__')`; // 需要扩展才支持REGEXP '^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$'
            sql += `);`;
            await core(root_attr).exec_sql(root_attr, sql);

            // sql = `DROP TABLE IF EXISTS ${root_attr.db_table_name}_data;`; // 删表
            // await core(root_attr).exec_sql(root_attr, sql);

            sql = `CREATE TABLE IF NOT EXISTS ${root_attr.db_table_name}_data
                   (`; // 创建表
            sql += `id INT AUTO_INCREMENT PRIMARY KEY,`;
            sql += `did varchar(${core(root_attr).db_did_length})  NOT NULL,`;
            sql += `data LONGBLOB`;
            sql += `);`;
            await core(root_attr).exec_sql(root_attr, sql);

            root_attr.Initialized = true;
        },

        async checkId(root_attr, id,) {
            if (id === "root") return true;
            sql = `SELECT *
                   FROM ${root_attr.db_table_name}
                   WHERE did = "${id}";`;
            let r = await core(root_attr).query_sql(root_attr, sql);
            if (r.length > 0) {
                return true;
            }
            return false;
        },

        async getId(request, root_attr, parentId, childName, resolve_symlink, includes = 0) {
            childName = childName.replace(/\'/g, `\\'`); // escape single quote
            if (parentId === "root") {
                sql = `SELECT *
                       FROM ${root_attr.db_table_name}
                       WHERE parent IS NULL
                         AND name = "${childName}"
                         AND uploaded = 1;`;
            } else {
                sql = `SELECT *
                       FROM ${root_attr.db_table_name}
                       WHERE parent = "${parentId}"
                         AND name = "${childName}"
                         AND uploaded = 1;`;
            } //  AND type = ${core(root_attr).ItemTypes.folder}
            if (includes > 0) {
                if (includes & core(root_attr).ItemTypes.file && includes & core(root_attr).ItemTypes.folder) {
                } else if (includes & core(root_attr).ItemTypes.file) {
                    sql = replaceWithLimit(sql, /AND/g, `AND type = ${core(root_attr).ItemTypes.file} AND`, 1);
                } else if (includes & core(root_attr).ItemTypes.folder) {
                    sql = replaceWithLimit(sql, /AND/g, `AND type = ${core(root_attr).ItemTypes.folder} AND`, 1);
                }
            }
            let r = await core(root_attr).query_sql(root_attr, sql);
            if (r.length > 0) {
                return r[0]["did"];
            }
        },

        async resolvePath(request, root_attr, path, resolve_symlink = 0, includes = 0) {
            const toks = path.split('/').map(decodeURIComponent).map(decodeURIComponent).filter(Boolean);
            let id = root_attr.id;
            let name = null;
            let parents = [];
            let rs = false;
            for (let i = 0; i < toks.length; i++) {
                if (resolve_symlink === 0) {
                    rs = false;
                } else if (resolve_symlink === 1) {
                    rs = true;
                } else if (resolve_symlink < 0) {
                    if (i - toks.length >= resolve_symlink) {
                        rs = false;
                    } else {
                        rs = true;
                    }
                }
                parents.push({id, name});
                id = await Cores.getId(request, root_attr, id, toks[i], rs, includes);
                name = toks[i];
                if (!id) return {id, name, parents};
            }
            console.log("Cores.resolvePath", id, toks,);
            return {id, name, parents};
        },

        async formatInfo(request, root_attr, datumElement,) {
            let c = {
                "id": datumElement["did"],
                "type": datumElement["type"] === core(root_attr).ItemTypes.folder ? ItemTypes.folder : ItemTypes.file,
                "name": datumElement["name"],
                "size": "size" in datumElement ? datumElement["size"] : null,
                "shared": Cores.isShared(datumElement),
                "modified_time": display_modified_time ? parseInt(new Date(datumElement["uploaded_time"]).getTime() / 1000) : null,
            };
            if (Cores.isSymlink(c)) {
            }
            return c;
        },

        async getInfo(request, root_attr, id,) {
            let datumElement = await Cores.getMeta(request, root_attr, id);
            return Cores.formatInfo(request, root_attr, datumElement);
        },

        async getInfoByPath(request, root_attr, path,) {
            const id = (await Cores.resolvePath(request, root_attr, path, -1))["id"];
            if (!id) return null;
            return Cores.getInfo(request, root_attr, id,);
        },

        async getMeta(request, root_attr, id,) {
            sql = `SELECT *
                   FROM ${root_attr.db_table_name}
                   WHERE did = "${id}"`;
            let r = await core(root_attr).query_sql(root_attr, sql);
            console.log("getMeta", r);
            return r[0];
        },

        async listFolder(request, root_attr, id) {
            if (id === "root") {
                sql = `SELECT *
                       FROM ${root_attr.db_table_name}
                       WHERE parent IS NULL
                         AND uploaded = 1
                       ORDER BY \`type\` DESC, \`name\` ASC;`;
            } else {
                sql = `SELECT *
                       FROM ${root_attr.db_table_name}
                       WHERE parent = "${id}"
                         AND uploaded = 1
                       ORDER BY \`type\` DESC, \`name\` ASC;`;
            }
            let r = await core(root_attr).query_sql(root_attr, sql);
            return {
                files: r,
            }
        },

        async listFolderByPath(request, root_attr, path,) {
            let id = (await Cores.resolvePath(request, root_attr, path, 1, core(root_attr).ItemTypes.folder))["id"];
            if (!id) return null;

            let list = [];
            let data = await Cores.listFolder(request, root_attr, id);
            for (const datumElement of data["files"]) {
                let c = await Cores.formatInfo(request, root_attr, datumElement);
                list.push(c);
            }
            return {
                "parent": root_attr.btn_goto_drive ? id : null, "list": list,
            };
        },

        async moveByPath(request, root_attr, data,) {
            const {id: source_id, name,} = await Cores.resolvePath(request, root_attr, data["source"], -1);
            if (!source_id) return null;
            let to_id = (await Cores.resolvePath(request, root_attr, data["to"], 1))["id"];
            if (!to_id) return null;

            if (root_attr.unique_name && !await Cores.checkUniqueName(request, root_attr, to_id, name)) {
                return null;
            }

            if (source_id === "root") return {};
            if (to_id === "root") {
                sql = `UPDATE ${root_attr.db_table_name}
                       SET \`parent\`=NULL
                       WHERE \`did\` = "${source_id}";`;
            } else {
                sql = `UPDATE ${root_attr.db_table_name}
                       SET \`parent\`="${to_id}"
                       WHERE \`did\` = "${source_id}";`;
            }
            let r = await core(root_attr).exec_sql(root_attr, sql);
            return r;
        },

        async renameByPath(request, root_attr, data,) {
            const {id: source_id, parents} = await Cores.resolvePath(request, root_attr, data["source"], -1,);
            if (!source_id) return null;

            if (root_attr.unique_name && !await Cores.checkUniqueName(request, root_attr, parents.at(-1)["id"], data["name"])) {
                return null;
            }

            if (source_id === "root") return {};
            sql = `UPDATE ${root_attr.db_table_name}
                   SET \`name\`="${data["name"]}",
                       \`uploaded_time\`=CURRENT_TIMESTAMP
                   WHERE \`did\` = "${source_id}";`;
            let r = await core(root_attr).exec_sql(root_attr, sql);
            return r;
        },

        async shareByPath(request, root_attr, data,) {
            return null;
        },

        async trash(request, root_attr, did,) {
            return {};
        },

        async trashByPath(request, root_attr, data,) {
            await Cores.trash(request, root_attr, null);
        },

        async delete(request, root_attr, did) {
            let r = null;
            sql = `SELECT *
                   FROM ${root_attr.db_table_name}
                   WHERE parent = "${did}"
                     AND type = ${core(root_attr).ItemTypes.file}
                   ORDER BY \`type\` DESC, \`name\` ASC;`;
            r = await core(root_attr).query_sql(root_attr, sql);
            let dids = [];
            for (const i of r) {
                dids.push(`"${i["did"]}"`);
            }
            if (dids.length > 0) {
                sql = `DELETE
                       FROM ${root_attr.db_table_name}_data
                       WHERE did IN (${dids.join(",")})`;
                await core(root_attr).exec_sql(root_attr, sql);
                sql = `DELETE
                       FROM ${root_attr.db_table_name}
                       WHERE did IN (${dids.join(",")})`;
                await core(root_attr).exec_sql(root_attr, sql);
            }
            sql = `SELECT *
                   FROM ${root_attr.db_table_name}
                   WHERE parent = "${did}"
                     AND type = ${core(root_attr).ItemTypes.folder}
                   ORDER BY \`type\` DESC, \`name\` ASC;`;
            r = await core(root_attr).query_sql(root_attr, sql);
            for (const i of r) {
                await Cores.delete(request, root_attr, i["did"]);
            }
            sql = `SELECT *
                   FROM ${root_attr.db_table_name}
                   WHERE did = "${did}"
                     AND type = ${core(root_attr).ItemTypes.file}
                   ORDER BY \`type\` DESC, \`name\` ASC;`;
            r = await core(root_attr).query_sql(root_attr, sql);
            dids = [];
            for (const i of r) {
                dids.push(`"${i["did"]}"`);
            }
            if (dids.length > 0) {
                sql = `DELETE
                       FROM ${root_attr.db_table_name}_data
                       WHERE did IN (${dids.join(",")})`;
                await core(root_attr).exec_sql(root_attr, sql);
            }
            sql = `DELETE
                   FROM ${root_attr.db_table_name}
                   WHERE did = "${did}";`;
            await core(root_attr).exec_sql(root_attr, sql);
        },

        async deleteByPath(request, root_attr, data,) {
            const source_id = (await Cores.resolvePath(request, root_attr, data["source"], -1,))["id"];
            if (!source_id) return null;

            if (source_id === "root") return {};
            await Cores.delete(request, root_attr, source_id);
            return {};
        },

        async trashSelectedByPath(request, root_attr, data,) {
            return {};
        },

        async deleteSelectedByPath(request, root_attr, data,) {
            const location_id = (await Cores.resolvePath(request, root_attr, data["location"], 1,))["id"];
            if (!location_id) return null;

            for (const name of data["names"]) {
                const source_id = await Cores.getId(request, root_attr, location_id, name, false,);
                if (!source_id) continue;
                if (source_id === "root") continue;
                await Cores.delete(request, root_attr, source_id);
            }
            return {};
        },

        async replySelectedByPath(request, root_attr, data,) {
            const location_id = (await Cores.resolvePath(request, root_attr, data["location"], 1,))["id"];
            if (!location_id) return null;

            const results = [];

            for (const name of data["names"]) {
                const source_id = await Cores.getId(request, root_attr, location_id, name, false,);
                if (!source_id || source_id === "root") continue;

                const newName = name.includes('.') ? name.replace(/(\.[^.]*)$/, '【OK】$1') : `${name}【OK】`;

                await Cores.renameByPath(request, root_attr, {
                    source: `${data["location"]}/${name}`,
                    name: newName,
                });
            }
            return {};
        },

        async newFolderByPath(request, root_attr, data, path,) {
            let id = (await Cores.resolvePath(request, root_attr, path, 1))["id"];
            if (!id) return null;

            if (root_attr.unique_name && !await Cores.checkUniqueName(request, root_attr, id, data["name"])) {
                return null;
            }

            let randid = generateRandomString(core(root_attr).db_did_length);
            sql = `SELECT *
                   FROM ${root_attr.db_table_name}
                   WHERE \`did\` = "${randid}";`;
            let n = 0;
            while (await core(root_attr).query_sql(root_attr, sql).length > 0 && n < 100) {
                n++;
                randid = generateRandomString(core(root_attr).db_did_length);
                sql = `SELECT *
                       FROM ${root_attr.db_table_name}
                       WHERE \`did\` = "${randid}";`;
            }

            sql = `INSERT INTO ${root_attr.db_table_name} (\`did\`, \`name\`, \`type\`, \`uploaded\`, \`parent\`)
                   VALUES (`;
            sql += `"${randid}", "${data["name"]}", ${core(root_attr).ItemTypes.folder}, 1, ${id === "root" ? "NULL" : `"${id}"`}`;
            sql += `);`;
            let r = await core(root_attr).exec_sql(root_attr, sql);
            return r;
        },

        async zipByPath(request, root_attr, data,) {
            return {};
        },

        async newShortcutByPath(request, root_attr, data, path,) {
            return {};
        },

        async copyFromByPath(request, root_attr, data, path,) {
            return {};
        },

        async resolveTree(request, root_attr, data, tree, summary, paths,) {
            let li = await Cores.listFolder(request, root_attr, data["source"]);
            for (const datumElement of li["files"]) {
                let c = await Cores.formatInfo(request, root_attr, datumElement);
                tree.children.push(c);
                if (Cores.isFolder(c, false)) {
                    c["children"] = [];
                    summary.folderCount++;
                    let id = Cores.isSymlink(c) ? c["symlink_target"]["id"] : c["id"];
                    if (!paths.includes(id)) {
                        await Cores.resolveTree(request, root_attr, {source: id,}, c, summary, [...paths, id,])
                    } else {
                        c["recur"] = true;
                    }
                } else {
                    summary.fileCount++;
                    summary.totalSize += parseInt(c["size"]);
                }
            }
        },

        async download(request, root_attr, meta, range) {
            let {start, end} = parseDownloadRange(range, meta);
            // console.log("download", start, end);
            // const fullBinaryData = new Uint8Array(await root_attr.kv.get(meta["id"], {type: 'arrayBuffer'}));

            sql = `SELECT id, data
                   FROM ${root_attr.db_table_name}_data
                   WHERE \`did\` = "${meta["id"]}"
                   ORDER BY \`id\` ASC;`;
            let binaryString = await core(root_attr).query_sql(root_attr, sql);
            // binaryString = binaryString[0]["data"];
            // let uint8Array = new Uint8Array(binaryString.length);
            // for (let i = 0; i < binaryString.length; i++) {
            //     uint8Array[i] = binaryString.charCodeAt(i);
            // }
            // const fullBinaryData = new Uint8Array(uint8Array);
            // const fullBinaryData = new Uint8Array(binaryString);

            async function mergeArrayBuffers(bufferArray) {
                const totalLength = bufferArray.reduce((sum, buffer) => sum + buffer["data"].byteLength, 0);
                let mergedBuffer = new Uint8Array(totalLength);
                let offset = 0;
                for (const buffer of bufferArray) {
                    mergedBuffer.set(new Uint8Array(buffer["data"]), offset);
                    offset += buffer["data"].byteLength;
                }
                return mergedBuffer;
            }

            const fullBinaryData = await mergeArrayBuffers(binaryString);


            const slicedBinaryData = fullBinaryData.slice(start, end + 1);
            return {
                status: range ? 206 : 200, body: slicedBinaryData, headers: {
                    "Content-Length": slicedBinaryData.length,
                    "Content-Range": `bytes ${start}-${end}/${fullBinaryData.length}`,
                },
            }
        },

        async uploadByPath(request, root_attr, path, name,) {
            let id = (await Cores.resolvePath(request, root_attr, path, 1,))["id"];
            if (!id) return null;

            if (root_attr.unique_name && !await Cores.checkUniqueName(request, root_attr, id, name)) {
                return null;
            }

            // const reader = request.body.getReader();
            // let chunks = '';
            // while (true) {
            //     const { done, value } = await reader.read();
            //     if (done) break;
            //     chunks += new TextDecoder().decode(value);
            // }
            // console.log(chunks);

            const arrayBuffer = await request.arrayBuffer();
            // let binary = Array.from(new Uint8Array(await request.arrayBuffer()))
            //     .map(byte => String.fromCharCode(byte))
            //     .join('');

            let randid = generateRandomString(core(root_attr).db_did_length);
            sql = `SELECT *
                   FROM ${root_attr.db_table_name}
                   WHERE \`did\` = "${randid}";`;
            let n = 0;
            while (await core(root_attr).query_sql(root_attr, sql).length > 0 && n < 100) {
                n++;
                randid = generateRandomString(core(root_attr).db_did_length);
                sql = `SELECT *
                       FROM ${root_attr.db_table_name}
                       WHERE \`did\` = "${randid}";`;
            }

            sql = `INSERT INTO ${root_attr.db_table_name} (\`did\`, \`name\`, \`type\`, \`uploaded\`, \`parent\`, \`size\`)
                   VALUES (`;
            sql += `?, ?, ?, ?, ?, ?`;
            sql += `);`;
            await core(root_attr).exec_sql(root_attr, sql, [randid, name, core(root_attr).ItemTypes.file, 0, id === "root" ? null : id, arrayBuffer.byteLength,]);

            if (arrayBuffer.byteLength > 0) {
                const chunkSize = 5 * 1024 * 1024; // 5MB
                const totalSize = arrayBuffer.byteLength;
                let arrayBuffers = [];
                for (let start = 0; start < totalSize; start += chunkSize) {
                    const end = Math.min(start + chunkSize, totalSize);
                    arrayBuffers.push(arrayBuffer.slice(start, end));
                    // sql = `INSERT INTO ${root_attr.db_table_name}_data (\`did\`, \`data\`) VALUES (`;
                    // sql += `?, ?`;
                    // sql += `);`;
                    // await core(root_attr).exec_sql(root_attr, sql, [randid, arrayBuffer.slice(start, end),]);
                }
                sql = `INSERT INTO ${root_attr.db_table_name}_data (\`did\`, \`data\`)
                       VALUES `;
                let args = [];
                let _ = 0;
                arrayBuffers.map((buffer) => {
                    sql += `(?, ?) `;
                    _++;
                    if (_ < arrayBuffers.length) {
                        sql += ", "
                    }
                    args.push(randid);
                    args.push(buffer)
                });
                sql += `;`;
                await core(root_attr).exec_sql(root_attr, sql, args);
            }

            sql = `UPDATE ${root_attr.db_table_name}
                   SET \`uploaded\`=1,
                       \`uploaded_time\`=CURRENT_TIMESTAMP
                   WHERE \`did\` = "${randid}";`;
            let r = await core(root_attr).exec_sql(root_attr, sql);
            return r;
        },

        async uploadNewSessionByPath(request, root_attr, path, name,) {
            return null;
        },

        async uploadGetProgress(request, root_attr, data,) {
            return null;
        },

        async uploadGoOn(request, root_attr, session,) {
            return null;
        },

    },

    [Types.netlify_blob]: {
        ItemTypes: Object.freeze({
            file: 1, folder: 2,
        }), // 也用于位运算

        db_did_length: 14,

        async exec_sql(root_attr, sql) {
            // console.log("sql:", sql);
            let result = await root_attr.db(sql);
            // console.log("result:", result);
            return result; // []
        },

        isAuthorized(root_attr,) {
            return !!root_attr.Initialized;
        },

        can_trash: false,
        can_share: false,
        can_copy: false,
        can_shortcut: false,
        can_zip: false,
        can_chunk: false,
        can_resume: false,
        max_upload_size: 25,

        isShared(item) {
            return false;
        },

        async initializeClient(root_attr,) {
            if (root_attr.Initialized) {
                return;
            }
            root_attr.db = mysql.neon();
            root_attr.bb = blobs.getStore(root_attr.binding_kv);

            // sql = `DROP TABLE IF EXISTS ${root_attr.db_table_name};`; // 删表
            // await core(root_attr).exec_sql(root_attr, sql);

            sql = `CREATE TABLE IF NOT EXISTS ${root_attr.db_table_name}
                   (`; // 创建表
            sql += `did varchar(${core(root_attr).db_did_length}) PRIMARY KEY UNIQUE NOT NULL CHECK (LENGTH(did) = ${core(root_attr).db_did_length}),`;
            sql += `name varchar(10240) NOT NULL CHECK (LENGTH(name) > 0 AND LENGTH(name) <= 10240),`;
            sql += `type INTEGER NOT NULL CHECK (type IN (1, 2)),`; // 1=文件,2=文件夹
            sql += `size INTEGER NOT NULL DEFAULT 0 CHECK (size >= 0),`;
            sql += `hash varchar(40) CHECK (hash IS NULL OR LENGTH(hash) = 40),`;
            sql += `uploaded INTEGER NOT NULL DEFAULT 0 CHECK (uploaded IN (0, 1)),`; // 0=未上传
            sql += `uploaded_time TEXT NOT NULL DEFAULT TO_CHAR(CURRENT_TIMESTAMP, 'YYYY-MM-DD HH24:MI:SS'),`;
            sql += `parent varchar,`;
            sql += `CONSTRAINT parent_set FOREIGN KEY ("parent") REFERENCES "${root_attr.db_table_name}"("did") ON DELETE RESTRICT,`;
            sql += `CONSTRAINT no_self_reference CHECK (parent IS NULL OR did != parent),`;
            sql += `CHECK (uploaded_time LIKE '____-__-__ __:__:__')`;
            sql += `);`;
            await core(root_attr).exec_sql(root_attr, sql);

            root_attr.Initialized = true;
        },

        async checkId(root_attr, id,) {
            if (id === "root") return true;
            sql = `SELECT *
                   FROM ${root_attr.db_table_name}
                   WHERE did = '${id}';`;
            let r = await core(root_attr).exec_sql(root_attr, sql);
            if (r.length > 0) {
                return true;
            }
            return false;
        },

        async getId(request, root_attr, parentId, childName, resolve_symlink, includes = 0) {
            childName = childName.replace(/\'/g, `\\'`); // escape single quote
            if (parentId === "root") {
                sql = `SELECT *
                       FROM ${root_attr.db_table_name}
                       WHERE parent IS NULL
                         AND name = '${childName}'
                         AND uploaded = 1;`;
            } else {
                sql = `SELECT *
                       FROM ${root_attr.db_table_name}
                       WHERE parent = '${parentId}'
                         AND name = '${childName}'
                         AND uploaded = 1;`;
            } //  AND type = ${core(root_attr).ItemTypes.folder}
            if (includes > 0) {
                if (includes & core(root_attr).ItemTypes.file && includes & core(root_attr).ItemTypes.folder) {
                } else if (includes & core(root_attr).ItemTypes.file) {
                    sql = replaceWithLimit(sql, /AND/g, `AND type = ${core(root_attr).ItemTypes.file} AND`, 1);
                } else if (includes & core(root_attr).ItemTypes.folder) {
                    sql = replaceWithLimit(sql, /AND/g, `AND type = ${core(root_attr).ItemTypes.folder} AND`, 1);
                }
            }
            let r = await core(root_attr).exec_sql(root_attr, sql);
            if (r.length > 0) {
                return r[0]["did"];
            }
        },

        async resolvePath(request, root_attr, path, resolve_symlink = 0, includes = 0) {
            const toks = path.split('/').map(decodeURIComponent).map(decodeURIComponent).filter(Boolean);
            let id = root_attr.id;
            let name = null;
            let parents = [];
            let rs = false;
            for (let i = 0; i < toks.length; i++) {
                if (resolve_symlink === 0) {
                    rs = false;
                } else if (resolve_symlink === 1) {
                    rs = true;
                } else if (resolve_symlink < 0) {
                    if (i - toks.length >= resolve_symlink) {
                        rs = false;
                    } else {
                        rs = true;
                    }
                }
                parents.push({id, name});
                id = await Cores.getId(request, root_attr, id, toks[i], rs, includes);
                name = toks[i];
                if (!id) return {id, name, parents};
            }
            console.log("Cores.resolvePath", id, toks,);
            return {id, name, parents};
        },

        async formatInfo(request, root_attr, datumElement,) {
            let c = {
                "id": datumElement["did"],
                "type": datumElement["type"] === core(root_attr).ItemTypes.folder ? ItemTypes.folder : ItemTypes.file,
                "name": datumElement["name"],
                "size": "size" in datumElement ? datumElement["size"] : null,
                "shared": Cores.isShared(datumElement),
                "modified_time": display_modified_time ? parseInt(new Date(datumElement["uploaded_time"]).getTime() / 1000) : null,
            };
            if (Cores.isSymlink(c)) {
            }
            return c;
        },

        async getInfo(request, root_attr, id,) {
            let datumElement = await Cores.getMeta(request, root_attr, id);
            return Cores.formatInfo(request, root_attr, datumElement);
        },

        async getInfoByPath(request, root_attr, path,) {
            const id = (await Cores.resolvePath(request, root_attr, path, -1))["id"];
            if (!id) return null;
            return Cores.getInfo(request, root_attr, id,);
        },

        async getMeta(request, root_attr, id,) {
            sql = `SELECT *
                   FROM ${root_attr.db_table_name}
                   WHERE did = '${id}'`;
            let r = await core(root_attr).exec_sql(root_attr, sql);
            console.log("getMeta", r);
            return r[0];
        },

        async listFolder(request, root_attr, id) {
            if (id === "root") {
                sql = `SELECT *
                       FROM ${root_attr.db_table_name}
                       WHERE parent IS NULL
                         AND uploaded = 1
                       ORDER BY "type" DESC, "name" ASC;`;
            } else {
                sql = `SELECT *
                       FROM ${root_attr.db_table_name}
                       WHERE parent = '${id}'
                         AND uploaded = 1
                       ORDER BY "type" DESC, "name" ASC;`;
            }
            let r = await core(root_attr).exec_sql(root_attr, sql);
            // if (r["success"]) {
            //     // sql = `SELECT * FROM ${root_attr.db_table_name} WHERE "did"="${id}";`;
            //     // console.log(await core(root_attr).exec_sql(root_attr,sql).first());
            //     return {
            //         files: r["results"],
            //     }
            // }
            return {
                files: r,
            }
        },

        async listFolderByPath(request, root_attr, path,) {
            let id = (await Cores.resolvePath(request, root_attr, path, 1, core(root_attr).ItemTypes.folder))["id"];
            if (!id) return null;

            let list = [];
            let data = await Cores.listFolder(request, root_attr, id);
            for (const datumElement of data["files"]) {
                let c = await Cores.formatInfo(request, root_attr, datumElement);
                list.push(c);
            }
            return {
                "parent": root_attr.btn_goto_drive ? id : null, "list": list,
            };
        },

        async moveByPath(request, root_attr, data,) {
            const {id: source_id, name,} = await Cores.resolvePath(request, root_attr, data["source"], -1);
            if (!source_id) return null;
            let to_id = (await Cores.resolvePath(request, root_attr, data["to"], 1))["id"];
            if (!to_id) return null;

            if (root_attr.unique_name && !await Cores.checkUniqueName(request, root_attr, to_id, name)) {
                return null;
            }

            if (source_id === "root") return {};
            if (to_id === "root") {
                sql = `UPDATE ${root_attr.db_table_name}
                       SET "parent"=NULL
                       WHERE "did" = '${source_id}';`;
            } else {
                sql = `UPDATE ${root_attr.db_table_name}
                       SET "parent"='${to_id}'
                       WHERE "did" = '${source_id}';`;
            }
            let r = await core(root_attr).exec_sql(root_attr, sql);
            return r;
        },

        async renameByPath(request, root_attr, data,) {
            const {id: source_id, parents} = await Cores.resolvePath(request, root_attr, data["source"], -1,);
            if (!source_id) return null;

            if (root_attr.unique_name && !await Cores.checkUniqueName(request, root_attr, parents.at(-1)["id"], data["name"])) {
                return null;
            }

            if (source_id === "root") return {};
            sql = `UPDATE ${root_attr.db_table_name}
                   SET "name"='${data["name"]}',
                       "uploaded_time"=TO_CHAR(CURRENT_TIMESTAMP, 'YYYY-MM-DD HH24:MI:SS')
                   WHERE "did" = '${source_id}';`;
            let r = await core(root_attr).exec_sql(root_attr, sql);
            return r;
        },

        async shareByPath(request, root_attr, data,) {
            return null;
        },

        async trash(request, root_attr, did,) {
            return {};
        },

        async trashByPath(request, root_attr, data,) {
            await Cores.trash(request, root_attr, null);
        },

        async delete(request, root_attr, did) {
            let r = null;
            sql = `SELECT *
                   FROM ${root_attr.db_table_name}
                   WHERE parent = '${did}'
                     AND type = ${core(root_attr).ItemTypes.file}
                   ORDER BY "type" DESC, "name" ASC;`;
            r = await core(root_attr).exec_sql(root_attr, sql);
            let dids = [];
            for (const i of r) {
                await root_attr.bb.delete(i["did"]);
                dids.push(`'${i["did"]}'`);
            }
            if (dids.length > 0) {
                sql = `DELETE
                       FROM ${root_attr.db_table_name}
                       WHERE did IN (${dids.join(",")})`;
                await core(root_attr).exec_sql(root_attr, sql);
            }
            sql = `SELECT *
                   FROM ${root_attr.db_table_name}
                   WHERE parent = '${did}'
                     AND type = ${core(root_attr).ItemTypes.folder}
                   ORDER BY "type" DESC, "name" ASC;`;
            r = await core(root_attr).exec_sql(root_attr, sql);
            if (r) {
                for (const i of r) {
                    await Cores.delete(request, root_attr, i["did"]);
                }
            }
            sql = `SELECT *
                   FROM ${root_attr.db_table_name}
                   WHERE did = '${did}'
                     AND type = ${core(root_attr).ItemTypes.file}
                   ORDER BY "type" DESC, "name" ASC;`;
            r = await core(root_attr).exec_sql(root_attr, sql);
            for (const i of r) {
                await root_attr.bb.delete(i["did"]);
            }
            sql = `DELETE
                   FROM ${root_attr.db_table_name}
                   WHERE "did" = '${did}';`;
            await core(root_attr).exec_sql(root_attr, sql);
        },

        async deleteByPath(request, root_attr, data,) {
            const source_id = (await Cores.resolvePath(request, root_attr, data["source"], -1,))["id"];
            if (!source_id) return null;

            if (source_id === "root") return {};
            await Cores.delete(request, root_attr, source_id);
            return {};
        },

        async trashSelectedByPath(request, root_attr, data,) {
            return {};
        },

        async deleteSelectedByPath(request, root_attr, data,) {
            const location_id = (await Cores.resolvePath(request, root_attr, data["location"], 1,))["id"];
            if (!location_id) return null;

            for (const name of data["names"]) {
                const source_id = await Cores.getId(request, root_attr, location_id, name, false,);
                if (!source_id) continue;
                if (source_id === "root") continue;
                await Cores.delete(request, root_attr, source_id);
            }
            return {};
        },

        async replySelectedByPath(request, root_attr, data,) {
            const location_id = (await Cores.resolvePath(request, root_attr, data["location"], 1,))["id"];
            if (!location_id) return null;

            const results = [];

            for (const name of data["names"]) {
                const source_id = await Cores.getId(request, root_attr, location_id, name, false,);
                if (!source_id || source_id === "root") continue;

                const newName = name.includes('.') ? name.replace(/(\.[^.]*)$/, '【OK】$1') : `${name}【OK】`;

                await Cores.renameByPath(request, root_attr, {
                    source: `${data["location"]}/${name}`,
                    name: newName,
                });
            }
            return {};
        },

        async newFolderByPath(request, root_attr, data, path,) {
            let id = (await Cores.resolvePath(request, root_attr, path, 1))["id"];
            if (!id) return null;

            if (root_attr.unique_name && !await Cores.checkUniqueName(request, root_attr, id, data["name"])) {
                return null;
            }

            let randid = generateRandomString(core(root_attr).db_did_length);
            sql = `SELECT *
                   FROM ${root_attr.db_table_name}
                   WHERE "did" = '${randid}';`;
            let n = 0;
            while ((await core(root_attr).exec_sql(root_attr, sql)).length === 0 && n < 100) {
                n++;
                randid = generateRandomString(core(root_attr).db_did_length);
                sql = `SELECT *
                       FROM ${root_attr.db_table_name}
                       WHERE "did" = '${randid}';`;
            }

            sql = `INSERT INTO ${root_attr.db_table_name} ("did", "name", "type", "uploaded", "parent")
                   VALUES (`;
            sql += `'${randid}', '${data["name"]}', ${core(root_attr).ItemTypes.folder}, 1, ${id === "root" ? "NULL" : `'${id}'`}`;
            sql += `);`;
            let r = await core(root_attr).exec_sql(root_attr, sql);
            return r;
        },

        async zipByPath(request, root_attr, data,) {
            return {};
        },

        async newShortcutByPath(request, root_attr, data, path,) {
            return {};
        },

        async copyFromByPath(request, root_attr, data, path,) {
            return {};
        },

        async resolveTree(request, root_attr, data, tree, summary, paths,) {
            let li = await Cores.listFolder(request, root_attr, data["source"]);
            for (const datumElement of li["files"]) {
                let c = await Cores.formatInfo(request, root_attr, datumElement);
                tree.children.push(c);
                if (Cores.isFolder(c, false)) {
                    c["children"] = [];
                    summary.folderCount++;
                    let id = Cores.isSymlink(c) ? c["symlink_target"]["id"] : c["id"];
                    if (!paths.includes(id)) {
                        await Cores.resolveTree(request, root_attr, {source: id,}, c, summary, [...paths, id,])
                    } else {
                        c["recur"] = true;
                    }
                } else {
                    summary.fileCount++;
                    summary.totalSize += parseInt(c["size"]);
                }
            }
        },

        async download(request, root_attr, meta, range) {
            let {start, end} = parseDownloadRange(range, meta);
            // console.log("download", start, end);
            const blob = await root_attr.bb.get(meta["id"], {type: 'arrayBuffer'});
            // console.log("blob", blob);
            const fullBinaryData = new Uint8Array(blob);
            // console.log("fullBinaryData", fullBinaryData);
            const slicedBinaryData = fullBinaryData.slice(start, end + 1);
            return {
                status: range ? 206 : 200, body: slicedBinaryData, headers: {
                    "Content-Length": slicedBinaryData.length,
                    "Content-Range": `bytes ${start}-${end}/${fullBinaryData.length}`,
                },
            }
        },

        async uploadByPath(request, root_attr, path, name,) {
            let id = (await Cores.resolvePath(request, root_attr, path, 1,))["id"];
            if (!id) return null;

            if (root_attr.unique_name && !await Cores.checkUniqueName(request, root_attr, id, name)) {
                return null;
            }

            // const reader = request.body.getReader();
            // let chunks = '';
            // while (true) {
            //     const { done, value } = await reader.read();
            //     if (done) break;
            //     chunks += new TextDecoder().decode(value);
            // }
            // console.log(chunks);

            const arrayBuffer = await request.arrayBuffer();
            // const binaryData = new Uint8Array(arrayBuffer);
            // console.log(binaryData.length, arrayBuffer.byteLength, arrayBuffer);

            let randid = generateRandomString(core(root_attr).db_did_length);
            sql = `SELECT *
                   FROM ${root_attr.db_table_name}
                   WHERE "did" = '${randid}';`;
            let n = 0;
            while ((await core(root_attr).exec_sql(root_attr, sql)).length > 0 && n < 100) {
                n++;
                randid = generateRandomString(core(root_attr).db_did_length);
                sql = `SELECT *
                       FROM ${root_attr.db_table_name}
                       WHERE "did" = '${randid}';`;
            }

            sql = `INSERT INTO ${root_attr.db_table_name} ("did", "name", "type", "uploaded", "parent", "size")
                   VALUES (`;
            sql += `'${randid}', '${name}', ${core(root_attr).ItemTypes.file}, 0, ${id === "root" ? "NULL" : `'${id}'`},`;
            sql += `${arrayBuffer.byteLength}`;
            sql += `);`;
            await core(root_attr).exec_sql(root_attr, sql);
            await root_attr.bb.set(randid, arrayBuffer);
            sql = `UPDATE ${root_attr.db_table_name}
                   SET "uploaded"=1,
                       "uploaded_time"=TO_CHAR(CURRENT_TIMESTAMP, 'YYYY-MM-DD HH24:MI:SS')
                   WHERE "did" = '${randid}';`;
            let r = await core(root_attr).exec_sql(root_attr, sql);
            return r;
        },

        async uploadNewSessionByPath(request, root_attr, path, name,) {
            return null;
        },

        async uploadGetProgress(request, root_attr, data,) {
            return null;
        },

        async uploadGoOn(request, root_attr, session,) {
            return null;
        },

    },

    [Types.pcloud]: {
        _attached_headers: {},
        _attached_params: {},

        _dc_domain: {
            [DataCentres.us]: ["api.pcloud.com",], [DataCentres.eu]: ["eapi.pcloud.com",],
        },

        _get_dc_domain(root_attr,) {
            return core(root_attr)._dc_domain[root_attr.data_centre];
        },

        _get_api_url(root_attr) {
            return `https://${core(root_attr)._get_dc_domain(root_attr)[0]}`;
        },

        async computePasswordDigest(password, account, digest) {
            const encoder = new TextEncoder();

            // Step 1: SHA1(account.toLowerCase())
            const accountLower = account.toLowerCase();
            const accountHashBuffer = await crypto.subtle.digest("SHA-1", encoder.encode(accountLower));

            // Convert account hash to hex string
            const accountHashHex = [...new Uint8Array(accountHashBuffer)]
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');

            // Step 2: Combine password + accountHashHex + digest
            const combinedStr = password + accountHashHex + digest;
            const combinedBuffer = encoder.encode(combinedStr);

            // Step 3: SHA1(combined string)
            const finalDigestBuffer = await crypto.subtle.digest("SHA-1", combinedBuffer);

            // Convert final digest to hex string
            const passwordDigest = [...new Uint8Array(finalDigestBuffer)]
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');

            return passwordDigest;
        },

        sanitizeAndShorten(str) {
            // 1. 填充到 16 字符（右边补 "0"）
            const padded = str.padEnd(16, '0');
            // 2. 编码为 Base64（标准 Base64）
            const base64 = btoa(padded); // btoa works in Workers/Deno with strings
            // 3. 移除特殊字符（+ / =）
            const cleaned = base64.replace(/[+/=]/g, '');
            // 4. 截取前 10 个字符
            return cleaned.slice(0, 16);
        },

        sid2type(id) {
            if (id.startsWith('d')) {
                return ItemTypes.folder;
            }
            if (id.startsWith('f')) {
                return ItemTypes.file;
            }
        },

        sid2int(id) {
            if (id.startsWith('d')) {
                return id.slice(id.lastIndexOf('d') + 1);
            }
            if (id.startsWith('f')) {
                return id.slice(id.lastIndexOf('f') + 1);
            }
            return id;
        },

        type_param(id) {
            if (id.startsWith('d')) {
                return "folderid";
            }
            if (id.startsWith('f')) {
                return "fileid";
            }
        },

        format_dt(modified) {
            try {
                return Math.floor(new Date(modified).getTime() / 1000);
            } catch (e) {
                return 0;
            }
        },

        isAuthorized(root_attr,) {
            // console.log("isAuthorized", Cores.access_token);
            return !!root_attr.access_token;
        },

        can_trash: true,
        can_share: false,
        can_copy: false,
        can_shortcut: false,
        can_zip: false,
        can_chunk: false,
        can_resume: false,
        max_upload_size: -1,

        isShared(item) {
            if (!item) {
                return false;
            }
            return false;
        },

        async initializeClient(root_attr,) {
            // if (root_attr.access_token) {
            //     if (Date.now() < root_attr.access_token_expires) {
            //         return;
            //     }
            // }

            let digest;
            let passworddigest;
            {
                const url = new URL(`${core(root_attr)._get_api_url(root_attr)}/getdigest`);
                const response = await fetch(url, {
                    ...attachBackend(url), method: 'GET',
                });
                const data = await response.json();
                digest = data["digest"];
                passworddigest = await core(root_attr).computePasswordDigest(root_attr.password, root_attr.account, digest);
                // console.log("initializeClient getdigest", url, data, passworddigest,);
            }

            let data;
            if (root_attr.totp.length > 0) {
                let token = "";
                const queryString = new URLSearchParams({
                    "getauth": 1,
                    "logout": 1,
                    "authexpire": 31536000,
                    "username": root_attr.account,
                    "digest": digest,
                    "passworddigest": passworddigest,
                    "language": "en",
                    "os": "4",
                    "deviceid": core(root_attr).sanitizeAndShorten(root_attr.password + root_attr.account),
                }).toString();
                const url = new URL(`${core(root_attr)._get_api_url(root_attr)}/login?${queryString}`);
                const response = await fetch(url, {
                    ...attachBackend(url), method: 'GET',
                });
                data = await response.json();
                // console.log("initializeClient login", url, data,);

                if (data.hasOwnProperty("token")) {

                    token = await totp_authenticator.get_code(root_attr.totp.replace(/[\s\r\t\n]+/g, ""));
                    // console.log("token", token);

                    const queryString = new URLSearchParams({
                        "token": data["token"], "code": token, "trustdevice": false,
                    }).toString();
                    const url = new URL(`${core(root_attr)._get_api_url(root_attr)}/tfa_login?${queryString}`);
                    const response = await fetch(url, {
                        ...attachBackend(url), method: 'GET',
                    });
                    data = await response.json();

                    // console.log("initializeClient totp", url, data,);
                }
            } else {
                const queryString = new URLSearchParams({
                    "getauth": 1,
                    "logout": 1,
                    "authexpire": 31536000,
                    "username": root_attr.account,
                    "digest": digest,
                    "passworddigest": passworddigest,
                }).toString();
                const url = new URL(`${core(root_attr)._get_api_url(root_attr)}/userinfo?${queryString}`);
                const response = await fetch(url, {
                    ...attachBackend(url), method: 'GET',
                });
                data = await response.json();
                // console.log("initializeClient login", url, data,);
            }

            if (!data.hasOwnProperty("access_token")) {
                data["access_token"] = data["auth"]
            }

            root_attr.access_token = data["access_token"];

            core(root_attr)._attached_params["auth"] = root_attr.access_token;

            // root_attr.access_token_expires = Date.now() + 3400 * 1000;
            // root_attr.Authorization = `Bearer ${data["access_token"]}`;
            // console.log("root_attr.Authorization", response, data, root_attr.Authorization);

            // await core(root_attr)._get_privatespace_attr(root_attr)
            // if (root_attr.id === "root") {
            //     root_attr.id = root_attr._privatespace_attr.id;
            // }
        },

        async checkId(root_attr, id,) {
            if (id === "root" || id === "d0") return true;
            const queryString = new URLSearchParams({
                ...core(root_attr)._attached_params, [core(root_attr).type_param(id)]: core(root_attr).sid2int(id),
            }).toString();
            const url = new URL(`${core(root_attr)._get_api_url(root_attr)}/stat?${queryString}`);
            let resp = await fetch(url, {
                ...attachBackend(url), method: 'GET', headers: {
                    ...core(root_attr)._attached_headers, 'Content-Type': 'application/json',
                },
            });
            let result = await resp.json();
            // console.log(resp, result);
            if (resp.status === 200 && result.result === 0) {
                return true;
            }
            return false;
        },

        async getId(request, root_attr, parentId, childName, resolve_symlink) {
            childName = childName.replace(/\'/g, `\\'`); // escape single quote
            let list = [];
            let data = await Cores.listFolder(request, root_attr, parentId);
            for (const datumElement of data["files"]) {
                let c = await Cores.formatInfo(request, root_attr, datumElement);
                list.push(c);
            }
            for (const listElement of list) {
                if (listElement["name"] === childName) {
                    return listElement["id"];
                }
            }
            return null;

        },

        async resolvePath(request, root_attr, path, resolve_symlink = 0) {
            const toks = path.split('/').map(decodeURIComponent).map(decodeURIComponent).filter(Boolean);
            let id = root_attr.id;
            let name = null;
            let parents = [];
            let rs = false;
            for (let i = 0; i < toks.length; i++) {
                if (resolve_symlink === 0) {
                    rs = false;
                } else if (resolve_symlink === 1) {
                    rs = true;
                } else if (resolve_symlink < 0) {
                    if (i - toks.length >= resolve_symlink) {
                        rs = false;
                    } else {
                        rs = true;
                    }
                }
                parents.push({id, name});
                id = await Cores.getId(request, root_attr, id, toks[i], rs);
                name = toks[i];
                if (!id) return {id, name, parents};
            }
            console.log("Cores.resolvePath", id, toks,);
            return {id, name, parents};
        },

        async formatInfo(request, root_attr, datumElement,) {
            // console.log(datumElement)
            let c;
            if (datumElement.id === "0") { // 根目录
                c = {
                    "id": datumElement["id"],
                    "type": ItemTypes.folder,
                    "name": "根目录",
                    "size": null,
                    "shared": false,
                    "modified_time": null,
                };
            } else {
                c = {
                    "id": datumElement["id"],
                    "type": datumElement["isfolder"] ? ItemTypes.folder : ItemTypes.file,
                    "name": datumElement["name"],
                    "size": null,
                    "shared": Cores.isShared(datumElement),
                    "modified_time": display_modified_time ? core(root_attr).format_dt(datumElement["modified"]) : null,
                };
                if (datumElement.hasOwnProperty("size")) {
                    c["size"] = parseInt(datumElement["size"]);
                }
                if (Cores.isSymlink(c)) {
                }
            }
            return c;
        },

        async getInfo(request, root_attr, id,) {
            let datumElement = await Cores.getMeta(request, root_attr, id);
            if (!datumElement) return null;
            return Cores.formatInfo(request, root_attr, datumElement);
        },

        async getInfoByPath(request, root_attr, path,) {
            const id = (await Cores.resolvePath(request, root_attr, path, -1))["id"];
            if (!id) return null;
            return Cores.getInfo(request, root_attr, id,);
        },

        async getMeta(request, root_attr, id,) {
            // if (core(root_attr)._is_privatespace(root_attr, id)) {
            //     return root_attr._privatespace_attr;
            // }
            const queryString = new URLSearchParams({
                ...core(root_attr)._attached_params, [core(root_attr).type_param(id)]: core(root_attr).sid2int(id),
            }).toString();
            const url = new URL(`${core(root_attr)._get_api_url(root_attr)}/stat?${queryString}`);
            let resp = await fetch(url, {
                ...attachBackend(url), method: 'GET', headers: {
                    ...core(root_attr)._attached_headers, 'Content-Type': 'application/json',
                },
            });
            let result = await resp.json();
            // console.log("getMeta", resp.status);
            if (resp.status !== 200 || result.result !== 0) return null;
            return result["metadata"];
        },

        async listFolder(request, root_attr, id) {
            const getList = pageToken => {
                // console.log("pageToken", pageToken)
                if (pageToken) {
                } else {
                    const qs = {
                        ...core(root_attr)._attached_params,
                        [core(root_attr).type_param(id)]: core(root_attr).sid2int(id),
                    };
                    const queryString = new URLSearchParams(qs).toString();
                    const url = new URL(`${core(root_attr)._get_api_url(root_attr)}/listfolder?${queryString}`);
                    return fetch(url, {
                        ...attachBackend(url), method: 'GET', headers: {
                            ...core(root_attr)._attached_headers, 'Content-Type': 'application/json',
                        },
                    });
                }
            };
            const files = [];
            let pageToken;
            do {
                let resp = await getList(pageToken);
                let data = await resp.text();
                // console.log("Cores.listFolder", id, resp, data,);
                data = JSON.parse(data);
                // if (data.errors && data.errors.length > 0) {
                //     throw Error(JSON.stringify(data.errors));
                // }
                files.push(...data.metadata.contents);
                // if (data.links && data["links"]["cursor"]["has_next"]) {
                //     pageToken = data["links"]["cursor"]["next"];
                // } else {
                pageToken = null;
                // }
            } while (pageToken);
            return {
                files
            };
        },

        async listFolderByPath(request, root_attr, path,) {
            let id = (await Cores.resolvePath(request, root_attr, path, 1))["id"];
            if (!id) return null;

            let list = [];
            let data = await Cores.listFolder(request, root_attr, id);
            for (const datumElement of data["files"]) {
                let c = await Cores.formatInfo(request, root_attr, datumElement);
                list.push(c);
            }
            list.sort((a, b) => {
                if (Cores.isFolder(a) && !Cores.isFolder(b)) {
                    return -1;
                }
                if (a.name < b.name) return 1;
                if (a.name > b.name) return 2;
                return 0;
            })
            return {
                "parent": root_attr.btn_goto_drive ? id : null, "list": list,
            };
        },

        async moveByPath(request, root_attr, data,) {
            // console.log("moveByPath", data);
            const {id: source_id, name,} = await Cores.resolvePath(request, root_attr, data["source"], -1);
            // console.log("moveByPath source_id", source_id);
            if (!source_id) return null;
            let to_id = (await Cores.resolvePath(request, root_attr, data["to"], 1))["id"];
            // console.log("moveByPath to_id", to_id);
            if (!to_id) return null;

            if (root_attr.unique_name && !await Cores.checkUniqueName(request, root_attr, to_id, name)) {
                return null;
            }

            const qs = {
                ...core(root_attr)._attached_params,
                [core(root_attr).type_param(source_id)]: core(root_attr).sid2int(source_id),
                tofolderid: core(root_attr).sid2int(to_id),
            };
            const queryString = new URLSearchParams(qs).toString();
            const url = new URL(`${core(root_attr)._get_api_url(root_attr)}/rename${core(root_attr).type_param(source_id).slice(0, -2)}?${queryString}`);
            const response = await fetch(url, {
                ...attachBackend(url), method: 'POST', headers: {
                    ...core(root_attr)._attached_headers, 'Content-Type': 'application/json',
                },
            });
            return response.json();
        },

        async renameByPath(request, root_attr, data,) {
            const {id: source_id, parents} = await Cores.resolvePath(request, root_attr, data["source"], -1,);
            if (!source_id) return null;

            if (root_attr.unique_name && !await Cores.checkUniqueName(request, root_attr, parents.at(-1)["id"], data["name"])) {
                return null;
            }

            const qs = {
                ...core(root_attr)._attached_params,
                [core(root_attr).type_param(source_id)]: core(root_attr).sid2int(source_id),
                toname: data["name"],
            };
            const queryString = new URLSearchParams(qs).toString();
            const url = new URL(`${core(root_attr)._get_api_url(root_attr)}/rename${core(root_attr).type_param(source_id).slice(0, -2)}?${queryString}`);
            const response = await fetch(url, {
                ...attachBackend(url), method: 'POST', headers: {
                    ...core(root_attr)._attached_headers, 'Content-Type': 'application/json',
                },
            });
            return response.json();
        },

        async shareByPath(request, root_attr, data,) {
            return null;
        },

        async trash(request, root_attr, did,) {
            const qs = {
                ...core(root_attr)._attached_params, [core(root_attr).type_param(did)]: core(root_attr).sid2int(did),
            };
            const queryString = new URLSearchParams(qs).toString();
            const url = new URL(`${core(root_attr)._get_api_url(root_attr)}/${core(root_attr).sid2type(did) === ItemTypes.folder ? "deletefolderrecursive" : "deletefile"}?${queryString}`);
            const response = await fetch(url, {
                ...attachBackend(url), method: 'POST', headers: {
                    ...core(root_attr)._attached_headers, 'Content-Type': 'application/json',
                },
            });
            return response.json();
        },

        async trashByPath(request, root_attr, data,) {
            const source_id = (await Cores.resolvePath(request, root_attr, data["source"], -1,))["id"];
            if (!source_id) return null;
            return await Cores.trash(request, root_attr, source_id);
        },

        async delete(request, root_attr, did,) {
            await Cores.trash(request, root_attr, did); // 先回收
            const qs = {
                ...core(root_attr)._attached_params, [core(root_attr).type_param(did)]: core(root_attr).sid2int(did),
            };
            const queryString = new URLSearchParams(qs).toString();
            const url = new URL(`${core(root_attr)._get_api_url(root_attr)}/trash_clear?${queryString}`);
            const response = await fetch(url, {
                ...attachBackend(url), method: 'POST', headers: {
                    ...core(root_attr)._attached_headers, 'Content-Type': 'application/json',
                },
            });
            return response.json();
            // return response.toString()
        },

        async deleteByPath(request, root_attr, data,) {
            const source_id = (await Cores.resolvePath(request, root_attr, data["source"], -1,))["id"];
            if (!source_id) return null;
            return await Cores.delete(request, root_attr, source_id);
        },

        async trashSelectedByPath(request, root_attr, data,) {
            const location_id = (await Cores.resolvePath(request, root_attr, data["location"], 1,))["id"];
            if (!location_id) return null;

            for (const name of data["names"]) {
                const source_id = await Cores.getId(request, root_attr, location_id, name, false,);
                if (!source_id) continue;
                if (source_id === "root") continue;
                await Cores.trash(request, root_attr, source_id);
            }
            return {};
        },

        async deleteSelectedByPath(request, root_attr, data,) {
            const location_id = (await Cores.resolvePath(request, root_attr, data["location"], 1,))["id"];
            if (!location_id) return null;

            for (const name of data["names"]) {
                const source_id = await Cores.getId(request, root_attr, location_id, name, false,);
                if (!source_id) continue;
                if (source_id === "root") continue;
                await Cores.delete(request, root_attr, source_id);
            }
            return {};
        },

        async replySelectedByPath(request, root_attr, data,) {
            const location_id = (await Cores.resolvePath(request, root_attr, data["location"], 1,))["id"];
            if (!location_id) return null;

            const results = [];

            for (const name of data["names"]) {
                const source_id = await Cores.getId(request, root_attr, location_id, name, false,);
                if (!source_id || source_id === "root") continue;

                const newName = name.includes('.') ? name.replace(/(\.[^.]*)$/, '【OK】$1') : `${name}【OK】`;

                await Cores.renameByPath(request, root_attr, {
                    source: `${data["location"]}/${name}`,
                    name: newName,
                });
            }
            return {};
        },

        async newFolderByPath(request, root_attr, data, path,) {
            let id = (await Cores.resolvePath(request, root_attr, path, 1))["id"];
            if (!id) return null;

            if (root_attr.unique_name && data["name"] && !await Cores.checkUniqueName(request, root_attr, id, data["name"])) {
                return null;
            }

            data["names"] = data.names || [];
            if (data["name"]) data["names"].push(data["name"]);
            let r = []
            for (const name of data["names"]) {
                if (root_attr.unique_name && !await Cores.checkUniqueName(request, root_attr, id, name)) {
                    continue;
                }
                const qs = {
                    ...core(root_attr)._attached_params,
                    [core(root_attr).type_param(id)]: core(root_attr).sid2int(id),
                    "name": name,
                };
                const queryString = new URLSearchParams(qs).toString();
                const url = new URL(`${core(root_attr)._get_api_url(root_attr)}/createfolder?${queryString}`);
                const response = await fetch(url, {
                    ...attachBackend(url), method: 'POST', headers: {
                        ...core(root_attr)._attached_headers, 'Content-Type': 'application/json',
                    },
                });
                // console.log("newFolderByPath", response.status, response);
                if (response.status !== 200) {
                    r.push(false);
                }
                r.push(await response.json());
            }
            return r;
        },

        async zipByPath(request, root_attr, data,) {
            return null;
        },

        async newShortcutByPath(request, root_attr, data, path,) {
            return null;
        },

        async copyFromByPath(request, root_attr, data, path,) {
            return null;
        },

        async resolveTree(request, root_attr, data, tree, summary, paths,) {
            let li = await Cores.listFolder(request, root_attr, data["source"]);
            for (const datumElement of li["files"]) {
                let c = await Cores.formatInfo(request, root_attr, datumElement);
                tree.children.push(c);
                if (Cores.isFolder(c, false)) {
                    c["children"] = [];
                    summary.folderCount++;
                    let id = Cores.isSymlink(c) ? c["symlink_target"]["id"] : c["id"];
                    if (!paths.includes(id)) {
                        await Cores.resolveTree(request, root_attr, {source: id,}, c, summary, [...paths, id,])
                    } else {
                        c["recur"] = true;
                    }
                } else {
                    summary.fileCount++;
                    summary.totalSize += parseInt(c["size"]);
                }
            }
        },

        async download(request, root_attr, meta, range) {
            let data;
            {
                const qs = {
                    ...core(root_attr)._attached_params,
                    [core(root_attr).type_param(meta["id"])]: core(root_attr).sid2int(meta["id"]),
                    forcedownload: "1",
                };
                const queryString = new URLSearchParams(qs).toString();
                const url = `${core(root_attr)._get_api_url(root_attr)}/getfilelink?${queryString}`;
                const headers = {};
                let resp = await fetch(url, {
                    ...attachBackend(url), method: 'GET', headers: headers,
                });
                data = await resp.json();
            }
            // console.log("download link", data);

            const qs = {
                ...core(root_attr)._attached_params,
                [core(root_attr).type_param(meta["id"])]: core(root_attr).sid2int(meta["id"]),
            };
            const queryString = new URLSearchParams(qs).toString();
            const url = `https://${data.hosts[0]}${data.path}?${queryString}`;
            const headers = {
                Range: range,
            };
            // console.log("download", url, headers);
            return fetch(url, {
                ...attachBackend(url), method: 'GET', headers: headers,
            });
        },

        async uploadByPath(request, root_attr, path, name,) {
            let id = (await Cores.resolvePath(request, root_attr, path, 1,))["id"];
            if (!id) return null;

            if (root_attr.unique_name && !await Cores.checkUniqueName(request, root_attr, id, name)) {
                return null;
            }

            const qs = {
                ...core(root_attr)._attached_params,
                [core(root_attr).type_param(id)]: core(root_attr).sid2int(id),
                nopartial: "1",
                renameifexists: "1",
                progresshash: getRandomString(8, 16),
                filename: name,
            };
            const queryString = new URLSearchParams(qs).toString();
            const url = `${core(root_attr)._get_api_url(root_attr)}/uploadfile?${queryString}`
            const headers = {
                'Content-Type': 'application/octet-stream'
            }

            // const formData = new FormData();
            // formData.append('file', file);

            // console.log(url, headers)
            const v = await fetch(url, {
                ...attachBackend(url), method: 'POST', headers: headers,

                // body: request.body, // netlify下报错400 // fastly也报错
                body: await preReadForUpload(request),

            });
            // console.log(v.status, v.headers, await v.text());
            return v;
        },

        async uploadNewSessionByPath(request, root_attr, path, name,) {
            return null;
        },

        async uploadGetProgress(request, root_attr, data,) {
            return null;
        },

        async uploadGoOn(request, root_attr, session,) {
            return null;
        },

    },

    [Types.fermyon_db_kv]: {
        ItemTypes: Object.freeze({
            file: 1, folder: 2,
        }), // 也用于位运算

        db_did_length: 14,

        async exec_sql(root_attr, sql, args = []) {
            // console.log("sql:", sql, args);
            let result = root_attr.db.execute(sql, args); // { columns: [], rows: [] }
            // console.log("result:", result);
            for (let i = 0; i < result.rows.length; i++) {
                result.rows[i].type = Number(result.rows[i].type);
                if (typeof result.rows[i].size === "bigint") {
                    result.rows[i].size = Number(result.rows[i].size);
                }
                result.rows[i].uploaded = Number(result.rows[i].uploaded);
            }
            return result;
        },

        isAuthorized(root_attr,) {
            return !!root_attr.Initialized;
        },

        can_trash: false,
        can_share: false,
        can_copy: false,
        can_shortcut: false,
        can_zip: false,
        can_chunk: false,
        can_resume: false,
        max_upload_size: 25, // 受平台限制，单个上传下载请求只能是10MB

        isShared(item) {
            return false;
        },

        async initializeClient(root_attr,) {
            if (root_attr.Initialized) {
                return;
            }
            root_attr.db = root_attr.env.Sqlite.open("default");
            root_attr.kv = root_attr.env.Kv.open("default");

            // sql = `DROP TABLE IF EXISTS ${root_attr.db_table_name};`; // 删表
            // await core(root_attr).exec_sql(root_attr, sql);

            sql = `CREATE TABLE IF NOT EXISTS ${root_attr.db_table_name}
                   (`; // 创建表
            sql += `did varchar(${core(root_attr).db_did_length}) PRIMARY KEY UNIQUE NOT NULL CHECK (LENGTH(did) == ${core(root_attr).db_did_length}),`;
            sql += `name varchar(10240) NOT NULL CHECK (LENGTH(name) > 0 AND LENGTH(name) <= 10240),`;
            sql += `type INTEGER NOT NULL CHECK (type IN (1, 2)),`; // 1=文件,2=文件夹
            sql += `size INTEGER NOT NULL DEFAULT 0 CHECK (size >= 0),`;
            sql += `hash varchar(40) CHECK (hash IS NULL OR LENGTH(hash) == 40),`;
            sql += `uploaded INTEGER NOT NULL DEFAULT 0 CHECK (uploaded IN (0, 1)),`; // 0=未上传
            sql += `uploaded_time TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,`; // DATETIME('now')不行，SELECT CURRENT_DATE;是常量
            sql += `parent varchar,`;
            sql += `CONSTRAINT parent_set FOREIGN KEY ("parent") REFERENCES "${root_attr.db_table_name}"("did") ON DELETE RESTRICT,`;
            sql += `CONSTRAINT no_self_reference CHECK (parent IS NULL OR did != parent),`;
            sql += `CHECK (uploaded_time LIKE '____-__-__ __:__:__')`; // 需要扩展才支持REGEXP '^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$'
            sql += `);`;
            await core(root_attr).exec_sql(root_attr, sql);

            // sql = `DROP TABLE IF EXISTS ${root_attr.db_table_name}_data;`; // 删表
            // await core(root_attr).exec_sql(root_attr, sql);

            sql = `CREATE TABLE IF NOT EXISTS ${root_attr.db_table_name}_data
                   (`; // 创建表
            sql += `id INTEGER PRIMARY KEY AUTOINCREMENT,`;
            sql += `did varchar(${core(root_attr).db_did_length}) NOT NULL,`;
            sql += `data TEXT`;
            sql += `);`;
            await core(root_attr).exec_sql(root_attr, sql);

            root_attr.Initialized = true;
        },

        async checkId(root_attr, id,) {
            if (id === "root") return true;
            sql = `SELECT *
                   FROM ${root_attr.db_table_name}
                   WHERE did = "${id}";`;
            let r = await core(root_attr).exec_sql(root_attr, sql);
            if (r["rows"] && r["rows"].length > 0) {
                return true;
            }
            return false;
        },

        async getId(request, root_attr, parentId, childName, resolve_symlink, includes = 0) {
            childName = childName.replace(/\'/g, `\\'`); // escape single quote
            if (parentId === "root") {
                sql = `SELECT *
                       FROM ${root_attr.db_table_name}
                       WHERE parent IS NULL
                         AND name = "${childName}"
                         AND uploaded = 1;`;
            } else {
                sql = `SELECT *
                       FROM ${root_attr.db_table_name}
                       WHERE parent = "${parentId}"
                         AND name = "${childName}"
                         AND uploaded = 1;`;
            } //  AND type = ${core(root_attr).ItemTypes.folder}
            if (includes > 0) {
                if (includes & core(root_attr).ItemTypes.file && includes & core(root_attr).ItemTypes.folder) {
                } else if (includes & core(root_attr).ItemTypes.file) {
                    sql = replaceWithLimit(sql, /AND/g, `AND type = ${core(root_attr).ItemTypes.file} AND`, 1);
                } else if (includes & core(root_attr).ItemTypes.folder) {
                    sql = replaceWithLimit(sql, /AND/g, `AND type = ${core(root_attr).ItemTypes.folder} AND`, 1);
                }
            }
            let r = await core(root_attr).exec_sql(root_attr, sql);
            if (r["rows"] && r["rows"].length > 0) {
                return r["rows"][0]["did"];
            }
        },

        async resolvePath(request, root_attr, path, resolve_symlink = 0, includes = 0) {
            const toks = path.split('/').map(decodeURIComponent).map(decodeURIComponent).filter(Boolean);
            let id = root_attr.id;
            let name = null;
            let parents = [];
            let rs = false;
            for (let i = 0; i < toks.length; i++) {
                if (resolve_symlink === 0) {
                    rs = false;
                } else if (resolve_symlink === 1) {
                    rs = true;
                } else if (resolve_symlink < 0) {
                    if (i - toks.length >= resolve_symlink) {
                        rs = false;
                    } else {
                        rs = true;
                    }
                }
                parents.push({id, name});
                id = await Cores.getId(request, root_attr, id, toks[i], rs, includes);
                name = toks[i];
                if (!id) return {id, name, parents};
            }
            console.log("Cores.resolvePath", id, toks,);
            return {id, name, parents};
        },

        async formatInfo(request, root_attr, datumElement,) {
            let c = {
                "id": datumElement["did"],
                "type": Number(datumElement["type"]) === core(root_attr).ItemTypes.folder ? ItemTypes.folder : ItemTypes.file,
                "name": datumElement["name"],
                "size": "size" in datumElement ? datumElement["size"] : null,
                "shared": Cores.isShared(datumElement),
                "modified_time": display_modified_time ? parseInt(new Date(datumElement["uploaded_time"]).getTime() / 1000) : null,
            };
            if (Cores.isSymlink(c)) {
            }
            return c;
        },

        async getInfo(request, root_attr, id,) {
            let datumElement = await Cores.getMeta(request, root_attr, id);
            return Cores.formatInfo(request, root_attr, datumElement);
        },

        async getInfoByPath(request, root_attr, path,) {
            const id = (await Cores.resolvePath(request, root_attr, path, -1))["id"];
            if (!id) return null;
            return Cores.getInfo(request, root_attr, id,);
        },

        async getMeta(request, root_attr, id,) {
            sql = `SELECT *
                   FROM ${root_attr.db_table_name}
                   WHERE did = "${id}"`;
            let r = (await core(root_attr).exec_sql(root_attr, sql)).rows[0];
            console.log("getMeta", r);
            return r;
        },

        async listFolder(request, root_attr, id) {
            if (id === "root") {
                sql = `SELECT *
                       FROM ${root_attr.db_table_name}
                       WHERE parent IS NULL
                         AND uploaded = 1
                       ORDER BY "type" DESC, "name" ASC;`;
            } else {
                sql = `SELECT *
                       FROM ${root_attr.db_table_name}
                       WHERE parent = "${id}"
                         AND uploaded = 1
                       ORDER BY "type" DESC, "name" ASC;`;
            }
            let r = await core(root_attr).exec_sql(root_attr, sql);
            if (r) {
                // sql = `SELECT * FROM ${root_attr.db_table_name} WHERE "did"="${id}";`;
                // console.log(await core(root_attr).exec_sql(root_attr,sql).first());
                return {
                    files: r["rows"],
                }
            }
        },

        async listFolderByPath(request, root_attr, path,) {
            let id = (await Cores.resolvePath(request, root_attr, path, 1, core(root_attr).ItemTypes.folder))["id"];
            if (!id) return null;

            let list = [];
            let data = await Cores.listFolder(request, root_attr, id);
            for (const datumElement of data["files"]) {
                let c = await Cores.formatInfo(request, root_attr, datumElement);
                list.push(c);
            }
            return {
                "parent": root_attr.btn_goto_drive ? id : null, "list": list,
            };
        },

        async moveByPath(request, root_attr, data,) {
            const {id: source_id, name,} = await Cores.resolvePath(request, root_attr, data["source"], -1);
            if (!source_id) return null;
            let to_id = (await Cores.resolvePath(request, root_attr, data["to"], 1))["id"];
            if (!to_id) return null;

            if (root_attr.unique_name && !await Cores.checkUniqueName(request, root_attr, to_id, name)) {
                return null;
            }

            if (source_id === "root") return {};
            if (to_id === "root") {
                sql = `UPDATE ${root_attr.db_table_name}
                       SET "parent"=NULL
                       WHERE "did" = "${source_id}";`;
            } else {
                sql = `UPDATE ${root_attr.db_table_name}
                       SET "parent"="${to_id}"
                       WHERE "did" = "${source_id}";`;
            }
            let r = await core(root_attr).exec_sql(root_attr, sql);
            return r;
        },

        async renameByPath(request, root_attr, data,) {
            const {id: source_id, parents} = await Cores.resolvePath(request, root_attr, data["source"], -1,);
            if (!source_id) return null;

            if (root_attr.unique_name && !await Cores.checkUniqueName(request, root_attr, parents.at(-1)["id"], data["name"])) {
                return null;
            }

            if (source_id === "root") return {};
            sql = `UPDATE ${root_attr.db_table_name}
                   SET "name"="${data["name"]}",
                       "uploaded_time"=CURRENT_TIMESTAMP
                   WHERE "did" = "${source_id}";`;
            let r = await core(root_attr).exec_sql(root_attr, sql);
            return r;
        },

        async shareByPath(request, root_attr, data,) {
            return null;
        },

        async trash(request, root_attr, did,) {
            return {};
        },

        async trashByPath(request, root_attr, data,) {
            await Cores.trash(request, root_attr, null);
        },

        async delete(request, root_attr, did) {
            let r = null;
            sql = `SELECT *
                   FROM ${root_attr.db_table_name}
                   WHERE parent = "${did}"
                     AND type = ${core(root_attr).ItemTypes.file}
                   ORDER BY "type" DESC, "name" ASC;`;
            r = await core(root_attr).exec_sql(root_attr, sql);
            let dids = [];
            for (const i of r["rows"]) {
                // await root_attr.kv.delete(i["did"]);
                dids.push(`"${i["did"]}"`);

                sql = `SELECT id, data
                       FROM ${root_attr.db_table_name}_data
                       WHERE "did" = "${i["did"]}"
                       ORDER BY "id" ASC;`;
                let rows = (await core(root_attr).exec_sql(root_attr, sql))["rows"];
                for (const row of rows) {
                    await root_attr.kv.delete(`${i["did"]}-${row["data"]}`);
                }
            }
            if (dids.length > 0) {
                sql = `DELETE
                       FROM ${root_attr.db_table_name}_data
                       WHERE did IN (${dids.join(",")})`;
                await core(root_attr).exec_sql(root_attr, sql);
                sql = `DELETE
                       FROM ${root_attr.db_table_name}
                       WHERE did IN (${dids.join(",")})`;
                await core(root_attr).exec_sql(root_attr, sql);
            }
            sql = `SELECT *
                   FROM ${root_attr.db_table_name}
                   WHERE parent = "${did}"
                     AND type = ${core(root_attr).ItemTypes.folder}
                   ORDER BY "type" DESC, "name" ASC;`;
            r = await core(root_attr).exec_sql(root_attr, sql);
            if (r["rows"]) {
                for (const i of r["rows"]) {
                    await Cores.delete(request, root_attr, i["did"]);
                }
            }
            sql = `SELECT *
                   FROM ${root_attr.db_table_name}
                   WHERE did = "${did}"
                     AND type = ${core(root_attr).ItemTypes.file}
                   ORDER BY "type" DESC, "name" ASC;`;
            r = await core(root_attr).exec_sql(root_attr, sql);
            for (const i of r["rows"]) {
                // await root_attr.kv.delete(i["did"]);

                sql = `SELECT id, data
                       FROM ${root_attr.db_table_name}_data
                       WHERE "did" = "${i["did"]}"
                       ORDER BY "id" ASC;`;
                let rows = (await core(root_attr).exec_sql(root_attr, sql))["rows"];
                for (const row of rows) {
                    await root_attr.kv.delete(`${i["did"]}-${row["data"]}`);
                }

            }
            dids = [];
            for (const i of r["rows"]) {
                dids.push(`"${i["did"]}"`);
            }
            if (dids.length > 0) {
                sql = `DELETE
                       FROM ${root_attr.db_table_name}_data
                       WHERE did IN (${dids.join(",")})`;
                await core(root_attr).exec_sql(root_attr, sql);
            }
            sql = `DELETE
                   FROM ${root_attr.db_table_name}
                   WHERE "did" = "${did}";`;
            await core(root_attr).exec_sql(root_attr, sql);
        },

        async deleteByPath(request, root_attr, data,) {
            const source_id = (await Cores.resolvePath(request, root_attr, data["source"], -1,))["id"];
            if (!source_id) return null;

            if (source_id === "root") return {};
            await Cores.delete(request, root_attr, source_id);
            return {};
        },

        async trashSelectedByPath(request, root_attr, data,) {
            return {};
        },

        async deleteSelectedByPath(request, root_attr, data,) {
            const location_id = (await Cores.resolvePath(request, root_attr, data["location"], 1,))["id"];
            if (!location_id) return null;

            for (const name of data["names"]) {
                const source_id = await Cores.getId(request, root_attr, location_id, name, false,);
                if (!source_id) continue;
                if (source_id === "root") continue;
                await Cores.delete(request, root_attr, source_id);
            }
            return {};
        },

        async replySelectedByPath(request, root_attr, data,) {
            const location_id = (await Cores.resolvePath(request, root_attr, data["location"], 1,))["id"];
            if (!location_id) return null;

            const results = [];

            for (const name of data["names"]) {
                const source_id = await Cores.getId(request, root_attr, location_id, name, false,);
                if (!source_id || source_id === "root") continue;

                const newName = name.includes('.') ? name.replace(/(\.[^.]*)$/, '【OK】$1') : `${name}【OK】`;

                await Cores.renameByPath(request, root_attr, {
                    source: `${data["location"]}/${name}`,
                    name: newName,
                });
            }
            return {};
        },

        async newFolderByPath(request, root_attr, data, path,) {
            let id = (await Cores.resolvePath(request, root_attr, path, 1))["id"];
            if (!id) return null;

            if (root_attr.unique_name && !await Cores.checkUniqueName(request, root_attr, id, data["name"])) {
                return null;
            }

            let randid = generateRandomString(core(root_attr).db_did_length);
            sql = `SELECT *
                   FROM ${root_attr.db_table_name}
                   WHERE "did" = "${randid}";`;
            let n = 0;
            while ((await core(root_attr).exec_sql(root_attr, sql)).rows.length > 0 && n < 100) {
                n++;
                randid = generateRandomString(core(root_attr).db_did_length);
                sql = `SELECT *
                       FROM ${root_attr.db_table_name}
                       WHERE "did" = "${randid}";`;
            }

            sql = `INSERT INTO ${root_attr.db_table_name} ("did", "name", "type", "uploaded", "parent")
                   VALUES (`;
            sql += `"${randid}", "${data["name"]}", ${core(root_attr).ItemTypes.folder}, 1, ${id === "root" ? "NULL" : `"${id}"`}`;
            sql += `);`;
            let r = await core(root_attr).exec_sql(root_attr, sql);
            return r;
        },

        async zipByPath(request, root_attr, data,) {
            return {};
        },

        async newShortcutByPath(request, root_attr, data, path,) {
            return {};
        },

        async copyFromByPath(request, root_attr, data, path,) {
            return {};
        },

        async resolveTree(request, root_attr, data, tree, summary, paths,) {
            let li = await Cores.listFolder(request, root_attr, data["source"]);
            for (const datumElement of li["files"]) {
                let c = await Cores.formatInfo(request, root_attr, datumElement);
                tree.children.push(c);
                if (Cores.isFolder(c, false)) {
                    c["children"] = [];
                    summary.folderCount++;
                    let id = Cores.isSymlink(c) ? c["symlink_target"]["id"] : c["id"];
                    if (!paths.includes(id)) {
                        await Cores.resolveTree(request, root_attr, {source: id,}, c, summary, [...paths, id,])
                    } else {
                        c["recur"] = true;
                    }
                } else {
                    summary.fileCount++;
                    summary.totalSize += parseInt(c["size"]);
                }
            }
        },

        async download(request, root_attr, meta, range) {
            let {start, end} = parseDownloadRange(range, meta);
            // console.log("download", start, end);
            // console.log("download getKV", await root_attr.kv.get(meta["id"]));
            // console.log("download getKV", await root_attr.kv.get(meta["id"], {type: 'arrayBuffer'}));

            // const fullBinaryData = new Uint8Array(await root_attr.kv.get(meta["id"], {type: 'arrayBuffer'}));//

            sql = `SELECT id, data
                   FROM ${root_attr.db_table_name}_data
                   WHERE "did" = "${meta["id"]}"
                   ORDER BY "id" ASC;`;
            let binaryString = await core(root_attr).exec_sql(root_attr, sql);
            // binaryString = binaryString[0]["data"];
            // let uint8Array = new Uint8Array(binaryString.length);
            // for (let i = 0; i < binaryString.length; i++) {
            //     uint8Array[i] = binaryString.charCodeAt(i);
            // }
            // const fullBinaryData = new Uint8Array(uint8Array);
            // const fullBinaryData = new Uint8Array(binaryString);

            // async function mergeArrayBuffers(bufferArray) {
            //     const totalLength = bufferArray.reduce((sum, buffer) => sum + Uint8Array.from(atob(buffer["data"]), c => c.charCodeAt(0)).byteLength, 0);
            //     let mergedBuffer = new Uint8Array(totalLength);
            //     let offset = 0;
            //     for (const buffer of bufferArray) {
            //         mergedBuffer.set(Uint8Array.from(atob(buffer["data"]), c => c.charCodeAt(0)), offset);
            //         offset += buffer["data"].byteLength;
            //     }
            //     return mergedBuffer;
            // }
            // async function mergeArrayBuffers(bufferArray) {
            //     // 解码并转换所有 base64 到 Uint8Array，一次性完成
            //     const chunks = bufferArray.map(buf =>
            //         Uint8Array.from(atob(buf.data), c => c.charCodeAt(0))
            //     );
            //     // 计算总字节长度
            //     const totalLength = chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);
            //     // 创建目标 Uint8Array
            //     const mergedBuffer = new Uint8Array(totalLength);
            //     // 合并所有 chunk
            //     let offset = 0;
            //     for (const chunk of chunks) {
            //         mergedBuffer.set(chunk, offset);
            //         offset += chunk.byteLength;
            //     }
            //     return mergedBuffer;
            // }
            async function mergeArrayBuffers(bufferArray) {
                // 解码并转换所有 base64 到 Uint8Array，一次性完成
                const chunks = [];
                for (const row of bufferArray) {
                    // console.log("getKV", `${meta["id"]}-${row["data"]}`, await root_attr.kv.get(`${meta["id"]}-${row["data"]}`, {type: 'arrayBuffer'}));
                    chunks.push(new Uint8Array(await root_attr.kv.get(`${meta["id"]}-${row["data"]}`, {type: 'arrayBuffer'})));
                }
                // 计算总字节长度
                const totalLength = chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);
                // 创建目标 Uint8Array
                const mergedBuffer = new Uint8Array(totalLength);
                // 合并所有 chunk
                let offset = 0;
                for (const chunk of chunks) {
                    mergedBuffer.set(chunk, offset);
                    offset += chunk.byteLength;
                }
                return mergedBuffer;
            }

            const fullBinaryData = await mergeArrayBuffers(binaryString["rows"]);


            const slicedBinaryData = fullBinaryData.slice(start, end + 1);
            return {
                status: range ? 206 : 200, body: slicedBinaryData, headers: {
                    "Content-Length": slicedBinaryData.length,
                    "Content-Range": `bytes ${start}-${end}/${fullBinaryData.length}`,
                },
            }
        },

        async uploadByPath(request, root_attr, path, name,) {
            let id = (await Cores.resolvePath(request, root_attr, path, 1,))["id"];
            if (!id) return null;

            if (root_attr.unique_name && !await Cores.checkUniqueName(request, root_attr, id, name)) {
                return null;
            }

            // const reader = request.body.getReader();
            // let chunks = '';
            // while (true) {
            //     const { done, value } = await reader.read();
            //     if (done) break;
            //     chunks += new TextDecoder().decode(value);
            // }
            // console.log(chunks);

            const arrayBuffer = await request.arrayBuffer();
            // const binaryData = new Uint8Array(arrayBuffer);
            // console.log("binaryData", binaryData.length, arrayBuffer.byteLength, arrayBuffer);

            let randid = generateRandomString(core(root_attr).db_did_length);
            sql = `SELECT *
                   FROM ${root_attr.db_table_name}
                   WHERE "did" = "${randid}";`;
            let n = 0;
            while ((await core(root_attr).exec_sql(root_attr, sql)).rows.length > 0 && n < 100) {
                n++;
                randid = generateRandomString(core(root_attr).db_did_length);
                sql = `SELECT *
                       FROM ${root_attr.db_table_name}
                       WHERE "did" = "${randid}";`;
            }

            sql = `INSERT INTO ${root_attr.db_table_name} ("did", "name", "type", "uploaded", "parent", "size")
                   VALUES (`;
            sql += `"${randid}", "${name}", ${core(root_attr).ItemTypes.file}, 0, ${id === "root" ? "NULL" : `"${id}"`},`;
            sql += `${arrayBuffer.byteLength}`;
            sql += `);`;
            await core(root_attr).exec_sql(root_attr, sql);

            // await root_attr.kv.set(randid, binaryData); // 它的kv的value最大为1MB

            // if (arrayBuffer.byteLength > 0) { // 用db分片也只能储存2MB
            //     const chunkSize = 1 * 128 * 1024;
            //     const totalSize = arrayBuffer.byteLength;
            //     let arrayBuffers = [];
            //     for (let start = 0; start < totalSize; start += chunkSize) {
            //         const end = Math.min(start + chunkSize, totalSize);
            //         arrayBuffers.push(new Uint8Array(arrayBuffer.slice(start, end)));
            //         // sql = `INSERT INTO ${root_attr.db_table_name}_data (\`did\`, \`data\`) VALUES (`;
            //         // sql += `?, ?`;
            //         // sql += `);`;
            //         // await core(root_attr).exec_sql(root_attr, sql, [randid, arrayBuffer.slice(start, end),]);
            //     }
            //     sql = `INSERT INTO ${root_attr.db_table_name}_data ("did", "data") VALUES `;
            //     let args = [];
            //     let _ = 0;
            //     arrayBuffers.map((buffer) => {
            //         sql += `(?, ?) `;
            //         _++;
            //         if (_ < arrayBuffers.length) {
            //             sql += ", "
            //         }
            //         args.push(randid);
            //         // args.push(buffer)
            //         args.push(btoa(String.fromCharCode(...buffer)))
            //     });
            //     sql += `;`;
            //     await core(root_attr).exec_sql(root_attr, sql, args);
            // }

            if (arrayBuffer.byteLength > 0) { // 改为用db储存分段id，用kv存实际数据
                const chunkSize = 1 * 768 * 1024;
                const totalSize = arrayBuffer.byteLength;
                let arrayBuffers = [];
                for (let start = 0; start < totalSize; start += chunkSize) {
                    const end = Math.min(start + chunkSize, totalSize);
                    arrayBuffers.push(new Uint8Array(arrayBuffer.slice(start, end)));
                    // sql = `INSERT INTO ${root_attr.db_table_name}_data (\`did\`, \`data\`) VALUES (`;
                    // sql += `?, ?`;
                    // sql += `);`;
                    // await core(root_attr).exec_sql(root_attr, sql, [randid, arrayBuffer.slice(start, end),]);
                }
                sql = `INSERT INTO ${root_attr.db_table_name}_data ("did", "data")
                       VALUES `;
                let args = [];
                let _ = 0;

                arrayBuffers.map((buffer) => {
                    sql += `(?, ?) `;
                    _++;
                    if (_ < arrayBuffers.length) {
                        sql += ", "
                    }
                    args.push(randid);
                    args.push(`${_}`);
                });
                _ = 0;
                const promises = arrayBuffers.map(async (buffer) => {
                    _++;
                    return await root_attr.kv.set(`${randid}-${_}`, buffer);
                });
                await Promise.all(promises);

                sql += `;`;
                await core(root_attr).exec_sql(root_attr, sql, args);
            }


            sql = `UPDATE ${root_attr.db_table_name}
                   SET "uploaded"=1,
                       "uploaded_time"=CURRENT_TIMESTAMP
                   WHERE "did" = "${randid}";`;
            let r = await core(root_attr).exec_sql(root_attr, sql);
            return r;
        },

        async uploadNewSessionByPath(request, root_attr, path, name,) {
            return null;
        },

        async uploadGetProgress(request, root_attr, data,) {
            return null;
        },

        async uploadGoOn(request, root_attr, session,) {
            return null;
        },

    },

    [Types.infomaniak_drive]: {
        base_api_url: "https://api.infomaniak.com",

        get_Authorization(root_attr,) {
            return root_attr.Authorization;
        },

        isAuthorized(root_attr,) {
            return true;
            // console.log("isAuthorized", Cores.access_token);
            return !!root_attr.access_token;
        },

        can_trash: true,
        can_share: false,
        can_copy: false,
        can_shortcut: false,
        can_zip: true,
        can_chunk: false,
        can_resume: false,
        max_upload_size: -1,

        isShared(item) {
            if (!item) {
                return false;
            }
            if ("shared" in item && item["shared"]) {
                return true;
            }
            return false;
        },

        async initializeClient(root_attr,) {
            root_attr.Authorization = `Bearer ${root_attr.api_token}`;
        },

        async checkId(root_attr, id,) {
            if (id === "root" || id === "1") return true;
            const queryString = new URLSearchParams({}).toString();
            const url = new URL(`${core(root_attr).base_api_url}/3/drive/${root_attr.drive_id}/files/${id}?${queryString}`);
            let resp = await fetch(url, {
                ...attachBackend(url), method: 'GET', headers: {
                    'Content-Type': 'application/json', Authorization: core(root_attr).get_Authorization(root_attr),
                },
            });
            // console.log(resp, await resp.json())
            if (resp.status === 200) {
                const data = await resp.json();
                if (data.result !== "success") return false;
                return true;
            }
            return false;
        },

        async getId(request, root_attr, parentId, childName, resolve_symlink) {
            childName = childName.replace(/\'/g, `\\'`);
            let list = [];
            let data = await Cores.listFolder(request, root_attr, parentId);
            for (const datumElement of data["files"]) {
                let c = await Cores.formatInfo(request, root_attr, datumElement);
                list.push(c);
            }
            for (const listElement of list) {
                if (listElement["name"] === childName) {
                    return listElement["id"];
                }
            }
            return null;
        },

        async resolvePath(request, root_attr, path, resolve_symlink = 0) {
            const toks = path.split('/').map(decodeURIComponent).map(decodeURIComponent).filter(Boolean);
            let id = root_attr.id;
            let name = null;
            let parents = [];
            let rs = false;
            for (let i = 0; i < toks.length; i++) {
                if (resolve_symlink === 0) {
                    rs = false;
                } else if (resolve_symlink === 1) {
                    rs = true;
                } else if (resolve_symlink < 0) {
                    if (i - toks.length >= resolve_symlink) {
                        rs = false;
                    } else {
                        rs = true;
                    }
                }
                parents.push({id, name});
                id = await Cores.getId(request, root_attr, id, toks[i], rs);
                name = toks[i];
                if (!id) return {id, name, parents};
            }
            console.log("Cores.resolvePath", id, toks,);
            return {id, name, parents};
        },

        async formatInfo(request, root_attr, datumElement,) {
            let c = {
                "id": datumElement["id"].toString(),
                "type": datumElement["type"] === "dir" ? ItemTypes.folder : ItemTypes.file,
                "name": datumElement["name"],
                "size": "size" in datumElement ? datumElement["size"] : null,
                "shared": Cores.isShared(datumElement),
                "modified_time": display_modified_time ? parseInt(datumElement["last_modified_at"]) : null,
            };
            if (Cores.isSymlink(c)) {
                //     c["symlink_target"] = {
                //         "id": datumElement["shortcutDetails"]["targetId"],
                //         "type": datumElement["shortcutDetails"]["targetMimeType"] in core(root_attr).MimeTypes ? core(root_attr).MimeTypes[datumElement["shortcutDetails"]["targetMimeType"]] : ItemTypes.file,
                //     };
                //     let cc = await Cores.getMeta(request, root_attr, c["symlink_target"]["id"]);
                //     if (c["symlink_target"]["type"] === ItemTypes.file) {
                //         if (cc) { // 如果目标被删除，就得不到size了
                //             c["size"] = cc["size"];
                //         }
                //     }
                //     c["shared"] = Cores.isShared(cc);
            }
            return c;
        },

        async getInfo(request, root_attr, id,) {
            let datumElement = await Cores.getMeta(request, root_attr, id);
            if (!datumElement) return null;
            return Cores.formatInfo(request, root_attr, datumElement);
        },

        async getInfoByPath(request, root_attr, path,) {
            const id = (await Cores.resolvePath(request, root_attr, path, -1))["id"];
            if (!id) return null;
            return Cores.getInfo(request, root_attr, id,);
        },

        async getMeta(request, root_attr, id,) {
            const queryString = new URLSearchParams({}).toString();
            const url = new URL(`${core(root_attr).base_api_url}/3/drive/${root_attr.drive_id}/files/${id}?${queryString}`);
            let resp = await fetch(url, {
                ...attachBackend(url), method: 'GET', headers: {
                    'Content-Type': 'application/json', Authorization: core(root_attr).get_Authorization(root_attr),
                },
            });
            // console.log("getMeta", resp.status);
            if (resp.status !== 200) return null;
            const data = await resp.json();
            if (data.result !== "success") return null;
            return data["data"];
        },

        async listFolder(request, root_attr, id) {
            const getList = pageToken => {
                const qs = {
                    order_by: "name", order_direction: "asc", limit: 1000
                };
                if (pageToken) {
                    qs.cursor = pageToken;
                }
                const queryString = new URLSearchParams(qs).toString();
                const url = new URL(`${core(root_attr).base_api_url}/3/drive/${root_attr.drive_id}/files/${id}/files?${queryString}`);
                return fetch(url, {
                    ...attachBackend(url), method: 'GET', headers: {
                        'Content-Type': 'application/json', Authorization: core(root_attr).get_Authorization(root_attr),
                    },
                });
            };
            const files = [];
            let pageToken;
            do {
                let resp = await getList(pageToken);
                let data = await resp.json();
                // console.log("Cores.listFolder", id, resp, data,);
                files.push(...data.data);
                pageToken = data.cursor;
            } while (pageToken);
            return {
                files
            };
        },

        async listFolderByPath(request, root_attr, path,) {
            let id = (await Cores.resolvePath(request, root_attr, path, 1))["id"];
            if (!id) return null;

            let list = [];
            let data = await Cores.listFolder(request, root_attr, id);
            for (const datumElement of data["files"]) {
                let c = await Cores.formatInfo(request, root_attr, datumElement);
                list.push(c);
            }
            return {
                "parent": root_attr.btn_goto_drive ? id : null, "list": list,
            };
        },

        async moveByPath(request, root_attr, data,) {
            // console.log("moveByPath", data);
            const {id: source_id, name,} = await Cores.resolvePath(request, root_attr, data["source"], -1);
            // console.log("moveByPath source_id", source_id);
            if (!source_id) return null;
            let to_id = (await Cores.resolvePath(request, root_attr, data["to"], 1))["id"];
            // console.log("moveByPath to_id", to_id);
            if (!to_id) return null;

            if (root_attr.unique_name && !await Cores.checkUniqueName(request, root_attr, to_id, name)) {
                return null;
            }

            const qs = {};
            const queryString = new URLSearchParams(qs).toString();
            const url = new URL(`${core(root_attr).base_api_url}/3/drive/${root_attr.drive_id}/files/${source_id}/move/${to_id}?${queryString}`);
            const response = await fetch(url, {
                ...attachBackend(url), method: 'POST', headers: {
                    'Content-Type': 'application/json', Authorization: core(root_attr).get_Authorization(root_attr),
                },
            });
            return response.json();
        },

        async renameByPath(request, root_attr, data,) {
            const {id: source_id, parents} = await Cores.resolvePath(request, root_attr, data["source"], -1,);
            if (!source_id) return null;

            if (root_attr.unique_name && !await Cores.checkUniqueName(request, root_attr, parents.at(-1)["id"], data["name"])) {
                return null;
            }

            const qs = {};
            const queryString = new URLSearchParams(qs).toString();
            const url = new URL(`${core(root_attr).base_api_url}/2/drive/${root_attr.drive_id}/files/${source_id}/rename?${queryString}`);
            const response = await fetch(url, {
                ...attachBackend(url), method: 'POST', headers: {
                    'Content-Type': 'application/json', Authorization: core(root_attr).get_Authorization(root_attr),
                }, body: JSON.stringify({
                    "name": data["name"],
                }),
            });
            return response.json();
        },

        async shareByPath(request, root_attr, data,) {
            return null;
        },

        async trash(request, root_attr, did,) {
            const qs = {};
            const queryString = new URLSearchParams(qs).toString();
            const url = new URL(`${core(root_attr).base_api_url}/2/drive/${root_attr.drive_id}/files/${did}?${queryString}`);
            const response = await fetch(url, {
                ...attachBackend(url), method: 'DELETE', headers: {
                    'Content-Type': 'application/json', Authorization: core(root_attr).get_Authorization(root_attr),
                }, body: JSON.stringify({}),
            });
            return response.json();
        },

        async trashByPath(request, root_attr, data,) {
            const source_id = (await Cores.resolvePath(request, root_attr, data["source"], -1,))["id"];
            if (!source_id) return null;
            return await Cores.trash(request, root_attr, source_id);
        },

        async delete(request, root_attr, did,) {
            await Cores.trash(request, root_attr, did); // 先回收
            const qs = {};
            const queryString = new URLSearchParams(qs).toString();
            const url = new URL(`${core(root_attr).base_api_url}/2/drive/${root_attr.drive_id}/trash/${did}?${queryString}`);
            const response = await fetch(url, {
                ...attachBackend(url), method: 'DELETE', headers: {
                    'Content-Type': 'application/json', Authorization: core(root_attr).get_Authorization(root_attr),
                },
            });
            // return response.json();
            return response.status.toString()
        },

        async deleteByPath(request, root_attr, data,) {
            const source_id = (await Cores.resolvePath(request, root_attr, data["source"], -1,))["id"];
            if (!source_id) return null;
            return await Cores.delete(request, root_attr, source_id);
        },

        async trashSelectedByPath(request, root_attr, data,) {
            const location_id = (await Cores.resolvePath(request, root_attr, data["location"], 1,))["id"];
            if (!location_id) return null;

            for (const name of data["names"]) {
                const source_id = await Cores.getId(request, root_attr, location_id, name, false,);
                if (!source_id) continue;
                if (source_id === "root") continue;
                await Cores.trash(request, root_attr, source_id);
            }
            return {};
        },

        async deleteSelectedByPath(request, root_attr, data,) {
            const location_id = (await Cores.resolvePath(request, root_attr, data["location"], 1,))["id"];
            if (!location_id) return null;

            for (const name of data["names"]) {
                const source_id = await Cores.getId(request, root_attr, location_id, name, false,);
                if (!source_id) continue;
                if (source_id === "root") continue;
                await Cores.delete(request, root_attr, source_id);
            }
            return {};
        },

        async replySelectedByPath(request, root_attr, data,) {
            const location_id = (await Cores.resolvePath(request, root_attr, data["location"], 1,))["id"];
            if (!location_id) return null;

            const results = [];

            for (const name of data["names"]) {
                const source_id = await Cores.getId(request, root_attr, location_id, name, false,);
                if (!source_id || source_id === "root") continue;

                const newName = name.includes('.') ? name.replace(/(\.[^.]*)$/, '【OK】$1') : `${name}【OK】`;

                await Cores.renameByPath(request, root_attr, {
                    source: `${data["location"]}/${name}`,
                    name: newName,
                });
            }
            return {};
        },

        async newFolderByPath(request, root_attr, data, path,) {
            let id = (await Cores.resolvePath(request, root_attr, path, 1))["id"];
            if (!id) return null;

            if (root_attr.unique_name && data["name"] && !await Cores.checkUniqueName(request, root_attr, id, data["name"])) {
                return null;
            }

            data["names"] = data.names || [];
            if (data["name"]) data["names"].push(data["name"]);
            let r = []
            for (const name of data["names"]) {
                if (root_attr.unique_name && !await Cores.checkUniqueName(request, root_attr, id, name)) {
                    continue;
                }
                const qs = {};
                const queryString = new URLSearchParams(qs).toString();
                const url = new URL(`${core(root_attr).base_api_url}/3/drive/${root_attr.drive_id}/files/${id}/directory?${queryString}`);
                const response = await fetch(url, {
                    ...attachBackend(url), method: 'POST', headers: {
                        'Content-Type': 'application/json', Authorization: core(root_attr).get_Authorization(root_attr),
                    }, body: JSON.stringify({
                        "name": name,
                    }),
                });
                // console.log("newFolderByPath", response.status, response);
                if (response.status !== 200) {
                    r.push(false);
                }
                r.push(await response.json());
            }
            return r;
        },

        async zipByPath(request, root_attr, data,) {
            const location = data['location'];
            const names = data['names'];
            const location_id = (await Cores.resolvePath(request, root_attr, location, 1,))?.id;
            if (!location_id) throw new Error(`Location ID Error: ${location_id}`);

            let filename = 'archive.zip';

            const file_ids = [];
            if (names.length === 1) {
                filename = names.at(0);
            } else if (location.length > 0) {
                filename = location.split('/').pop();
            }

            for (const name of names) {
                const raw_id = await Cores.getId(request, root_attr, location_id, name, false,);
                if (!raw_id || raw_id === "root") continue;

                const file_id = Number(raw_id);

                if (!Number.isSafeInteger(file_id) || file_id <= 0) continue;

                file_ids.push(file_id);
            }
            if (file_ids.length === 0) throw new Error(`File IDs Empty: file_ids -> ${file_ids}`);

            let uuid_url = new URL(`${core(root_attr).base_api_url}/3/drive/${root_attr.drive_id}/files/archives`)

            const uuid_response = await fetch(uuid_url, {
                ...attachBackend(uuid_url), method: 'POST', headers: {
                    'Content-Type': 'application/json', Authorization: core(root_attr).get_Authorization(root_attr),
                }, body: JSON.stringify({
                    "except_file_ids": [],
                    "file_ids": file_ids,
                    "parent_id": location_id,
                })
            });
            const uuid_data = await uuid_response.json();
            console.log(`uuid_data: ${JSON.stringify(uuid_data)}`)
            if (uuid_data.result !== 'success' || !uuid_data.data?.uuid) throw new Error(`UUID Response Error`);
            const uuid = uuid_data.data.uuid;
            let url = new URL(`${core(root_attr).base_api_url}/2/drive/${root_attr.drive_id}/files/archives/${encodeURIComponent(uuid)}`)
            const response = await fetch(url, {
                ...attachBackend(url), method: 'GET', headers: {
                    Authorization: core(root_attr).get_Authorization(root_attr),
                },
                redirect: 'follow'
            })
            if (!response.ok) throw new Error(`Archive download failed: ${response.status}`);
            if (!response.body) throw new Error('Empty archive');

            return new Response(response.body, {
                status: 200,
                headers: {
                    "Content-Type": "application/zip",
                    "Content-Disposition": `attachment; filename="${filename}"`,
                    "Cache-Control": "no-store",
                },
            });
        },

        async newShortcutByPath(request, root_attr, data, path,) {
            return null;
        },

        async copyFromByPath(request, root_attr, data, path,) {
            return null;
        },

        async resolveTree(request, root_attr, data, tree, summary, paths,) {
            return null;
        },

        async download(request, root_attr, meta, range) {
            const qs = {};
            const queryString = new URLSearchParams(qs).toString();
            const url = new URL(`${core(root_attr).base_api_url}/2/drive/${root_attr.drive_id}/files/${meta["id"]}/download?${queryString}`);
            return fetch(url, {
                ...attachBackend(url),
                method: 'GET',
                headers: {Authorization: core(root_attr).get_Authorization(root_attr), Range: range,},
            });
        },

        async uploadByPath(request, root_attr, path, name,) {
            let id = (await Cores.resolvePath(request, root_attr, path, 1,))["id"];
            if (!id) return null;

            if (root_attr.unique_name && !await Cores.checkUniqueName(request, root_attr, id, name)) {
                return null;
            }

            const data = await preReadForUpload(request);

            const qs = {
                "directory_id": id, "file_name": name, "total_size": data.length, "conflict": "rename",
            };
            const queryString = new URLSearchParams(qs).toString();
            const url = new URL(`${core(root_attr).base_api_url}/3/drive/${root_attr.drive_id}/upload?${queryString}`);
            const response = await fetch(url, {
                ...attachBackend(url), method: 'POST', headers: {
                    'Content-Type': 'application/json', Authorization: core(root_attr).get_Authorization(root_attr),
                }, body: data,
            });
            return response;
        },

        async uploadNewSessionByPath(request, root_attr, path, name,) {
            return null;
        },

        async uploadGetProgress(request, root_attr, data,) {
            return null;
        },

        async uploadGoOn(request, root_attr, session,) {
            return null;
        },

    },

}


async function htmlTemplate(request, root_attr, params) {
    let r;
    let _c = 0;
    while (true) {
        try {
            _c++;
            const url = new URL(`https://raw.githubusercontent.com/jaidenbrakus/xjekigvx/main/src/FDIndexv${FDIndex_version}.html`);
            r = await (await fetch(url, {...attachBackend(url),})).text();
            break;
        } catch (e) {
            if (_c > 3) {
                throw e;
            }
        }
    }
    r = r.replace(`<title>FDIndex</title>`, `<title>${!root_attr ? drive_page_settings.title : root_attr.title}</title>`);
    r = r.replace(`href="data:;base64,="`, `href="${logo}"`);
    // if (root_attr.icon.length > 0) {r = r.replace(`href="data:;base64,="`, `href="${root_attr.icon}"`); }
    r = r.replace(`<span>FDIndex</span>`, `<span>${first_layer_as_drive ? drive_page_settings.title : root_attr.title}</span>`);
    r = r.replace(`const FDIndex_version = null;`, `const FDIndex_version = "${FDIndex_version}";`);
    r = r.replace(/window\.root_attr\s=\s\{[\s\S]+?};/, `        
window.root_attr = {
    "unique": ${roots.length === 1},
    "id": "${!root_attr ? null : root_attr.btn_goto_drive ? root_attr.id : null}",
    "type": ${!root_attr ? 1 : root_attr.type},
    "upload": ${!root_attr ? false : root_attr.upload},
    "download": ${!root_attr ? false : root_attr.download},
    "download_as_zip": ${!root_attr ? false : root_attr.download_as_zip},
    "new_folder": ${!root_attr ? false : root_attr.new_folder},
    "new_shortcut": ${!root_attr ? false : root_attr.new_shortcut},
    "copy_from": ${!root_attr ? false : root_attr.copy_from},
    "rename": ${!root_attr ? false : root_attr.rename},
    "share": ${!root_attr ? false : root_attr.share},
    "move": ${!root_attr ? false : root_attr["move"]},
    "trash": ${!root_attr ? false : root_attr.trash},
    "delete": ${!root_attr ? false : root_attr.delete},
    "reply": ${!root_attr ? false : root_attr.reply},
    "unique_name": ${!root_attr ? false : root_attr.unique_name},
    "btn_goto_drive": ${!root_attr ? false : root_attr.btn_goto_drive},
    "auto_upload_after_drop": ${!root_attr ? false : root_attr.auto_upload_after_drop},
    "disallowed_upload": "${!root_attr ? "" : root_attr.disallowed_upload}",
    
    "multiple_selection": ${multiple_selection},
    "first_layer_as_drive": ${first_layer_as_drive},
    
    "can_trash": ${!root_attr ? false : Cores.can_trash},
    "can_share": ${!root_attr ? false : Cores.can_share},
    "can_copy": ${!root_attr ? false : Cores.can_copy},
    "can_shortcut": ${!root_attr ? false : Cores.can_shortcut},
    "can_zip": ${!root_attr ? false : Cores.can_zip},
    "can_resume": ${!root_attr ? false : Cores.can_resume},
    "max_upload_size": ${!root_attr ? 4 : Cores.max_upload_size},
};
`);

    let colorMap = {};
    if (params.get("theme") === "dark") {
        colorMap = {
            "background-color: #CEEACAFF;": "background-color: #40406C; color: white;", // background
            // "#1976D2": "", // btn:main
            // "color: white;": "color: #;", // text item:background
            // "#2088ee": "", // btn:hover border
            // "#165ba6": "", // btn:active
            // "#959595": "", // btn:disabled
            // "#c6d8ef": "", // process:fetching
            // "#f3f3f3": "", // process:uploading
            "background-color: #CEEACA;": "background-color: #40406C;", // item dialog
            "color: black;": "color: white;", // item:text
            "#666666": "#e7e7e7", // item:meta:text
            "#1976D1": "#76E3FF", // tabitem:text
            "fill='%23737373": "fill='%23e7e7e7", // item:meta:text
            "fill='%23444444": "fill='%23e7e7e7", // checkbox
        }
    } else if (prefer_white_background) {
        colorMap = {
            "background-color: #CEEACAFF;": "background-color: white;", // background
            "background-color: #CEEACA;": "background-color: white;", // item dialog
        }
    }
    for (const colorMapElement in colorMap) {
        r = r.replaceAll(colorMapElement, colorMap[colorMapElement]);
    }

    return new Response(r, {headers: {'Content-Type': 'text/html; charset=utf-8'}});
}

async function onGet(request, root_attr) {
    // console.log("onGet", request, root_attr)
    const url = new URL(request.url);
    const params = new URLSearchParams(url.search);
    let {
        pathname: path
    } = request;
    if (path.startsWith('/~_~:)/resources/')) {
        const remain = path.replace('/~_~:)/resources/', '');
        const url = new URL(`https://raw.githubusercontent.com/${remain}`);
        const r = await fetch(url, {...attachBackend(url),});
        return new Response(r.body, {
            headers: {
                // 'Content-Type': mime.getType(remain) + '; charset=utf-8',
                'Cache-Control': 'max-age=600'
            }
        });
    } else if (path.substr(-1) === '/') {
        return await htmlTemplate(request, root_attr, params);
    }


    if (params.get("zip")) {
        if (!root_attr.download_as_zip) {
            return new Response('403', {status: 403});
        }
        let meta = await Cores.getInfoByPath(request, root_attr, path,);
        if (!meta) {
            return new Response('404', {status: 404});
        }
        let meta_zip = await Cores.getInfo(request, root_attr, params.get("zip"));
        if (!meta_zip || Cores.isFolder(meta_zip, false)) {
            return new Response('404', {status: 404});
        }
        let sid = meta_zip["name"].match(/^([a-zA-Z0-9_-]+)\.zip$/);
        if (sid && sid[1].startsWith(meta["id"])) {
            meta_zip["name"] = `${formatTimestamp(Date.now() / 1000, "YYYYMMDDHHmmss")}-${meta["name"]}.zip`;
            return await download(request, root_attr, meta_zip,);
        }
        return new Response('400', {status: 400});
    } else {
        if (!root_attr.download) {
            return new Response('403', {status: 403});
        }

        if (check_first_layer(request)) {
            if (isPlatform(Platforms.vercel)) {
                // 它自对去掉了末尾的/
                return await htmlTemplate(request, root_attr, params);
            } else {
                let url = new URL(request.url);
                url.pathname = url.pathname + "/";
                return new Response(null, {
                    status: 301, headers: {"Location": url.toString()}
                });
            }
        }

        let meta = await Cores.getInfoByPath(request, root_attr, path,);
        // console.log("getInfoByPath", meta);
        if (!meta) {
            return new Response('404', {status: 404});
        }
        const name = meta["name"];
        if (Cores.isSymlink(meta)) {
            meta = await Cores.getInfo(request, root_attr, meta["symlink_target"]["id"]);
            meta["name"] = name;
        }

        if (Cores.isFolder(meta)) {
            if (isPlatform(Platforms.vercel)) {
                // 它自对去掉了末尾的/
                return await htmlTemplate(request, root_attr, params);
            } else {
                let url = new URL(request.url);
                url.pathname = url.pathname + "/";
                return new Response(null, {
                    status: 301, headers: {"Location": url.toString()}
                });
            }
        }

        return await download(request, root_attr, meta,);
    }

}

async function download(request, root_attr, meta,) {
    let rangeHeader = request.headers.get('Range');
    if (rangeHeader === null) {
        rangeHeader = "bytes=0-";
    }
    let {start, end} = parseDownloadRange(rangeHeader, meta);
    if (Cores.can_chunk && chunked_download_if_filesize_great_than > 0 && parseInt(meta["size"], 10) / 1024 / 1024 > chunked_download_if_filesize_great_than) {
        const rangeValue = `bytes=${start}-${end}`;
        const contentLength = end - start + 1;
        const r = await Cores.download(request, root_attr, meta, rangeValue);
        const h = new Headers(r.headers);
        h.delete("etag"); // 删掉，它导致浏览器不能断点。
        h.set('Content-Disposition', `attachment; filename="${encodeURIComponent(meta.name)}"; filename*=UTF-8''${encodeURIComponent(meta.name)}`);
        h.set('Content-Length', contentLength.toString());
        h.set('Content-Range', `bytes ${start}-${end}/${meta["size"]}`);
        return new Response(new ReadableStream({
            start(controller) {
                const reader = r.body.getReader();

                function read() {
                    reader.read().then(({done, value}) => {
                        if (done) {
                            controller.close();
                            return;
                        }
                        controller.enqueue(value);
                        read();
                    }).catch(error => {
                        controller.error(error);
                    });
                }

                read();
            }
        }), {
            status: rangeHeader ? 206 : 200, headers: h,
        });
    }
    const r = await Cores.download(request, root_attr, meta, rangeHeader);
    // console.log("meta", meta);
    // console.log("download.r", r.status, r.headers, rangeHeader);
    // console.log("download.r", await r.text());
    const h = new Headers(r.headers);
    h.delete("etag"); // 删掉，它导致浏览器不能断点。
    h.set('Content-Disposition', `attachment; filename="${encodeURIComponent(meta.name)}"; filename*=UTF-8''${encodeURIComponent(meta.name)}`);
    // console.log("download.s", h,);
    return new Response(r.body, {status: r.status, headers: h});
}

async function onPost(request, root_attr) {
    const url = new URL(request.url);
    const params = new URLSearchParams(url.search);
    let {
        pathname: path
    } = request;
    let data = await request.text();
    // console.log("onPost", request,);
    // console.log("onPost data", data.length, data);
    data = JSON.parse(data);

    if (first_layer_as_drive) {
        if (["move", "rename", "share", "trash", "delete", "zip",].includes(data["action"])) {
            data["source"] = remove_first_layer_path_part(data["source"]);
        }
        if (["move",].includes(data["action"])) {
            data["to"] = remove_first_layer_path_part(data["to"]);
        }
        if (["trash_selected", "delete_selected", "reply_selected"].includes(data["action"])) {
            data["location"] = remove_first_layer_path_part(data["location"]);
        }
        if (["resolve_tree",].includes(data["action"])) {
            if (data["local"]) {
                data["source"] = remove_first_layer_path_part(data["source"]);
            }
        }
    }

    if (data["action"] === "list") {
        let _l;
        if (!root_attr) { // 列出网盘
            _l = {"parent": null, "list": [],}
            for (const root of roots) {
                let i = {
                    "id": root.btn_goto_drive ? root["id"] : "null",
                    "type": ItemTypes.drive,
                    "name": root["title"],
                    "size": null,
                    "shared": false,
                    "modified_time": null,
                };
                _l["list"].push(i);
            }
        } else {
            _l = await Cores.listFolderByPath(request, root_attr, path,);
            if (_l == null) {
                return new Response('404', {status: 404});
            }
        }
        return new Response(JSON.stringify(_l), {
            headers: {'Content-Type': 'application/json',}
        });
    } else if (data["action"] === "permission") {
        return new Response(JSON.stringify(await Cores.permissionByPath(request, root_attr, data,)), {
            headers: {'Content-Type': 'application/json',}
        });
    } else if (data["action"] === "move" && root_attr["move"]) {
        return new Response(JSON.stringify(await Cores.moveByPath(request, root_attr, data,)), {
            headers: {'Content-Type': 'application/json',}
        });
    } else if (data["action"] === "rename" && root_attr.rename) {
        return new Response(JSON.stringify(await Cores.renameByPath(request, root_attr, data,)), {
            headers: {'Content-Type': 'application/json',}
        });
    } else if (data["action"] === "share" && root_attr.share) {
        return new Response(JSON.stringify(await Cores.shareByPath(request, root_attr, data,)), {
            headers: {'Content-Type': 'application/json',}
        });
    } else if (data["action"] === "zip" && root_attr.download_as_zip && root_attr.can_zip) {
        return await Cores.zipByPath(request, root_attr, data);
    } else if (data["action"] === "upload_new_session" && root_attr.upload) {
        let toks = path.split('/').map(decodeURIComponent).map(decodeURIComponent).filter(Boolean);
        let name = toks.pop();
        let _rr = checkUploadFilename(root_attr, name);
        if (_rr) return _rr;
        path = toks.map(element => encodeURIComponent(element)).join("/");
        return new Response(JSON.stringify(await Cores.uploadNewSessionByPath(request, root_attr, path, name,)), {
            headers: {'Content-Type': 'application/json',}
        });
    } else if (data["action"] === "upload_get_progress" && root_attr.upload) {
        return new Response(JSON.stringify(await Cores.uploadGetProgress(request, root_attr, data,)), {
            headers: {'Content-Type': 'application/json',}
        });
    } else if (data["action"] === "new_folder" && root_attr.new_folder) {
        return new Response(JSON.stringify(await Cores.newFolderByPath(request, root_attr, data, path,)), {
            headers: {'Content-Type': 'application/json',}
        });
    } else if (data["action"] === "new_shortcut" && root_attr.new_shortcut) {
        return new Response(JSON.stringify(await Cores.newShortcutByPath(request, root_attr, data, path,)), {
            headers: {'Content-Type': 'application/json',}
        });
    } else if (data["action"] === "copy_from" && root_attr.copy_from) {
        return new Response(JSON.stringify(await Cores.copyFromByPath(request, root_attr, data, path,)), {
            headers: {'Content-Type': 'application/json',}
        });
    } else if (data["action"] === "resolve_tree" && root_attr.copy_from) {
        let tree;
        if (data["local"]) {
            tree = await Cores.getInfoByPath(request, root_attr, data["source"]);
            data["source"] = tree["id"]
        } else {
            tree = await Cores.getInfo(request, root_attr, data["source"]);
        }
        let summary = {
            fileCount: 0, folderCount: 0, totalSize: 0,
        }
        if (tree) {
            if (Cores.isFolder(tree, false)) {
                tree["children"] = [];
                summary.folderCount++;
                let paths = [Cores.isSymlink(tree) ? tree["symlink_target"]["id"] : tree["id"],];
                await Cores.resolveTree(request, root_attr, {source: paths[0]}, tree, summary, paths)
            } else {
                summary.fileCount++;
                summary.totalSize += parseInt(tree["size"]);
            }
        }
        return new Response(JSON.stringify({tree, summary}), {
            headers: {'Content-Type': 'application/json',}
        });
    } else if (data["action"] === "trash" && root_attr.trash) {
        return new Response(JSON.stringify(await Cores.trashByPath(request, root_attr, data,)), {
            headers: {'Content-Type': 'application/json',}
        });
    } else if (data["action"] === "delete" && root_attr.delete) {
        return new Response(JSON.stringify(await Cores.deleteByPath(request, root_attr, data,)), {
            headers: {'Content-Type': 'application/json',}
        });
    } else if (data["action"] === "trash_selected" && multiple_selection && root_attr.trash) {
        return new Response(JSON.stringify(await Cores.trashSelectedByPath(request, root_attr, data,)), {
            headers: {'Content-Type': 'application/json',}
        });
    } else if (data["action"] === "delete_selected" && multiple_selection && root_attr.delete) {
        return new Response(JSON.stringify(await Cores.deleteSelectedByPath(request, root_attr, data,)), {
            headers: {'Content-Type': 'application/json',}
        });
    } else if (data["action"] === "reply_selected" && multiple_selection && root_attr.reply) {
        return new Response(JSON.stringify(await Cores.replySelectedByPath(request, root_attr, data,)), {
            headers: {'Content-Type': 'application/json',}
        });
    }
    return new Response('403', {status: 403});
}

async function onPut(request, root_attr) {
    // console.log("onPut", request.url, Object.fromEntries(request.headers));
    // console.log("onPut", request);
    const url = new URL(request.url);
    const params = new URLSearchParams(url.search);

    if (!root_attr.upload) {
        return new Response('403', {status: 403});
    }

    if (params.get("resume") === "1") {
        return new Response(JSON.stringify(await Cores.uploadGoOn(request, root_attr, JSON.parse(params.get("session")),)), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    let {
        pathname: path
    } = request;
    let toks = path.split('/').map(decodeURIComponent).map(decodeURIComponent).filter(Boolean);
    let name = toks.pop();

    let _rr = checkUploadFilename(root_attr, name);
    if (_rr) return _rr;

    return new Response(JSON.stringify(await Cores.uploadByPath(request, root_attr, toks.map(element => encodeURIComponent(element)).join("/"), name)), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

async function onDelete(request, root_attr) {

}

function checkUploadFilename(root_attr, name) {
    for (let disallowedUploadElement of root_attr.disallowed_upload.split(/[；，、;,\s]+/).map(decodeURIComponent).map(decodeURIComponent).filter(i => i.trim() !== '')) {
        if (!disallowedUploadElement.startsWith('.')) {
            disallowedUploadElement = "." + disallowedUploadElement;
        }
        if (name.endsWith(disallowedUploadElement)) {
            return new Response("The file type isn't allowed.", {
                headers: {
                    'Content-Type': 'text/plain'
                }, status: 405
            });
        }
    }
    return null;
}

function replaceWithLimit(str, search, replacement, limit) {
    let count = 0;
    return str.replace(search, (match) => {
        count++;
        return count <= limit ? replacement : match;
    });
}

function formatTimestamp(timestamp, format) {
    const date = new Date((timestamp + (8 * 60 * 60)) * 1000);
    const map = {
        'YYYY': date.getUTCFullYear(),
        'MM': String(date.getUTCMonth() + 1).padStart(2, '0'),
        'DD': String(date.getUTCDate()).padStart(2, '0'),
        'HH': String(date.getUTCHours()).padStart(2, '0'),
        'mm': String(date.getUTCMinutes()).padStart(2, '0'),
        'ss': String(date.getUTCSeconds()).padStart(2, '0')
    };
    return format.replace(/YYYY|MM|DD|HH|mm|ss/g, matched => map[matched]);
}

function getRandomString(min, max) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = Math.floor(Math.random() * (max - min + 1)) + min;
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function parseDownloadRange(rangeHeader, meta,) {
    let start = 0;
    let end = meta["size"] - 1;
    if (rangeHeader) {
        const rangeMatch = rangeHeader.match(/bytes=(\d+)-(\d+)?/);
        if (rangeMatch) {
            start = parseInt(rangeMatch[1], 10);
            if (rangeMatch[2]) {
                end = parseInt(rangeMatch[2], 10);
            }
        }
    }
    return {start, end};
}

async function streamToUint8Array(stream) {
    const reader = stream.getReader();
    const chunks = [];
    while (true) {
        const {done, value} = await reader.read();
        if (done) break;
        if (value && value.length > 0) {
            chunks.push(value);
        }
    }
    // 合并所有 chunk 成一个 Uint8Array
    let totalLength = chunks.reduce((acc, curr) => acc + curr.length, 0);
    // console.log("streamToUint8Array", "totalLength", totalLength);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
        result.set(chunk, offset);
        offset += chunk.length;
    }
    return result;
}

async function requestToUint8Array(request) {
    const buffer = await request.arrayBuffer();
    return new Uint8Array(buffer);
}

async function preReadForUpload(request) {
    // if (Platform === Platforms.wasmer) { // streamToUint8Array怎么在wasmer读取不到数据？ // getReader有些平台可能未实现，改为统一用arrayBuffer
    let d = await requestToUint8Array(request);
    // console.log("preReadForUpload", d.length,);
    return d;
    // } else {
    //     let d = await streamToUint8Array(request.body);
    //     console.log("preReadForUpload", d.length,);
    //     return d;
    // }
    // return request.body;
}

function bufferToStream(buffer) {
    return new ReadableStream({
        start(controller) {
            controller.enqueue(new Uint8Array(buffer));
            controller.close();
        }
    });
}

function bigint_replacer(key, value) {
    return typeof value === "bigint" ? Number(value) : value;
}

function attachBackend(url) {
    if (isPlatform(Platforms.fastly)) {
        // const _backends = {"www.googleapis.com": "wwwgoogleapiscom",}
        if (typeof url === "string") url = new URL(url);
        return {
            // backend: _backends[url.hostname],
            backend: url.hostname.replace(/\./g, ''),
        };
    }
    return {};
}

function remove_first_layer_path_part(pathname) {
    const path = pathname.split("/");
    for (let i = 0; i < path.length; i++) {
        const string = decodeURIComponent(path[i]);
        if (string.length >= 1) {
            for (const root of roots) {
                if (root.id === string || root.title === string) {
                    return path.slice(i + 1).join("/");
                }
            }
        }
    }
}

function get_root_attr(request) {
    if (first_layer_as_drive) {
        const _ewg = request.pathname.endsWith("/");
        const path = request.pathname.split("/");
        // console.log(path, _ewg)
        for (let i = 0; i < path.length; i++) {
            const string = decodeURIComponent(path[i]);
            if (string.length > 0) {
                for (const root of roots) {
                    if (root.id === string || root.title === string) {
                        request.pathname = path.slice(i + 1).join("/")
                        if (_ewg) request.pathname += "/"
                        // console.log(path.slice(i + 1), request.pathname)
                        return root;
                    }
                }
            }
        }
    } else {
        const url = new URL(request.url);
        const params = new URLSearchParams(url.search);
        const root_id = params.get('ri');
        const root_title = params.get('rt');
        for (const root of roots) {
            if (root.id === root_id) {
                return root;
            } else if (root.title === root_title) {
                return root;
            }
        }
        if (root_id == null && root_title == null && roots.length === 1) {
            return roots[0];
        }
    }
    return null;
}

function parseBasicAuth(auth) {
    try {
        return atob(auth.split(' ').pop()).split(':');
    } catch (e) {
        return [];
    }
}

function doBasicAuth(request, attr) {
    const auth = Object.fromEntries(request.headers)["authorization"]
    if (!auth || !/^Basic [A-Za-z0-9._~+/-]+=*$/i.test(auth)) {
        return false;
    }
    const [user, pass] = parseBasicAuth(auth);
    return user === attr.user && pass === attr.pass;
}

function unauthorized() {
    return new Response('Unauthorized', {
        headers: {
            'WWW-Authenticate': 'Basic realm="goindex"', 'Access-Control-Allow-Origin': '*'
        }, status: 401
    });
}

function isPlatform(p) {
    return Platform === p || Platform === Platforms.unknown
}

function type_check(root_attr,) {
    if (!Object.values(Types).includes(root_attr.type)) {
        return false;
    }
    if (root_attr.type === Types.cf_d1_kv) {
        if (!isPlatform(Platforms.cloudflare)) {
            return false;
        } else if (!root_attr.env.hasOwnProperty(root_attr.binding_kv)) {
            return false;
        } else if (!root_attr.env.hasOwnProperty(root_attr.binding_db)) {
            return false;
        }
    }
    if (root_attr.type === Types.deno_mysql) {
        if (!isPlatform(Platforms.deno)) {
            return false;
        }
    }
    if (root_attr.type === Types.netlify_blob) {
        if (!isPlatform(Platforms.netlify)) {
            return false;
        }
    }
    // if (root_attr.type === Types.pcloud) {
    //     if (!isPlatform(Platforms.deno) && !isPlatform(Platforms.netlify)) {
    //         return false; // cf里用不了otplib，fastly里因为不支持动态后端导致不能下载文件
    //     }
    // }
    return true;
}

function generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
    }
    return result;
}

function generateToken(timestamp) {
    const bytes = new TextEncoder().encode(timestamp.toString());
    return btoa(String.fromCharCode(...bytes));
}

function parseToken(token) {
    if (!token) {
        return 0;
    }
    let base64 = token;
    while (base64.length % 4) base64 += '=';
    const timestampString = atob(base64)
    return parseInt(timestampString, 10);
}

function check_first_layer(request) {
    return first_layer_as_drive && (request.pathname.length === 0 || request.pathname === "/")
}

function generateRandomUrl() {
    const randomIndex = Math.floor(Math.random() * default_urls.length);
    return Response.redirect(default_urls[randomIndex], 302);
}

async function handleRequest(request, env) {
    if (request.method === 'OPTIONS') return new Response('', {
        status: 200, headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, HEAD, OPTIONS'
        }
    });
    // console.log(request.url, request.pathname)

    // 用来判断的变量
    let is_from_home = false; // 是否是用户输入的直链
    let is_allowed = false; // 是否符合筛选链接的要求
    let is_authed = true; // 是否校验

    // 当筛选链接和跳转链接都存在时, 验证输入链接是否符合条件, 不符合条件就跳转到其他链接
    if (default_urls.length > 0 && allowed_paths.length > 0) {
        const url = new URL(request.url);

        // 获取请求头
        const origin = request.headers.get('Origin');
        const referer = request.headers.get('Referer');
        const fetchDest = request.headers.get('sec-fetch-dest');

        // 当存在fetch请求时
        // 特征：sec-fetch-dest 是 empty (或不存在)，且包含 Origin
        if (fetchDest === 'empty' || origin) {
            // 当原链接不包含hostname的时候，说明是从第三方域名进入的，此时看作用户输入
            if (!(origin && origin.includes(url.hostname))) {
                is_from_home = true;
            }
        }

        // 判断是否是从直接链接进入的
        if (fetchDest === 'document') {
            if (!(referer && referer.startsWith(url.hostname))) {
                // Referer 为空，说明是直接输入地址或点击书签
                is_from_home = true;
            }
        }

        for (let path of allowed_paths) {
            if (request.pathname.startsWith("/" + path + "/")) {
                is_allowed = true;
                break;
            }
        }
    }

    request.pathname = request.pathname.split('/').map(decodeURIComponent).map(decodeURIComponent).join('/');
    const root_attr = get_root_attr(request);
    // console.log("root_attr", root_attr);
    if (!root_attr) {
        if (!check_first_layer(request)) {
            return new Response('Not Found', {status: 404});
        }
    }

    if (root_attr) {
        try {
            if (root_attr.type === Types.google_drive) {
                core(root_attr).can_zip = root_attr.script_deployment_id.length > 0;
            }

            if (isPlatform(Platforms.deno)) {
                if (root_attr.type === Types.deno_mysql && root_attr.db_platform === DatabasePlatforms.tidbcloud) {
                    // import {Client} from "https://deno.land/x/mysql/mod.ts";
                    // import mysql from "npm:mysql2@^3.11.5/promise";
                    mysql = await import("npm:mysql2@^3.11.5/promise");
                }
            }

            if (isPlatform(Platforms.netlify) && root_attr.type === Types.netlify_blob) {
                if (root_attr.db_platform === DatabasePlatforms.tidbcloud) {
                    // import { connect } from 'https://esm.sh/@tidbcloud/serverless'
                    // const conn = connect({url: Netlify.env.get('DATABASE_URL')})
                    // const result = await conn.execute('show databases')
                    mysql = await import('https://esm.sh/@tidbcloud/serverless')
                } else if (root_attr.db_platform === DatabasePlatforms.neon) { // 500MB,所以只用来储存结构，文件存到blobs
                    // import { neon } from '@netlify/neon';
                    // const sql = neon(); // automatically uses env NETLIFY_DATABASE_URL
                    // const [post] = await sql`SELECT * FROM posts WHERE id = ${postId}`;
                    mysql = await import("https://esm.sh/@netlify/neon");
                    blobs = await import("https://esm.sh/@netlify/blobs");
                }
            }

            if (isPlatform(Platforms.fermyon)) {
                if (root_attr.type === Types.fermyon_db_kv) {
                    // const {Kv, Sqlite} = await import("@fermyon/spin-sdk"); // 不支持动态导入，已改为在index.ts里导入
                    // console.log("import spin-sdk", Kv, Sqlite);
                    //
                    // kv = Kv;
                    // mysql = Sqlite;

                    // let store = Kv.openDefault()
                    // store.set("mykey", "myvalue")
                    // store.get("mykey")

                    // let conn = Sqlite.openDefault();
                    // let result = conn.execute("SELECT * FROM todos WHERE id > (?);", [1]);

                }
            }

            if (root_attr.type === Types.pcloud) {
                let otplib;
                if (isPlatform(Platforms.deno) || isPlatform(Platforms.netlify)) {
                    otplib = await import("https://esm.sh/otplib@12.0.1?bundle&exports=authenticator");
                    totp_authenticator = otplib.authenticator;
                    totp_authenticator.get_code = async (key) => {
                        return totp_authenticator.generate(key);
                    }
                } else if (isPlatform(Platforms.vercel)) {
                    // otplib = await import('otplib'); // 用不了，The edge runtime does not support Node.js 'crypto' module.
                    // totp_authenticator = otplib.authenticator;
                    // totp_authenticator.get_code = async (key) => {
                    //     return totp_authenticator.generate(key);
                    // }

                    // otplib = env.TOTP; // deno的totp库也用不了，https://deno.land/x/totp@1.0.1
                    // totp_authenticator = otplib;
                    // totp_authenticator.get_code = async (key) => {
                    //     return await totp_authenticator.getTOTP(key, {
                    //         interval: 30,
                    //         digits: 6
                    //     })
                    // }
                }
            }

        } catch (e) {
            console.error("import error", e);
        }
        await initEnvironment(request, env, root_attr,);
        // console.log("handleRequest", request);

        if (root_attr.auth && !doBasicAuth(request, root_attr)) {
            if (root_attr.accept_drive_page_auth) {
                if (!first_layer_as_drive || !drive_page_settings.auth || !doBasicAuth(request, drive_page_settings)) {
                    is_authed = false;
                }
            } else {
                is_authed = false;
            }
        }

        if (root_attr.auth && !is_authed) {
            let url = new URL(request.url);
            const token = url.searchParams.get("Token");
            if (is_allowed) {
                return unauthorized();
            } else if (!is_allowed && is_from_home && (!is_allowed && is_from_home && (Date.now() - parseToken(token) < 5 * 60 * 1000))) {
                return unauthorized();
            } else {
                return generateRandomUrl();
            }
        }

        // 二段校验
        if (root_attr.auth && is_allowed && is_from_home) {
            let url = new URL(request.url);
            return new Response(null, {
                status: 302,
                headers: {
                    "Location": "https://" + url.hostname + "/?Token=" + generateToken(Date.now()),
                }
            });
        }

        root_attr.env = env;
        if (!type_check(root_attr,)) {
            return new Response('Type Error', {status: 404});
        }

        let _functions = ['isAuthorized', 'initializeClient', 'checkId', 'getId', 'resolvePath', "isShared", 'getInfo', 'getInfoByPath', 'getMeta', 'formatInfo', 'listFolder', 'listFolderByPath', 'moveByPath', 'renameByPath', 'shareByPath', 'newFolderByPath', 'zipByPath', 'newShortcutByPath', 'copyFromByPath', 'resolveTree', "trash", 'trashByPath', "delete", 'deleteByPath', 'trashSelectedByPath', 'deleteSelectedByPath', 'replySelectedByPath', 'download', 'uploadByPath', 'uploadNewSessionByPath', 'uploadGetProgress', 'uploadGoOn', 'can_trash', 'can_share', 'can_copy', 'can_shortcut', 'can_zip', 'can_chunk', 'can_resume', 'max_upload_size',];
        for (let s of _functions) {
            Cores[s] = core(root_attr)[s];
        }
        let _undefined_functions = [];
        for (let s of _functions) {
            if (typeof Cores[s] == "undefined") {
                _undefined_functions.push(s);
            }
        }
        if (_undefined_functions.length > 0) {
            return new Response(`Undefined Functions: \n${_undefined_functions.join("\n")}`, {status: 404});
        }

        await Cores.initializeClient(root_attr,);
        // console.log("isAuthorized?");
        if (!Cores.isAuthorized(root_attr,)) {
            return new Response('Unauthorized', {headers: {}, status: 401});
        }
        // console.log("Authorized");

        if (!await Cores.checkId(root_attr, root_attr.id)) {
            return new Response('404', {status: 404});
        }
        // console.log("checkId ok");
    } else {
        if (drive_page_settings.auth && !doBasicAuth(request, drive_page_settings)) {
            if (drive_page_settings.accept_drive_auths) {
                let _a = false;
                for (const ra of roots) {
                    if (ra.auth && doBasicAuth(request, ra)) {
                        _a = true;
                        break;
                    }
                }
                if (!_a) {
                    return unauthorized();
                }
            } else {
                return unauthorized();
            }
        }
    }
    let resp;
    if (request.method === 'GET') resp = await onGet(request, root_attr); else if (request.method === 'POST') resp = await onPost(request, root_attr); else if (request.method === 'PUT') resp = await onPut(request, root_attr); else if (request.method === 'DELETE') resp = await onDelete(request, root_attr); else resp = new Response('', {
        status: 405
    });
    // console.log("handleRequest response", resp);
    const obj = Object.create(null);
    for (const [k, v] of resp.headers.entries()) {
        obj[k] = v;
    }
    return new Response(resp.body, {
        status: resp.status, statusText: resp.statusText, headers: Object.assign(obj, {
            'Access-Control-Allow-Origin': '*'
        })
    });
}


async function initEnvironment(request, env, root_attr) {
    if ((Platform === Platforms.fastly || Platform === Platforms.fermyon) && root_attr.type === Types.zoho_workdrive) {
        Cores[Types.zoho_workdrive]._attached_headers["Accept-Encoding"] = "identity"; // fastly对解压支持有问题
    }
    if (root_attr.type === Types.pcloud && root_attr.id === "root") {
        root_attr.id = "d0";
    }
    if (root_attr.type === Types.infomaniak_drive && root_attr.id === "root") {
        root_attr.id = "1";
    }
}

function testEnvironment(request, env) {
    // console.log("platform", Platform,);
    // console.log("request", request,);
    // console.log("env", env,);
    // console.log("self", self, self?.constructor?.name,);
    // console.log("globalThis", globalThis, globalThis?.constructor?.name,);
    // console.log("globalKeys", JSON.stringify(Object.getOwnPropertyNames(globalThis), null, 2));
    return new Response(JSON.stringify({
        platform: typeof Platform === "string" ? Platform : "[non-serializable]",
        request: {
            method: request.method, url: request.url, headers: Object.fromEntries(request.headers.entries()),
        },
        env: typeof env === "object" ? Object.keys(env) : env,
        self: typeof self === "undefined" ? "undefined" : "[self omitted]",
        process: typeof process === "undefined" ? "undefined" : process,
        globalKeys: Object.getOwnPropertyNames(globalThis),
    }), {
        status: 200, headers: {
            'Content-Type': 'application/json'
        }
    });
}

// addEventListener('fetch', event => { event.respondWith(); });
export default {
    async fetch(request, env) {
        // return testEnvironment(request, env);

        let event = {request: request};
        const url = new URL(event.request.url);

        // if (request.method === "POST") {
        //     console.log("body", globalThis.FastlyBody,);
        //     console.log("body-text", await request.text(),);
        //     // console.log("body-bytes", await streamToUint8Array(request.body),);
        // }

        let body = event.request.body;
        if (body && (Platform === Platforms.fastly)) { // fastly下必须要先把数据读出来
            // console.log("pre-read body", Platform, body);
            // body = await event.request.arrayBuffer();
            const uint8Array = await streamToUint8Array(body);
            body = bufferToStream(uint8Array.buffer);
            // console.log("pre-read body finished", Platform, body, uint8Array,);
        }
        // if (event.request.body && (Platform === Platforms.fastly)) {
        //     const uint8Array = await streamToUint8Array(body);
        //     body = bufferToStream(uint8Array.buffer);
        //     console.log("read", uint8Array);
        // }

        const updatedRequest = new Request(url.href, {
            method: event.request.method, headers: Object.fromEntries(event.request.headers), body: body,
        });
        updatedRequest.pathname = url.pathname;
        // console.log("updatedRequest", updatedRequest);

        try {
            return await handleRequest(updatedRequest, env);
        } catch (err) {
            console.error(url, err, err.payload,);
            return new Response(JSON.stringify({
                name: err.name, message: err.message, stack: err.stack, payload: err.payload,
            }), {
                status: 500, headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        // return handleRequest(updatedRequest, env).catch(err => {
        //     console.error(url, err);
        //     return new Response(JSON.stringify({name: err.name, message: err.message, stack: err.stack,}), {
        //         status: 500, headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     });
        // });
    },
};


