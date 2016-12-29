import { Topic, Res, AtApiService, IAuthToken } from 'anontown';

interface StorageJSON {
    ver: string
}

interface StorageJSON1_0_0 {
    ver: "1.0.0",
    topicFav: string[],
    topicRead: { topic: string, res: string }[],
}

interface StorageJSON2 {
    ver: "2",
    topicFav: string[],
    topicRead: { topic: string, res: string, count: number }[]
}

export class Storage {
    static VER: "2" = "2";
    topicFav: Topic[];
    topicRead: { topic: Topic, res: Res, count: number }[];

    private constructor() {
        this.topicFav = [];
        this.topicRead = [];
    }

    static convert1_1_1To2(val: StorageJSON1_0_0): StorageJSON2 {
        return {
            ver: "2",
            topicFav: val.topicFav,
            topicRead: val.topicRead.map(x => {
                return {
                    topic: x.topic,
                    res: x.res,
                    count: 0
                }
            })
        };
    }


    static async fromJSON(api: AtApiService, token: IAuthToken): Promise<Storage> {
        let json = await api.getTokenStorage(token);
        if (json.length !== 0) {
            let obj = JSON.parse(json) as StorageJSON;
            while (true) {
                switch (obj.ver) {
                    case "0.0.0":
                        //バージョン0
                        obj = this.convert1_1_1To2(obj as StorageJSON1_0_0);
                        break;
                    case Storage.VER:
                        {
                            let j = obj as StorageJSON2;

                            var s = new Storage();
                            //お気に入りトピックリスト
                            s.topicFav = await api.findTopicIn({ ids: j.topicFav });

                            //ここまで読んだリスト
                            {
                                let readTopic = await api.findTopicIn({
                                    ids: j.topicRead.map(x => x.topic)
                                });
                                let readRes = await api.findResIn(token, {
                                    ids: j.topicRead.map(x => x.res)
                                });
                                s.topicRead = j.topicRead.map(x => {
                                    return {
                                        topic: readTopic.find(t => t.id === x.topic) as Topic,
                                        res: readRes.find(r => r.id === x.res) as Res,
                                        count: x.count
                                    };
                                });
                            }

                            return s;
                        }
                    default:
                        return new Storage();
                }
            }
        } else {
            return new Storage();
        }
    }

    toJSON(): string {
        let j: StorageJSON2 = {
            ver: Storage.VER,
            topicFav: this.topicFav.map(x => x.id),
            topicRead: this.topicRead.map(x => {
                return { topic: x.topic.id, res: x.res.id, count: x.count };
            })
        };

        return JSON.stringify(j);
    }

    isFavo(topic: Topic): boolean {
        return this.topicFav.find(x => x.id === topic.id) !== undefined;
    }

    isRead(topic: Topic): boolean {
        return this.topicRead.find(x => x.topic.id === topic.id) !== undefined;
    }
}