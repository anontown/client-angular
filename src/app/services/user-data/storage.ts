import { Topic, Res, AtApiService, IAuthToken } from 'anontown';

interface StorageJSON {
    ver: string,
    topicFav: string[],
    topicRead: { topic: string, res: string }[],
}

export class Storage {
    static VER = "0.0.0";
    topicFav: Topic[];
    topicRead: { topic: Topic, res: Res }[];

    private constructor() {
        this.topicFav = [];
        this.topicRead = [];
    }

    static async fromJSON(api: AtApiService, token: IAuthToken): Promise<Storage> {
        let json = await api.getTokenStorage(token);
        if (json.length !== 0) {
            var j = JSON.parse(json) as StorageJSON;
            switch (j.ver) {
                case "0.0.0":
                    {
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
                            j.topicRead.forEach(x =>
                                s.topicRead.push({
                                    topic: readTopic.find(t => t.id === x.topic) as Topic,
                                    res: readRes.find(r => r.id === x.res) as Res
                                })
                            );
                        }

                        return s;
                    }
            }
        }
        return new Storage();
    }

    toJSON(): string {
        var j: StorageJSON = { ver: Storage.VER, topicFav: this.topicFav.map(x => x.id), topicRead: [] };
        this.topicRead.forEach((x) => {
            j.topicRead.push({ topic: x.topic.id, res: x.res.id });
        });

        return JSON.stringify(j);
    }

    isFavo(topic: Topic): boolean {
        return this.topicFav.find(x => x.id === topic.id) !== undefined;
    }

    isRead(topic: Topic): boolean {
        return this.topicRead.find(x => x.topic.id === topic.id) !== undefined;
    }
}